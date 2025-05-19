import express from "express";
import { textToSpeech, speechToText } from "../lib/translate.js";
import { translateWithGemini } from "../lib/gemini.js";

const router = express.Router();

// POST /api/tts/text-to-speech
router.post("/text-to-speech", async (req, res) => {
	try {
		const { text, language, transliterate } = req.body;
		if (!text) return res.status(400).json({ error: "Text is required" });
		const audioData = await textToSpeech(text, language || "en", transliterate);
		res.json({ audioData });
	} catch (err) {
		console.error("[TTS API] Error:", err);
		res.status(500).json({ error: "Text-to-speech failed" });
	}
});

// POST /api/tts/speech-to-text
router.post("/speech-to-text", async (req, res) => {
	try {
		const { audio, language } = req.body;
		if (!audio) return res.status(400).json({ error: "Audio is required" });
		const text = await speechToText(audio, language || "en-US");
		res.json({ text });
	} catch (err) {
		console.error("[Speech-to-Text API] Error:", err);
		res.status(500).json({ error: "Speech-to-text failed" });
	}
});

// POST /api/tts/translate (AI translation for voice translator)
router.post("/translate", async (req, res) => {
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
		console.error("[TTS Translate API] Error:", err);
		res.status(500).json({ error: "Translation failed" });
	}
});

export default router;
