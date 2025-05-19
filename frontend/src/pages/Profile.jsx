import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Globe, Volume2 } from "lucide-react";

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

const ProfilePage = () => {
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
	const [selectedImg, setSelectedImg] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		username: authUser?.username || "",
		fullname: authUser?.fullname || "",
		language: authUser?.language || "en",
		enableTextToSpeech: authUser?.enableTextToSpeech !== false,
	});

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = async () => {
			const base64Image = reader.result;
			setSelectedImg(base64Image);
			await updateProfile({ profileImage: base64Image });
		};
	};

	const handleSaveChanges = async () => {
		try {
			await updateProfile({
				username: formData.username,
				fullname: formData.fullname,
				language: formData.language,
				enableTextToSpeech: formData.enableTextToSpeech,
			});
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};

	return (
		<div className="min-h-[calc(100vh-16rem)] py-20 mb-16">
			<div className="max-w-2xl mx-auto p-4 py-8">
				<div className="bg-base-300 rounded-xl p-6 space-y-8">
					<div className="text-center">
						<h1 className="text-2xl font-semibold">Profile</h1>
						<p className="mt-2">Your profile information</p>
					</div>

					{/* avatar upload section */}

					<div className="flex flex-col items-center gap-4">
						<div className="relative">
							<img
								src={
									selectedImg ||
									authUser.profileImage ||
									"./src/assets/prof.jpg"
								}
								alt="Profile"
								className="size-32 rounded-full object-cover border-4"
							/>
							<label
								htmlFor="avatar-upload"
								className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
										isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
									}
                `}
							>
								<Camera className="w-5 h-5 text-base-200" />
								<input
									type="file"
									id="avatar-upload"
									className="hidden"
									accept="image/*"
									onChange={handleImageUpload}
									disabled={isUpdatingProfile}
								/>
							</label>
						</div>
						{!isUpdatingProfile ? (
							" "
						) : (
							<p className="text-red-300 text-smaller">
								Image size must be less than 50kb
							</p>
						)}
						<p className="text-sm text-zinc-400">
							{isUpdatingProfile
								? "Uploading..."
								: "Click the camera icon to update your photo"}
						</p>
					</div>

					{!isEditing ? (
						<div className="space-y-6">
							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<User className="w-4 h-4" />
									Full Name
								</div>
								<p className="px-4 py-2.5 bg-base-200 rounded-lg border">
									{authUser?.fullname || "-"}
								</p>
							</div>

							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<User className="w-4 h-4" />
									Username
								</div>
								<p className="px-4 py-2.5 bg-base-200 rounded-lg border">
									{authUser?.username}
								</p>
							</div>

							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<Mail className="w-4 h-4" />
									Email Address
								</div>
								<p className="px-4 py-2.5 bg-base-200 rounded-lg border">
									{authUser?.email}
								</p>
							</div>

							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<Globe className="w-4 h-4" />
									Preferred Language
								</div>
								<p className="px-4 py-2.5 bg-base-200 rounded-lg border">
									{LANGUAGES.find((lang) => lang.code === authUser?.language)
										?.name || "English"}
								</p>
							</div>

							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<Volume2 className="w-4 h-4" />
									Text-to-Speech
								</div>
								<p className="px-4 py-2.5 bg-base-200 rounded-lg border">
									{authUser?.enableTextToSpeech ? "Enabled" : "Disabled"}
								</p>
							</div>

							<button
								className="btn btn-primary w-full mt-4"
								onClick={() => {
									setFormData({
										username: authUser?.username || "",
										fullname: authUser?.fullname || "",
										language: authUser?.language || "en",
										enableTextToSpeech: authUser?.enableTextToSpeech !== false,
									});
									setIsEditing(true);
								}}
							>
								Edit Profile
							</button>
						</div>
					) : (
						<div className="space-y-6">
							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<User className="w-4 h-4" />
									Full Name
								</div>
								<input
									type="text"
									className="input input-bordered w-full"
									value={formData.fullname}
									onChange={(e) =>
										setFormData({ ...formData, fullname: e.target.value })
									}
								/>
							</div>

							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<User className="w-4 h-4" />
									Username
								</div>
								<input
									type="text"
									className="input input-bordered w-full"
									value={formData.username}
									onChange={(e) =>
										setFormData({ ...formData, username: e.target.value })
									}
								/>
							</div>

							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<Mail className="w-4 h-4" />
									Email Address (cannot be changed)
								</div>
								<p className="px-4 py-2.5 bg-base-200 rounded-lg border opacity-70">
									{authUser?.email}
								</p>
							</div>

							<div className="space-y-1.5">
								<div className="text-sm text-zinc-400 flex items-center gap-2">
									<Globe className="w-4 h-4" />
									Preferred Language
								</div>
								<select
									className="select select-bordered w-full"
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

							<div className="flex gap-2 mt-4">
								<button
									className="btn btn-outline flex-1"
									onClick={() => setIsEditing(false)}
								>
									Cancel
								</button>
								<button
									className="btn btn-primary flex-1"
									onClick={handleSaveChanges}
									disabled={isUpdatingProfile}
								>
									{isUpdatingProfile ? "Updating..." : "Save Changes"}
								</button>
							</div>
						</div>
					)}

					<div className="mt-6 bg-base-300 rounded-xl p-6">
						<h2 className="text-lg font-medium mb-4">Account Information</h2>
						<div className="space-y-3 text-sm">
							<div className="flex items-center justify-between py-2 border-b border-zinc-700">
								<span>Member Since</span>
								<span>
									{new Date(authUser?.createdAt).toLocaleDateString()}
								</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span>Account Status</span>
								<span className="text-green-500">Active</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
