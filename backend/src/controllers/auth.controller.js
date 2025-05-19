import { generateToken } from "../lib/utils.js";
import { sendEmail, getOTPEmailTemplate } from "../lib/email.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import sanitizeHtml from "sanitize-html"; // Added for sanitization
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
	const { fullname, email, password, language, enableTextToSpeech } = req.body;

	try {
		// Validate required fields
		if (!fullname || !email || !password) {
			return res
				.status(400)
				.json({ message: "Full name, email, and password are required" });
		}

		// Sanitize fullname
		const sanitizedFullname = sanitizeHtml(fullname.trim(), {
			allowedTags: [],
			allowedAttributes: {},
		});

		if (!sanitizedFullname) {
			return res.status(400).json({ message: "Invalid full name" });
		}

		// Validate email format
		const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email format" });
		}

		// Validate password complexity
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(password)) {
			return res.status(400).json({
				message:
					"Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
			});
		}

		// Check for existing user by email
		const emailExists = await User.findOne({ email });
		if (emailExists) {
			return res.status(400).json({ message: "Email already exists" });
		}

		// Validate language (if provided)
		const supportedLanguages = ["en", "es", "fr", "de", "zh", "ja"]; // Example list
		const validatedLanguage =
			language && supportedLanguages.includes(language) ? language : "en";

		// Generate username from sanitized fullname
		let baseUsername = sanitizedFullname.toLowerCase().replace(/\s+/g, ".");
		let username = baseUsername;
		let counter = 1;
		while (await User.findOne({ username })) {
			username = `${baseUsername}${counter}`;
			counter++;
		}

		// Generate OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		// Create new user with all fields
		const newUser = new User({
			username,
			email,
			password, // Will be hashed by pre-save hook
			language: validatedLanguage,
			enableTextToSpeech:
				enableTextToSpeech !== undefined ? enableTextToSpeech : true,
			fullname: sanitizedFullname,
			emailOTP: otp,
			emailOTPExpiry: otpExpiry,
			isEmailVerified: false,
		});

		await newUser.save();

		// Send OTP email using reusable utility
		await sendEmail({
			to: newUser.email,
			subject: "Your Talky OTP Code",
			text: `Your OTP code is: ${otp}`,
			html: getOTPEmailTemplate(otp),
		});

		res.status(201).json({
			message: "Account created. Please verify your email with the OTP sent.",
			userId: newUser._id,
			email: newUser.email,
		});
	} catch (error) {
		console.log("Error in signup controller:", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const checkAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		console.log("Error in checkAuth controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	const { identifier, password } = req.body;
	try {
		const user = await User.findOne({
			$or: [{ email: identifier }, { username: identifier }],
		});
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		if (!user.isEmailVerified) {
			return res
				.status(403)
				.json({ message: "Please verify your email before logging in." });
		}
		const isPasswordCorrect = await user.comparePassword(password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		user.isOnline = true;
		await user.save();
		generateToken(user._id, res);
		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			profileImage: user.profileImage,
			language: user.language,
			enableTextToSpeech: user.enableTextToSpeech,
			fullname: user.fullname,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const logout = async (req, res) => {
	try {
		// Set user offline if token exists
		if (req.user) {
			const user = await User.findById(req.user._id);
			if (user) {
				user.isOnline = false;
				await user.save();
			}
		}
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const resendOTP = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "User not found" });
		if (user.isEmailVerified)
			return res.status(400).json({ message: "Email already verified" });

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
		user.emailOTP = otp;
		user.emailOTPExpiry = otpExpiry;
		await user.save();

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST || "smtp.ethereal.email",
			port: process.env.SMTP_PORT || 587,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
		const html = `
			<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
				<div style="background: #f5f5f5; padding: 24px 0; text-align: center;">
					<span style="display: inline-flex; align-items: center; justify-content: center; background: #e0e7ff; border-radius: 12px; width: 48px; height: 48px; margin-bottom: 8px;">
						<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='none' viewBox='0 0 24 24' stroke='#6366f1' stroke-width='2'><rect x='3' y='5' width='18' height='14' rx='2' stroke='#6366f1' stroke-width='2' fill='#fff'/><path d='M3 7l9 6 9-6' stroke='#6366f1' stroke-width='2' fill='none'/></svg>
					</span>
					<h2 style="margin: 0; color: #2d3748; font-size: 1.5em; font-weight: bold;">Talky</h2>
					<p style="margin: 0; color: #4a5568; font-size: 1.1em;">Chat with flair, anytime, anywhere.</p>
				</div>
				<div style="padding: 24px;">
					<h3 style="color: #2b6cb0;">Your One-Time Password (OTP)</h3>
					<p style="font-size: 1.1em; color: #2d3748;">
						Use the OTP below to verify your email address and activate your Talky account.
					</p>
					<div style="font-size: 2em; font-weight: bold; color: #3182ce; letter-spacing: 4px; margin: 24px 0;">
						${otp}
					</div>
					<p style="color: #718096; font-size: 0.95em;">
						This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
					</p>
					<hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
					<p style="color: #a0aec0; font-size: 0.9em; text-align: center;">
						&copy; 2024 Talky. All rights reserved.
					</p>
				</div>
			</div>
		`;
		await transporter.sendMail({
			from: process.env.SMTP_FROM || "no-reply@talky.app",
			to: user.email,
			subject: "Your Talky OTP Code (Resent)",
			text: `Your new OTP code is: ${otp}`,
			html: html,
		});
		res.status(200).json({ message: "OTP resent successfully" });
	} catch (error) {
		console.log("Error in resendOTP controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { profileImage, language, enableTextToSpeech, username, fullname } =
			req.body;
		const userId = req.user._id;
		const updateData = {};
		if (profileImage) {
			try {
				const uploadResponse = await cloudinary.uploader.upload(profileImage);
				updateData.profileImage = uploadResponse.secure_url;
			} catch (error) {
				return res
					.status(400)
					.json({ message: "Failed to upload profile image" });
			}
		}
		if (language) updateData.language = language;
		if (enableTextToSpeech !== undefined)
			updateData.enableTextToSpeech = enableTextToSpeech;
		if (username) {
			const existingUser = await User.findOne({
				username,
				_id: { $ne: userId },
			});
			if (existingUser) {
				return res.status(400).json({ message: "Username already taken" });
			}
			updateData.username = username;
		}
		if (fullname) updateData.fullname = fullname;
		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({ message: "No valid update data provided" });
		}
		const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
			new: true,
		}).select("-password");
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const verifyOTP = async (req, res) => {
	const { email, otp } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "User not found" });
		if (user.isEmailVerified)
			return res.status(400).json({ message: "Email already verified" });
		if (!user.emailOTP || !user.emailOTPExpiry)
			return res
				.status(400)
				.json({ message: "No OTP set. Please request a new one." });
		if (user.emailOTP !== otp)
			return res.status(400).json({ message: "Invalid OTP" });
		if (user.emailOTPExpiry < new Date())
			return res.status(400).json({ message: "OTP expired" });
		user.isEmailVerified = true;
		user.emailOTP = null;
		user.emailOTPExpiry = null;
		await user.save();
		res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};
