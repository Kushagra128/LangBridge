import express from "express";
import { answerFaqWithGemini } from "../lib/gemini.js";

const router = express.Router();

// POST /api/ai-faq
router.post("/", async (req, res) => {
	try {
		const { question, wordLimit = 40 } = req.body;
		if (!question)
			return res.status(400).json({ error: "Question is required" });
		const answer = await answerFaqWithGemini(question, wordLimit);
		res.json({ answer });
	} catch (err) {
		res.status(500).json({ error: err.message || "Failed to get answer" });
	}
});

export default router;
