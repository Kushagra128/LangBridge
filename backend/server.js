import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { app, server } from "./src/lib/socket.js";
import ttsRoutes from "./src/routes/tts.route.js";
import firebaseAuthRoutes from "./src/routes/firebase.route.js";
import translateRoutes from "./src/routes/translate.route.js";
import speechRoutes from "./src/routes/speech.route.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Increase payload size limit (e.g., 50MB)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/tts", ttsRoutes);
app.use("/api/auth/firebase", firebaseAuthRoutes);
app.use("/api/translate", translateRoutes);
app.use(speechRoutes);

server.listen(PORT, () => {
	console.log("server is running on PORT:" + PORT);
	connectDB();
});
