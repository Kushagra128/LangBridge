import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { Menu } from "lucide-react";

const ChattingPage = () => {
	const { selectedUser, isSidebarOpen, toggleSidebar } = useChatStore();

	return (
		<div className="min-h-screen pt-16 bg-base-200 flex flex-col overflow-hidden">
			<div className="flex-1 flex items-start justify-center p-4">
				<div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] relative overflow-hidden">
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

export default ChattingPage;
