import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
	FaLanguage,
	FaMicrophoneAlt,
	FaFileAlt,
	FaComments,
	FaGlobe,
	FaLock,
	FaPaperclip,
	FaMicrophone,
	FaRobot,
} from "react-icons/fa";

const HomePage = () => {
	const { selectedUser, isSidebarOpen, toggleSidebar } = useChatStore();

	const features = [
		{
			title: "Real-time Chat",
			description:
				"Instant messaging with friends and colleagues, anywhere in the world.",
			color: "from-primary to-accent",
			icon: <FaComments size={36} className="mb-3 drop-shadow-lg" />,
		},
		{
			title: "Multilingual Support",
			description: "Communicate in 20+ languages with seamless translation.",
			color: "from-secondary to-primary",
			icon: <FaGlobe size={36} className="mb-3 drop-shadow-lg" />,
		},
		{
			title: "Secure Messaging",
			description: "Your conversations are encrypted and private.",
			color: "from-success to-primary",
			icon: <FaLock size={36} className="mb-3 drop-shadow-lg" />,
		},
		{
			title: "File Sharing",
			description: "Send images, documents, and more with a single click.",
			color: "from-warning to-accent",
			icon: <FaPaperclip size={36} className="mb-3 drop-shadow-lg" />,
		},
		{
			title: "Voice Messages",
			description: "Record and send voice messages for a personal touch.",
			color: "from-info to-primary",
			icon: <FaMicrophone size={36} className="mb-3 drop-shadow-lg" />,
		},
		{
			title: "AI Translation",
			description:
				"Leverage AI to translate and format your messages instantly.",
			color: "from-pink-500 to-fuchsia-500",
			icon: <FaRobot size={36} className="mb-3 drop-shadow-lg" />,
		},
	];

	return (
		<div className="min-h-[calc(100vh-4rem)] pt-16 pb-0 bg-base-200 flex flex-col overflow-hidden">
			{/* Services Section */}
			<div className="w-full flex justify-center mb-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
					<Link
						to="/services"
						className="group bg-base-100 rounded-xl shadow-lg p-6 flex flex-col items-center hover:bg-primary hover:text-white transition-colors"
					>
						<FaLanguage
							size={36}
							className="mb-3 group-hover:scale-110 transition-transform"
						/>
						<span className="font-bold text-lg mb-1">Open Translator</span>
						<span className="text-base-content/70 group-hover:text-white text-center">
							Translate text between 20+ languages with ease.
						</span>
					</Link>
					<Link
						to="/speech-to-speech"
						className="group bg-base-100 rounded-xl shadow-lg p-6 flex flex-col items-center hover:bg-primary hover:text-white transition-colors"
					>
						<FaMicrophoneAlt
							size={36}
							className="mb-3 group-hover:scale-110 transition-transform"
						/>
						<span className="font-bold text-lg mb-1">Speech-to-Speech</span>
						<span className="text-base-content/70 group-hover:text-white text-center">
							Speak and get instant translation in another language.
						</span>
					</Link>
					<Link
						to="/text-scanner"
						className="group bg-base-100 rounded-xl shadow-lg p-6 flex flex-col items-center hover:bg-primary hover:text-white transition-colors"
					>
						<FaFileAlt
							size={36}
							className="mb-3 group-hover:scale-110 transition-transform"
						/>
						<span className="font-bold text-lg mb-1">Text Scanner</span>
						<span className="text-base-content/70 group-hover:text-white text-center">
							Extract and translate text from images or PDFs.
						</span>
					</Link>
				</div>
			</div>
			{/* Features Section */}
			<div className="w-full flex justify-center mb-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
					{features.map((feature, idx) => (
						<div
							key={feature.title}
							className={`rounded-2xl shadow-xl p-6 flex flex-col items-start justify-between bg-gradient-to-br ${feature.color} text-white min-h-[160px] relative overflow-hidden`}
						>
							<div>{feature.icon}</div>
							<h3 className="text-2xl font-extrabold mb-2 drop-shadow-lg">
								{feature.title}
							</h3>
							<p className="text-base font-medium opacity-90 mb-1 drop-shadow">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
			<div className="flex-1 flex items-start justify-center p-4">
				<div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-6rem)] relative overflow-hidden">
					{/* Toggle Button for Small Screens */}
					<button
						className="sm:hidden absolute top-3 right-10 z-20 p-2 bg-base-200 rounded-lg"
						onClick={toggleSidebar}
						aria-label={
							isSidebarOpen ? "Close online users" : "Show online users"
						}
					>
						<Menu size={24} className="text-base-content" />
					</button>

					<div className="flex h-full rounded-lg overflow-hidden">
						{/* Sidebar: Hidden on small screens by default, shown when toggled */}
						<div
							className={`
                ${isSidebarOpen ? "block" : "hidden"} 
                sm:block 
                absolute sm:static 
                inset-0 
                sm:inset-auto 
                z-10 
                bg-base-100 
                w-64 
                h-full 
                sm:w-20 
                lg:w-72 
                border-r 
                border-base-300
              `}
						>
							{/* Backdrop for small screens */}
							<div
								className="fixed inset-0 bg-black/20 sm:hidden"
								onClick={toggleSidebar}
							/>
							<div className="relative z-20 h-full">
								<Sidebar />
							</div>
						</div>

						{/* Main Content Area */}
						<div className="flex-1 h-full overflow-hidden">
							{!selectedUser ? <NoChatSelected /> : <ChatContainer />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
