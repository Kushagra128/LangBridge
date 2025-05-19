import axios from "axios";

const LANGUAGE_CODE_TO_NAME = {
	en: "English",
	hi: "Hindi",
	es: "Spanish",
	fr: "French",
	de: "German",
	it: "Italian",
	pt: "Portuguese",
	ru: "Russian",
	zh: "Chinese",
	ja: "Japanese",
	ar: "Arabic",
	gu: "Gujarati",
	bn: "Bengali",
	ta: "Tamil",
	te: "Telugu",
	ml: "Malayalam",
	or: "Odia",
	// Add more as needed
};

export async function formatWithGemini(text) {
	if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
	const prompt = `Format the following extracted document text as a well-structured HTML document. Output ONLY the HTML, with no code block, no markdown, and no explanation. Text: ${text}`;
	const response = await axios.post(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
		{
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
		}
	);
	let html =
		response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
		response.data?.candidates?.[0]?.content?.parts?.[0]?.html ||
		"";
	// Remove code block markers if present
	html = html
		.replace(/^```(?:html)?/i, "")
		.replace(/```$/, "")
		.trim();
	return html;
}

export async function translateWithGemini(
	text,
	targetLang,
	sourceLang = "auto"
) {
	if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
	const targetLangName = LANGUAGE_CODE_TO_NAME[targetLang] || targetLang;
	const prompt = `Translate the following text to ${targetLangName}. 
    Preserve all original formatting, line breaks, and structure. 
    Output ONLY the translation, with no explanation, no code block, and no markdown. 
    Text: ${text}`;
	const response = await axios.post(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
		{
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
		}
	);
	let translation =
		response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
		response.data?.candidates?.[0]?.content?.parts?.[0]?.translation ||
		"";
	// Remove code block markers if present
	translation = translation
		.replace(/^```(?:\w+)?/i, "")
		.replace(/```$/, "")
		.trim();
	return translation;
}

export async function answerFaqWithGemini(question, wordLimit = 40) {
	if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
	const prompt = `Answer the following question in a clear, concise way, using no more than ${wordLimit} words. Do not include any code block, markdown, or explanation.\nQuestion: ${question}`;
	const response = await axios.post(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
		{
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
		}
	);
	let answer =
		response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
		response.data?.candidates?.[0]?.content?.parts?.[0]?.answer ||
		"";
	// Remove code block markers if present
	answer = answer
		.replace(/^```(?:\w+)?/i, "")
		.replace(/```$/, "")
		.trim();
	return answer;
}
