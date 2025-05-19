import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { translateWithGemini } from "../lib/gemini.js";

export async function getUsersForSidebar(req, res) {
	try {
		const currentUserId = req.user._id;

		const users = await User.find({ _id: { $ne: currentUserId } }).select(
			"-password"
		);

		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getUsersForSidebar controller:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
}

export async function getMessages(req, res) {
	try {
		const { id: userToChatWith } = req.params;
		const senderId = req.user._id;

		const messages = await Message.find({
			$or: [
				{ senderId, receiverId: userToChatWith },
				{ senderId: userToChatWith, receiverId: senderId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		console.error("Error in getMessages controller:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
}

export async function sendMessage(req, res) {
	try {
		const { text, image, voiceMessage, isVoice, language } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		// Validate that at least one content type is provided
		if (!text && !image && !voiceMessage) {
			return res.status(400).json({ message: "Message content is required" });
		}

		// Handle image upload if using cloudinary
		let imageUrl = image;
		if (image && process.env.CLOUDINARY_CLOUD_NAME) {
			try {
				// Upload base64 image to cloudinary if configured
				const cloudinary = await import("../lib/cloudinary.js");
				const uploadResponse = await cloudinary.default.uploader.upload(image);
				imageUrl = uploadResponse.secure_url;
			} catch (error) {
				console.error("Error uploading image:", error);
				// Continue with the original image data if cloudinary fails
			}
		}

		// Get the user's language if not provided in the message
		let messageLanguage = language;
		if (!messageLanguage) {
			const sender = await User.findById(senderId);
			messageLanguage = sender.language || "en";
		}

		// Find receiver's language
		const receiver = await User.findById(receiverId);
		const receiverLang = receiver?.language || "en";

		let translatedText = text;
		if (text && receiverLang && receiverLang !== messageLanguage) {
			// Use Gemini AI for translation
			translatedText = await translateWithGemini(
				text,
				receiverLang,
				messageLanguage
			);
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			text, // Store original text
			image: imageUrl,
			voiceMessage,
			isVoice: isVoice || false,
			language: messageLanguage,
		});

		await newMessage.save();

		// ONLINE MESSAGING
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// Send translated text to receiver, original to sender
			io.to(receiverSocketId).emit("newMessage", {
				...newMessage.toObject(),
				text: translatedText,
			});
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.error("Error in sendMessage controller:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
}

export async function deleteMessage(req, res) {
	try {
		const { messageId } = req.params;
		const userId = req.user._id;
		const message = await Message.findById(messageId);
		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}
		if (message.senderId.toString() !== userId.toString()) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this message" });
		}
		await message.deleteOne();
		res.status(200).json({ message: "Message deleted successfully" });
	} catch (error) {
		console.error("Error in deleteMessage controller:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
}
