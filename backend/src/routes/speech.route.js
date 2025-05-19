import express from "express";
import multer from "multer";
import { spawn } from "child_process";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/api/speech-to-text", upload.single("audio"), async (req, res) => {
	try {
		const file = req.file;
		const language = req.body.languageCode || "en-US";

		// Call the Python script
		const python = spawn("python", ["speech_service.py"]);
		const input = JSON.stringify({ audio_path: file.path, language });

		let output = "";
		python.stdin.write(input);
		python.stdin.end();

		python.stdout.on("data", (data) => {
			output += data.toString();
		});

		python.stderr.on("data", (data) => {
			console.error("Python error:", data.toString());
		});

		python.on("close", (code) => {
			fs.unlinkSync(file.path); // Clean up temp file
			try {
				const result = JSON.parse(output);
				res.json({ transcription: result.text });
			} catch (err) {
				res.status(500).json({ error: "Failed to parse Python output" });
			}
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
