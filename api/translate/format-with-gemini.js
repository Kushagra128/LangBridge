import { formatWithGemini } from "../../backend/src/lib/gemini.js";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	try {
		const { text } = req.body;
		if (!text) {
			res.status(400).json({ error: "Text is required" });
			return;
		}
		const formattedHtml = await formatWithGemini(text);
		res.status(200).json({ formattedHtml });
	} catch (err) {
		res.status(500).json({ error: "Gemini formatting failed" });
	}
}
