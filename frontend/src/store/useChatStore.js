import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,
	isSidebarOpen: false, // State for sidebar visibility
	toggleSidebar: () =>
		set((state) => ({ isSidebarOpen: !state.isSidebarOpen })), // Toggle function

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/messages/users");
			set({ users: res.data });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load users");
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: res.data });
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load messages");
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get();

		if (!selectedUser) {
			toast.error("No user selected to send message to");
			return;
		}

		try {
			// Create FormData for message (handles text, image, and voice)
			const formData = new FormData();

			// Add text if present
			if (messageData.text) {
				formData.append("text", messageData.text);
			}

			// Add image if present
			if (messageData.image) {
				// If it's already a dataURL, convert to blob
				if (
					typeof messageData.image === "string" &&
					messageData.image.startsWith("data:")
				) {
					const blob = await fetch(messageData.image).then((r) => r.blob());
					formData.append("image", blob);
				} else {
					formData.append("image", messageData.image);
				}
			}

			// Add voice message if present
			if (messageData.voiceMessage) {
				formData.append("voiceMessage", messageData.voiceMessage);
				formData.append("isVoice", !!messageData.isVoice);
			}

			const res = await axiosInstance.post(
				`/messages/${selectedUser._id}`,
				messageData, // Use regular JSON for now
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			set({ messages: [...messages, res.data] });
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error(error.response?.data?.message || "Failed to send message");
		}
	},

	subscribeToMessages: () => {
		const { selectedUser } = get();
		if (!selectedUser) return;

		const socket = useAuthStore.getState().socket;
		if (!socket) return;

		socket.on("newMessage", (newMessage) => {
			const isMessageSentFromSelectedUser =
				newMessage.senderId === selectedUser._id;
			if (!isMessageSentFromSelectedUser) return;

			set({
				messages: [...get().messages, newMessage],
			});
		});
	},

	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket;
		if (socket) {
			socket.off("newMessage");
		}
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),

	deleteMessage: async (messageId) => {
		const { messages, getMessages, selectedUser } = get();
		try {
			await axiosInstance.delete(`/messages/delete/${messageId}`);
			set({ messages: messages.filter((msg) => msg._id !== messageId) });
			toast.success("Message deleted");
			// Optionally refresh messages from server:
			// if (selectedUser) getMessages(selectedUser._id);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete message");
		}
	},
}));
