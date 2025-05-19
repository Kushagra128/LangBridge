import express from "express";
import {
	getMessages,
	sendMessage,
	getUsersForSidebar,
	deleteMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// GET messages with a specific user
router.get("/:id", protectRoute, getMessages);

// POST send a message to a user
router.post("/:id", protectRoute, sendMessage);

// DELETE delete a message
router.delete("/delete/:messageId", protectRoute, deleteMessage);

export default router;
