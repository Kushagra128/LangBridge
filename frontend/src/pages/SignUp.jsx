import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	MessageSquare,
	User,
	Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

// Language options
const LANGUAGES = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Spanish (Español)" },
	{ code: "fr", name: "French (Français)" },
	{ code: "de", name: "German (Deutsch)" },
	{ code: "it", name: "Italian (Italiano)" },
	{ code: "pt", name: "Portuguese (Português)" },
	{ code: "ru", name: "Russian (Русский)" },
	{ code: "zh", name: "Chinese (中文)" },
	{ code: "ja", name: "Japanese (日本語)" },
	{ code: "ar", name: "Arabic (العربية)" },
	{ code: "hi", name: "Hindi (हिन्दी)" },
];

const SignUpPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		fullname: "",
		email: "",
		password: "",
		language: "en",
		enableTextToSpeech: true,
	});
	const [otp, setOtp] = useState("");
	const [showOtpForm, setShowOtpForm] = useState(false);
	const [signupEmail, setSignupEmail] = useState("");
	const navigate = useNavigate();
	const { signup, isSigningUp } = useAuthStore();

	const validateForm = () => {
		if (!formData.fullname.trim()) return toast.error("Full name is required");
		if (!formData.email.trim()) return toast.error("Email is required");
		if (!/\S+@\S+\.\S+/.test(formData.email))
			return toast.error("Invalid email format");
		if (!formData.password) return toast.error("Password is required");
		if (formData.password.length < 6)
			return toast.error("Password must be at least 6 characters");
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = validateForm();
		if (success === true) {
			try {
				await axios.post("/api/auth/signup", formData);
				setSignupEmail(formData.email);
				setShowOtpForm(true);
				toast.success("OTP sent to your email.");
			} catch (error) {
				toast.error(error.response?.data?.message || "Signup failed");
			}
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/auth/verify-otp", { email: signupEmail, otp });
			toast.success("Email verified successfully! You can now log in.");
			setTimeout(() => navigate("/login"), 1500);
		} catch (error) {
			toast.error(error.response?.data?.message || "OTP verification failed");
		}
	};

	const handleResendOtp = async () => {
		try {
			await axios.post("/api/auth/resend-otp", { email: signupEmail });
			toast.success("A new OTP has been sent to your email.");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to resend OTP");
		}
	};

	if (showOtpForm) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center">
				<div className="w-full max-w-md space-y-8 bg-base-200 p-8 rounded-xl">
					<h2 className="text-2xl font-bold mb-4 text-center">
						Verify Your Email
					</h2>
					<p className="mb-4 text-center">
						Enter the OTP sent to <b>{signupEmail}</b>
					</p>
					<form onSubmit={handleVerifyOtp} className="space-y-6">
						<input
							type="text"
							className="input input-bordered w-full"
							placeholder="Enter OTP"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
						/>
						<button type="submit" className="btn btn-primary w-full">
							Verify OTP
						</button>
					</form>
					<button
						onClick={handleResendOtp}
						className="btn btn-link w-full mt-2"
					>
						Resend OTP
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			{/* left side */}
			<div className="flex flex-col justify-center items-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-8">
					{/* LOGO */}
					<div className="text-center mb-8">
						<div className="flex flex-col items-center gap-2 group">
							<div
								className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
							>
								<MessageSquare className="size-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold mt-2">Create Account</h1>
							<p className="text-base-content/60">
								Get started with your free account
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Full Name</span>
							</label>
							<div className="relative">
								<input
									type="text"
									className={`input input-bordered w-full`}
									placeholder="John Doe"
									value={formData.fullname}
									onChange={(e) =>
										setFormData({ ...formData, fullname: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Email</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="size-5 text-base-content/40" />
								</div>
								<input
									type="email"
									className={`input input-bordered w-full pl-10`}
									placeholder="you@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Password</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="size-5 text-base-content/40" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									className={`input input-bordered w-full pl-10`}
									placeholder="••••••••"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)}
								</button>
							</div>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">
									Preferred Language
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Globe className="size-5 text-base-content/40" />
								</div>
								<select
									className="select select-bordered w-full pl-10"
									value={formData.language}
									onChange={(e) =>
										setFormData({ ...formData, language: e.target.value })
									}
								>
									{LANGUAGES.map((lang) => (
										<option key={lang.code} value={lang.code}>
											{lang.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="form-control">
							<label className="label cursor-pointer justify-start gap-2">
								<input
									type="checkbox"
									className="checkbox checkbox-primary"
									checked={formData.enableTextToSpeech}
									onChange={(e) =>
										setFormData({
											...formData,
											enableTextToSpeech: e.target.checked,
										})
									}
								/>
								<span className="label-text">
									Enable text-to-speech for messages
								</span>
							</label>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isSigningUp}
						>
							{isSigningUp ? (
								<>
									<Loader2 className="size-5 animate-spin" />
									Loading...
								</>
							) : (
								"Create Account"
							)}
						</button>
					</form>

					<div className="text-center">
						<p className="text-base-content/60">
							Already have an account?{" "}
							<Link to="/login" className="link link-primary">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* right side */}

			<AuthImagePattern
				title="Join our multilingual community"
				subtitle="Connect with friends in your language, share voice messages, and enjoy text-to-speech capabilities."
			/>
		</div>
	);
};
export default SignUpPage;
