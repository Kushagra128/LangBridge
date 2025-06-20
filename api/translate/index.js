import { translateWithGemini } from "../../backend/src/lib/gemini.js";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	try {
		const { text, source, target } = req.body;
		if (!text || !target) {
			res.status(400).json({ error: "Text and target language are required" });
			return;
		}
		const translatedText = await translateWithGemini(
			text,
			target,
			source || "en"
		);
		res.status(200).json({ translatedText });
	} catch (err) {
		res.status(500).json({ error: "Translation failed" });
	}
}
