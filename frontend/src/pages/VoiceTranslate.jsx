import { useState, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import debounce from "lodash/debounce";
import {
	FiCopy,
	FiEdit2,
	FiCheck,
	FiRefreshCw,
	FiVolume2,
	FiClock,
	FiX,
	FiTrash2, // Added for the clear history button
} from "react-icons/fi";

const LANGUAGES = [
	{ code: "en", name: "English", flag: "🇬🇧" },
	{ code: "es", name: "Spanish", flag: "🇪🇸" },
	{ code: "fr", name: "French", flag: "🇫🇷" },
	{ code: "de", name: "German", flag: "🇩🇪" },
	{ code: "it", name: "Italian", flag: "🇮🇹" },
	{ code: "pt", name: "Portuguese", flag: "🇵🇹" },
	{ code: "ru", name: "Russian", flag: "🇷🇺" },
	{ code: "zh", name: "Chinese", flag: "🇨🇳" },
	{ code: "ja", name: "Japanese", flag: "🇯🇵" },
	{ code: "ar", name: "Arabic", flag: "🇸🇦" },
	{ code: "hi", name: "Hindi", flag: "🇮🇳" },
	{ code: "gu", name: "Gujarati", flag: "🇮🇳" },
	{ code: "bn", name: "Bengali", flag: "🇧🇩" },
	{ code: "ta", name: "Tamil", flag: "🇮🇳" },
	{ code: "te", name: "Telugu", flag: "🇮🇳" },
	{ code: "ml", name: "Malayalam", flag: "🇮🇳" },
	{ code: "mr", name: "Marathi", flag: "🇮🇳" },
	{ code: "kn", name: "Kannada", flag: "🇮🇳" },
	{ code: "pa", name: "Punjabi", flag: "🇮🇳" },
	{ code: "or", name: "Odia", flag: "🇮🇳" },
];

// Utility to strip HTML tags
function stripHtml(html) {
	const tmp = document.createElement("div");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

export default function Translator() {
	const [inputText, setInputText] = useState("");
	const [translatedText, setTranslatedText] = useState("");
	const [targetLang, setTargetLang] = useState("es");
	const [isTranslating, setIsTranslating] = useState(false);
	const [useRichText, setUseRichText] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [history, setHistory] = useState([]); // Store recent translations
	const [showHistory, setShowHistory] = useState(false);

	const inputQuillRef = useRef(null);
	const outputQuillRef = useRef(null);

	// Auto-grow for textarea
	const handleTextareaInput = (e) => {
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
		handleInputChange(e.target.value);
	};

	// Debounced translation function
	const translateText = useCallback(
		debounce(async (text, target) => {
			if (!text.trim() || !text.replace(/<(.|\n)*?>/g, "").trim()) {
				setTranslatedText("");
				return;
			}
			setIsTranslating(true);
			try {
				const res = await axios.post("/api/translate", {
					text,
					source: "auto",
					target,
				});
				const translated = res.data.translatedText;
				setTranslatedText(translated);
				// Add to history
				setHistory((prev) =>
					[
						{
							input: text,
							translated: translated,
							lang: LANGUAGES.find((l) => l.code === target).name,
							timestamp: new Date(),
						},
						...prev,
					].slice(0, 5)
				); // Keep last 5 entries
				toast.success("Translation complete");
			} catch (err) {
				console.error("Translation error:", err);
				toast.error(
					`Translation failed: ${err.response?.data?.message || err.message}`
				);
			} finally {
				setIsTranslating(false);
			}
		}, 500),
		[]
	);

	const handleInputChange = (value) => {
		setInputText(value);
		if (!value || !value.replace(/<(.|\n)*?>/g, "").trim()) {
			setTranslatedText("");
			return;
		}
		if (useRichText) {
			translateText(value, targetLang);
		}
	};

	const handleTranslateClick = () => {
		if (!inputText.trim()) {
			toast.error("Enter some text first");
			return;
		}
		translateText(inputText, targetLang);
	};

	const handleTargetLangChange = (e) => {
		setTargetLang(e.target.value);
		if (inputText.trim()) {
			translateText(inputText, e.target.value);
		}
	};

	const handleCopy = () => {
		const textToCopy = stripHtml(translatedText);
		navigator.clipboard.writeText(textToCopy);
		toast.success("Copied to clipboard");
	};

	const handleSpeak = () => {
		const text = stripHtml(translatedText);
		if (!text) return;
		const utterance = new window.SpeechSynthesisUtterance(text);
		utterance.lang = targetLang;
		window.speechSynthesis.speak(utterance);
	};

	const handleEditToggle = () => {
		setIsEditing((prev) => !prev);
		toast(isEditing ? "Editing disabled" : "Editing enabled");
	};

	const handleRefresh = () => {
		setInputText("");
		setTranslatedText("");
		setIsEditing(false);
		toast.success("Cleared");
	};

	const handleHistoryClick = (entry) => {
		setInputText(entry.input);
		setTranslatedText(entry.translated);
		setTargetLang(LANGUAGES.find((lang) => lang.name === entry.lang).code);
		setShowHistory(false);
		toast.success("Loaded from history");
	};

	const handleClearHistory = () => {
		setHistory([]);
		toast.success("History cleared");
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-200">
			{/* Header */}
			<header className="w-full max-w-6xl mx-auto pt-8 pb-4 px-4 text-center">
				<h1 className="text-3xl font-extrabold mb-2 animate-fade-in text-primary">
					Text Translator
				</h1>
				<p className="text-lg text-base-content/70">
					Instantly translate your text into 20+ languages with ease
				</p>
			</header>

			{/* Main Content */}
			<main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
				<div className="bg-base-100 rounded-2xl shadow-2xl p-8 space-y-8 border border-base-300">
					{/* Controls */}
					<div className="flex flex-wrap justify-end gap-2 items-center">
						<label className="label cursor-pointer flex gap-2">
							<span className="font-semibold text-base-content">
								Rich Text Mode
							</span>
							<input
								type="checkbox"
								className="toggle toggle-warning"
								checked={useRichText}
								onChange={() => setUseRichText(!useRichText)}
								aria-label="Toggle rich text mode"
							/>
						</label>
						<button
							className="btn btn-ghost btn-circle btn-sm hover:bg-base-200 transition-all duration-300"
							onClick={handleRefresh}
							aria-label="Refresh/Clear"
							title="Clear all"
						>
							<FiRefreshCw size={18} />
						</button>
						<button
							className="btn btn-ghost btn-circle btn-sm hover:bg-base-200 transition-all duration-300"
							onClick={() => setShowHistory(!showHistory)}
							aria-label="Toggle history"
							title="View history"
						>
							<FiClock size={18} />
						</button>
					</div>

					{/* History Panel */}
					{showHistory && (
						<div className="bg-base-200/60 rounded-lg p-4 max-h-64 overflow-y-auto border border-base-300 shadow-lg">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold text-base-content">
									Recent Translations
								</h3>
								<div className="flex gap-2">
									<button
										className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
										onClick={handleClearHistory}
										aria-label="Clear history"
										title="Clear history"
									>
										<FiTrash2 size={18} />
									</button>
									<button
										className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
										onClick={() => setShowHistory(false)}
										aria-label="Close history"
									>
										<FiX size={18} />
									</button>
								</div>
							</div>
							{history.length > 0 ? (
								<ul className="space-y-3">
									{history.map((entry, index) => (
										<li
											key={index}
											className="p-3 bg-base-300/60 rounded-lg hover:bg-base-300 cursor-pointer transition-all duration-200"
											onClick={() => handleHistoryClick(entry)}
										>
											<div className="flex justify-between items-center">
												<div>
													<p className="text-sm text-base-content">
														{stripHtml(entry.input).substring(0, 50)}
														{stripHtml(entry.input).length > 50 ? "..." : ""}
													</p>
													<p className="text-xs text-base-content/70">
														To {entry.lang} •{" "}
														{new Date(entry.timestamp).toLocaleTimeString()}
													</p>
												</div>
												<button
													className="btn btn-ghost btn-circle btn-xs hover:bg-base-200"
													aria-label="Load this translation"
												>
													<FiCheck size={14} />
												</button>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p className="text-base-content/70 text-center">
									No recent translations
								</p>
							)}
						</div>
					)}

					{/* Input/Output Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:h-[420px]">
						{/* Input Section */}
						<div className="flex flex-col h-full bg-base-200/60 rounded-xl shadow-lg p-0 border border-base-300 overflow-hidden transition-all duration-300 hover:shadow-xl">
							<div className="px-6 pt-6 pb-2">
								<h2 className="font-bold text-lg text-primary mb-1">
									Your Text
								</h2>
							</div>
							<div className="flex-1 flex flex-col px-6 pb-6">
								{useRichText ? (
									<ReactQuill
										ref={inputQuillRef}
										value={inputText}
										onChange={handleInputChange}
										placeholder="Type or paste here..."
										className="border-none !bg-transparent !rounded-none quill-no-border quill-scroll min-h-[120px]"
										aria-label="Input text for translation"
									/>
								) : (
									<textarea
										className="textarea textarea-bordered w-full text-base min-h-[120px] max-h-[350px] overflow-y-auto focus:border-primary transition-all duration-300"
										rows={1}
										placeholder="Type here..."
										value={inputText}
										onInput={handleTextareaInput}
										aria-label="Input text for translation"
									/>
								)}
							</div>
						</div>

						{/* Output Section */}
						<div className="flex flex-col h-full bg-base-200/60 rounded-xl shadow-lg p-0 border border-base-300 overflow-hidden transition-all duration-300 hover:shadow-xl relative">
							<div className="flex items-center justify-between px-6 pt-6 pb-2">
								<div className="flex items-center gap-2">
									<h2 className="font-bold text-lg text-primary">Translated</h2>
									<select
										className="select select-bordered select-sm focus:border-primary transition-all duration-300"
										value={targetLang}
										onChange={handleTargetLangChange}
										aria-label="Select target language"
									>
										{LANGUAGES.map((lang) => (
											<option key={lang.code} value={lang.code}>
												{lang.flag} {lang.name}
											</option>
										))}
									</select>
									{!useRichText && (
										<button
											className="btn btn-accent btn-sm ml-2 hover:bg-accent/80 transition-all duration-300"
											onClick={handleTranslateClick}
											disabled={isTranslating || !inputText.trim()}
											aria-label="Translate text"
										>
											{isTranslating ? "Translating..." : "Translate"}
										</button>
									)}
								</div>
								<div className="flex gap-2">
									<button
										className="btn btn-ghost btn-circle btn-sm hover:bg-base-200 transition-all duration-300"
										onClick={handleCopy}
										aria-label="Copy translated text"
									>
										<FiCopy size={18} />
									</button>
									<button
										className="btn btn-ghost btn-circle btn-sm hover:bg-base-200 transition-all duration-300"
										onClick={handleSpeak}
										aria-label="Listen to translated text"
										disabled={!translatedText}
									>
										<FiVolume2 size={18} />
									</button>
									{useRichText && (
										<button
											className={`btn btn-ghost btn-circle btn-sm hover:bg-base-200 transition-all duration-300 ${
												isEditing ? "bg-success/20" : ""
											}`}
											onClick={handleEditToggle}
											aria-label="Edit translated text"
										>
											{isEditing ? (
												<FiCheck size={18} />
											) : (
												<FiEdit2 size={18} />
											)}
										</button>
									)}
								</div>
							</div>
							<div className="flex-1 flex flex-col px-6 pb-6">
								{useRichText ? (
									<ReactQuill
										ref={outputQuillRef}
										value={translatedText}
										onChange={isEditing ? setTranslatedText : undefined}
										readOnly={!isEditing}
										placeholder={
											isTranslating
												? "Translating..."
												: "Translation will appear here..."
										}
										className="border-none !bg-transparent !rounded-none quill-no-border quill-scroll min-h-[120px]"
										aria-label="Translated text"
									/>
								) : (
									<div
										className="bg-base-300/60 p-4 rounded text-base min-h-[120px] max-h-[350px] overflow-y-auto"
										aria-label="Translated text"
									>
										{isTranslating ? (
											<span>Translating...</span>
										) : translatedText ? (
											<span>{translatedText}</span>
										) : (
											<span className="text-gray-500">
												Translation will appear here...
											</span>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Custom Styles for Animations */}
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in {
					animation: fadeIn 1s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
