import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST"],
		credentials: true,
	},
	maxHttpBufferSize: 5 * 1024 * 1024, // 5MB to handle voice messages
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
	return userSocketMap[userId];
}

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	// Get userId from query params and save to map
	const userId = socket.handshake.query.userId;
	if (userId) userSocketMap[userId] = socket.id;

	// Broadcast online users to all clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Handle voice message streaming if needed
	socket.on(
		"streamVoice",
		({ receiverId, audioChunk, messageId, finished }) => {
			try {
				const receiverSocketId = getReceiverSocketId(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("voiceStream", {
						senderId: userId,
						audioChunk,
						messageId,
						finished,
					});
				}
			} catch (error) {
				console.error("Error handling voice stream:", error);
			}
		}
	);

	// Handle typing indicator
	socket.on("typing", ({ receiverId, isTyping }) => {
		try {
			const receiverSocketId = getReceiverSocketId(receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("typing", {
					senderId: userId,
					isTyping,
				});
			}
		} catch (error) {
			console.error("Error handling typing indicator:", error);
		}
	});

	// Handle disconnection
	socket.on("disconnect", () => {
		console.log("A user disconnected", socket.id);

		// Find and remove user from socket map
		for (const [key, value] of Object.entries(userSocketMap)) {
			if (value === socket.id) {
				delete userSocketMap[key];
				break;
			}
		}

		// Broadcast updated online users
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { io, app, server };
