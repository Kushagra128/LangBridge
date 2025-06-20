import { answerFaqWithGemini } from "../backend/src/lib/gemini.js";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	try {
		const { question, wordLimit = 40 } = req.body;
		if (!question) {
			res.status(400).json({ error: "Question is required" });
			return;
		}
		const answer = await answerFaqWithGemini(question, wordLimit);
		res.status(200).json({ answer });
	} catch (err) {
		res.status(500).json({ error: err.message || "Failed to get answer" });
	}
}
