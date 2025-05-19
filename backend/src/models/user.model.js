import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
			maxlength: 30,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		profileImage: {
			type: String,
			default: "",
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		language: {
			type: String,
			default: "en", // Default language is English
			enum: ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ar", "hi"],
		},
		enableTextToSpeech: {
			type: Boolean,
			default: true,
		},
		fullname: {
			type: String,
			trim: true,
			default: "",
		},
		emailOTP: {
			type: String,
			default: null,
		},
		emailOTPExpiry: {
			type: Date,
			default: null,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		throw new Error(error);
	}
};

const User = mongoose.model("User", userSchema);

export default User;
