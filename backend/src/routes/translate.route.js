import express from "express";
import { translateWithGemini } from "../lib/gemini.js";
import { formatWithGemini } from "../lib/gemini.js";

const router = express.Router();

// POST /api/translate
router.post("/", async (req, res) => {
	try {
		const { text, source, target } = req.body;
		if (!text || !target)
			return res
				.status(400)
				.json({ error: "Text and target language are required" });
		const translatedText = await translateWithGemini(
			text,
			target,
			source || "en"
		);
		res.json({ translatedText });
	} catch (err) {
		console.error("[Translate API] Error:", err);
		res.status(500).json({ error: "Translation failed" });
	}
});

// Add Gemini formatting endpoint
router.post("/format-with-gemini", async (req, res) => {
	try {
		const { text } = req.body;
		if (!text) return res.status(400).json({ error: "Text is required" });
		const formattedHtml = await formatWithGemini(text);
		res.json({ formattedHtml });
	} catch (err) {
		console.error("[Gemini Format API] Error:", err);
		res.status(500).json({ error: "Gemini formatting failed" });
	}
});

export default router;
