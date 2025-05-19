// Simple translation utility using LibreTranslate (free demo API)
import { spawn } from "child_process";

/**
 * Translate text to a target language using the Python translate.py script
 * @param {string} text - The text to translate
 * @param {string} fromLang - The source language code (e.g. 'en')
 * @param {string} toLang - The target language code (e.g. 'hi')
 * @returns {Promise<string>} - The translated text
 */
export async function translateText(text, toLang, fromLang = "en") {
	if (!text || !toLang) return text;
	return new Promise((resolve, reject) => {
		const py = spawn("py", ["-3.12", "./src/lib/translate.py"]);
		const input = JSON.stringify({
			action: "translate",
			text,
			fromLang,
			toLang,
		});
		let output = "";
		let error = "";
		py.stdin.write(input);
		py.stdin.end();
		py.stdout.on("data", (data) => {
			output += data.toString();
		});
		py.stderr.on("data", (data) => {
			error += data.toString();
		});
		py.on("close", (code) => {
			if (code !== 0 || error) {
				console.error("[translateText] Python error:", error);
				return resolve(text); // fallback to original text
			}
			try {
				const parsed = JSON.parse(output);
				resolve(parsed.translatedText || text);
			} catch (e) {
				console.error("[translateText] JSON parse error:", e, output);
				resolve(text);
			}
		});
	});
}

/**
 * Convert text to speech (TTS) using the Python script (returns base64-encoded MP3)
 * @param {string} text
 * @param {string} language (e.g. 'en', 'hi', etc.)
 * @param {boolean} transliterate - Whether to transliterate the text
 * @returns {Promise<string>} base64-encoded MP3 audio
 */
export async function textToSpeech(
	text,
	language = "en",
	transliterate = false
) {
	if (!text) return "";
	return new Promise((resolve, reject) => {
		const py = spawn("py", ["-3.12", "./src/lib/translate.py"]);
		const input = JSON.stringify({
			action: "text_to_speech",
			text,
			language,
			transliterate,
		});
		let output = "";
		let error = "";
		py.stdin.write(input);
		py.stdin.end();
		py.stdout.on("data", (data) => {
			output += data.toString();
		});
		py.stderr.on("data", (data) => {
			error += data.toString();
		});
		py.on("close", (code) => {
			if (code !== 0 || error) {
				console.error("[textToSpeech] Python error:", error);
				return resolve("");
			}
			try {
				const parsed = JSON.parse(output);
				resolve(parsed.audioData || "");
			} catch (e) {
				console.error("[textToSpeech] JSON parse error:", e, output);
				resolve("");
			}
		});
	});
}

/**
 * Convert speech (base64-encoded WAV) to text using the Python script
 * @param {string} audioData - base64-encoded WAV
 * @param {string} language - language code (e.g. 'en-US', 'hi-IN')
 * @returns {Promise<string>} recognized text
 */
export async function speechToText(audioData, language = "en-US") {
	if (!audioData) return "";
	return new Promise((resolve, reject) => {
		const py = spawn("py", ["-3.12", "./src/lib/translate.py"]);
		const input = JSON.stringify({
			action: "speech_to_text",
			audioData,
			language,
		});
		let output = "";
		let error = "";
		py.stdin.write(input);
		py.stdin.end();
		py.stdout.on("data", (data) => {
			output += data.toString();
		});
		py.stderr.on("data", (data) => {
			error += data.toString();
		});
		py.on("close", (code) => {
			if (code !== 0 || error) {
				console.error("[speechToText] Python error:", error);
				return resolve("");
			}
			try {
				const parsed = JSON.parse(output);
				resolve(parsed.text || "");
			} catch (e) {
				console.error("[speechToText] JSON parse error:", e, output);
				resolve("");
			}
		});
	});
}
