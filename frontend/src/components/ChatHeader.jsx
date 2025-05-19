import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const LANGUAGES = [
	{ code: "en", name: "English" },
	{ code: "hi", name: "Hindi" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "it", name: "Italian" },
	{ code: "pt", name: "Portuguese" },
	{ code: "ru", name: "Russian" },
	{ code: "zh", name: "Chinese" },
	{ code: "ja", name: "Japanese" },
	{ code: "ar", name: "Arabic" },
	{ code: "gu", name: "Gujarati" },
	{ code: "bn", name: "Bengali" },
	{ code: "ta", name: "Tamil" },
	{ code: "te", name: "Telugu" },
	{ code: "ml", name: "Malayalam" },
	{ code: "or", name: "Odia" },
];

const ChatHeader = () => {
	const { selectedUser, setSelectedUser } = useChatStore();
	const { onlineUsers, authUser, setAuthUser } = useAuthStore();
	const [selectedLang, setSelectedLang] = useState(authUser?.language || "en");

	const handleLanguageChange = (e) => {
		const newLang = e.target.value;
		setSelectedLang(newLang);
		// Optionally update user preference in backend or store
		if (setAuthUser) {
			setAuthUser({ ...authUser, language: newLang });
		}
		// Optionally: call API to persist language preference
	};

	return (
		<div className="p-2.5 border-b border-base-300">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{/* Avatar */}
					<div className="avatar">
						<div className="size-10 rounded-full relative">
							<img
								src={selectedUser.profilePic || "./src/assets/prof.jpg"}
								alt={selectedUser.fullName || selectedUser.username}
							/>
						</div>
					</div>

					{/* User info */}
					<div>
						<h3 className="font-medium">
							{selectedUser.fullName || selectedUser.username}
						</h3>
						<p className="text-sm text-base-content/70">
							{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
						</p>
					</div>
				</div>

				{/* Close button */}
				<button onClick={() => setSelectedUser(null)}>
					<X />
				</button>
			</div>
		</div>
	);
};
export default ChatHeader;
