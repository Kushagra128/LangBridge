import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
	FiRefreshCw,
	FiSquare,
	FiMic,
	FiMicOff,
	FiClock,
	FiX,
	FiTrash2,
	FiCheck,
} from "react-icons/fi";

const LANGUAGES = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "it", name: "Italian" },
	{ code: "pt", name: "Portuguese" },
	{ code: "ru", name: "Russian" },
	{ code: "zh", name: "Chinese" },
	{ code: "ja", name: "Japanese" },
	{ code: "ar", name: "Arabic" },
	{ code: "hi", name: "Hindi" },
	{ code: "gu", name: "Gujarati" },
	{ code: "bn", name: "Bengali" },
	{ code: "ta", name: "Tamil" },
	{ code: "te", name: "Telugu" },
	{ code: "ml", name: "Malayalam" },
	{ code: "mr", name: "Marathi" },
	{ code: "kn", name: "Kannada" },
	{ code: "pa", name: "Punjabi" },
	{ code: "or", name: "Odia" },
];

export default function SpeechToSpeech() {
	const [isRecording, setIsRecording] = useState(false);
	const [recognizedText, setRecognizedText] = useState("");
	const [translatedText, setTranslatedText] = useState("");
	const [targetLang, setTargetLang] = useState("es");
	const [sourceLang, setSourceLang] = useState("en-US");
	const [manualText, setManualText] = useState("");
	const [voiceInputMode, setVoiceInputMode] = useState(false);
	const [inputVolume, setInputVolume] = useState(0);
	const [history, setHistory] = useState([]); // Store recent translations
	const [showHistory, setShowHistory] = useState(false);
	const manualTextRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const audioStreamRef = useRef(null);
	const analyserRef = useRef(null);
	const animationFrameRef = useRef(null);

	// Auto-grow for textarea
	const handleManualTextChange = (e) => {
		setManualText(e.target.value);
		const textarea = manualTextRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = textarea.scrollHeight + "px";
		}
	};

	// Animate mic based on input volume
	const startVolumeMeter = (stream) => {
		const audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();
		const source = audioContext.createMediaStreamSource(stream);
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;
		source.connect(analyser);
		analyserRef.current = analyser;
		function updateVolume() {
			const dataArray = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteTimeDomainData(dataArray);
			let sum = 0;
			for (let i = 0; i < dataArray.length; i++) {
				const val = (dataArray[i] - 128) / 128;
				sum += val * val;
			}
			const rms = Math.sqrt(sum / dataArray.length);
			setInputVolume(rms);
			animationFrameRef.current = requestAnimationFrame(updateVolume);
		}
		updateVolume();
	};

	const stopVolumeMeter = () => {
		if (animationFrameRef.current)
			cancelAnimationFrame(animationFrameRef.current);
		setInputVolume(0);
		if (analyserRef.current && analyserRef.current.context) {
			analyserRef.current.context.close();
		}
		analyserRef.current = null;
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioStreamRef.current = stream;
			startVolumeMeter(stream);
			const mediaRecorder = new window.MediaRecorder(stream, {
				mimeType: "audio/webm",
			});
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];
			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) audioChunksRef.current.push(e.data);
			};
			mediaRecorder.onstop = async () => {
				stopVolumeMeter();
				if (audioStreamRef.current) {
					audioStreamRef.current.getTracks().forEach((track) => track.stop());
					audioStreamRef.current = null;
				}
				const audioBlob = new Blob(audioChunksRef.current, {
					type: "audio/webm",
				});
				const formData = new FormData();
				formData.append("audio", audioBlob, "recording.webm");
				formData.append("languageCode", sourceLang);
				try {
					const res = await axios.post("/api/speech-to-text", formData, {
						headers: { "Content-Type": "multipart/form-data" },
					});
					setRecognizedText(res.data.transcription);
					setManualText(res.data.transcription);
					handleTranslate(res.data.transcription, targetLang);
				} catch (err) {
					toast.error(
						"Speech-to-text failed: " +
							(err.response?.data?.error || err.message)
					);
				}
			};
			mediaRecorder.start();
			setIsRecording(true);
		} catch (err) {
			toast.error("Could not start recording: " + err.message);
		}
	};

	const stopRecording = () => {
		mediaRecorderRef.current && mediaRecorderRef.current.stop();
		setIsRecording(false);
		stopVolumeMeter();
	};

	const handleTranslate = async (text, target) => {
		if (!text || !text.trim()) {
			toast.error("No text to translate");
			return;
		}
		if (!target) {
			toast.error("No target language selected");
			return;
		}
		try {
			const res = await axios.post("/api/tts/translate", {
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
			toast.error(
				"Translation failed: " + (err.response?.data?.error || err.message)
			);
		}
	};

	const handleManualTranslate = () => {
		if (!manualText.trim()) {
			toast.error("Enter some text first");
			return;
		}
		setRecognizedText(manualText);
		handleTranslate(manualText, targetLang);
	};

	const handleSpeak = () => {
		if (!translatedText) return;
		const utterance = new window.SpeechSynthesisUtterance(translatedText);
		utterance.lang = targetLang;
		window.speechSynthesis.speak(utterance);
	};

	const handleStopSpeak = () => {
		window.speechSynthesis.cancel();
	};

	const handleRefresh = () => {
		setManualText("");
		setRecognizedText("");
		setTranslatedText("");
		setIsRecording(false);
		toast.success("Cleared");
	};

	const handleHistoryClick = (entry) => {
		setManualText(entry.input);
		setRecognizedText(entry.input);
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
		<div className="min-h-screen flex flex-col items-center p-6 bg-base-200">
			{/* Header Section */}
			<header className="w-full max-w-5xl mx-auto pt-8 pb-4 px-4 text-center">
				<h1 className="text-3xl font-bold tracking-tight text-primary animate-fade-in">
					Speech-to-Speech Translator
				</h1>
				<p className="text-lg text-base-content/70 mt-2">
					Speak or type to translate into 20+ languages instantly
				</p>
			</header>

			{/* Main Content Section */}
			<main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
				<div className="bg-base-100 rounded-xl shadow-2xl p-8 border border-base-300">
					{/* Controls Section */}
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div className="flex flex-wrap items-center gap-3">
							<div className="flex flex-col">
								<label className="text-sm font-semibold text-base-content mb-1">
									Source Language:
								</label>
								<select
									className="select select-bordered w-40 text-sm focus:border-primary transition-all duration-300"
									value={sourceLang}
									onChange={(e) => setSourceLang(e.target.value)}
								>
									<option value="en-US">English (US)</option>
									<option value="hi-IN">Hindi</option>
									<option value="gu-IN">Gujarati</option>
									<option value="es-ES">Spanish</option>
									<option value="fr-FR">French</option>
									<option value="de-DE">German</option>
									<option value="zh-CN">Chinese</option>
									<option value="ar-SA">Arabic</option>
									<option value="ru-RU">Russian</option>
									<option value="ja-JP">Japanese</option>
									<option value="bn-IN">Bengali</option>
									<option value="ta-IN">Tamil</option>
									<option value="te-IN">Telugu</option>
									<option value="ml-IN">Malayalam</option>
									<option value="mr-IN">Marathi</option>
									<option value="kn-IN">Kannada</option>
									<option value="pa-IN">Punjabi</option>
									<option value="or-IN">Odia</option>
								</select>
							</div>
							<div className="flex flex-col">
								<label className="text-sm font-semibold text-base-content mb-1">
									Target Language:
								</label>
								<select
									className="select select-bordered w-40 text-sm focus:border-primary transition-all duration-300"
									value={targetLang}
									onChange={(e) => setTargetLang(e.target.value)}
								>
									{LANGUAGES.map((lang) => (
										<option key={lang.code} value={lang.code}>
											{lang.name}
										</option>
									))}
								</select>
							</div>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									className="toggle toggle-primary"
									checked={voiceInputMode}
									onChange={() => setVoiceInputMode((v) => !v)}
								/>
								<span className="text-sm font-semibold">Voice Input</span>
							</label>
						</div>
						<div className="flex gap-2">
							<button
								className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-300"
								onClick={handleRefresh}
								aria-label="Refresh/Clear"
								title="Clear all"
							>
								<FiRefreshCw size={18} />
							</button>
							<button
								className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-300"
								onClick={() => setShowHistory(!showHistory)}
								aria-label="Toggle history"
								title="View history"
							>
								<FiClock size={18} />
							</button>
						</div>
					</div>

					{/* History Panel */}
					{showHistory && (
						<div className="bg-base-200/60 rounded-lg p-4 max-h-64 overflow-y-auto border border-base-300 shadow-lg mb-6">
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
														{entry.input.substring(0, 50)}
														{entry.input.length > 50 ? "..." : ""}
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

					{/* Main Content Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Input Section */}
						<div className="flex flex-col bg-base-200/60 rounded-lg p-6 border border-base-300 shadow-lg transition-all duration-300 hover:shadow-xl">
							<h2 className="font-semibold text-lg text-primary mb-4">
								1. Input
							</h2>
							<div className="flex-1 flex items-center justify-center">
								{voiceInputMode ? (
									<button
										className={`relative flex flex-col items-center justify-center w-28 h-28 rounded-full bg-primary/20 border-4 border-primary shadow-md transition-all duration-200 ${
											isRecording ? "animate-pulse" : ""
										}`}
										style={{
											boxShadow: isRecording
												? `0 0 ${20 + inputVolume * 80}px 8px #fbbf24`
												: undefined,
										}}
										onClick={isRecording ? stopRecording : startRecording}
										aria-label={
											isRecording ? "Stop Recording" : "Start Recording"
										}
									>
										{isRecording ? (
											<FiMicOff
												size={48}
												className="text-primary animate-pulse"
											/>
										) : (
											<FiMic size={48} className="text-primary" />
										)}
										<span className="mt-3 text-sm font-medium">
											{isRecording ? "Listening..." : "Tap to Speak"}
										</span>
									</button>
								) : (
									<textarea
										ref={manualTextRef}
										className="textarea textarea-bordered w-full min-h-full h-24 resize-none transition-all duration-200 text-sm focus:border-primary"
										placeholder="Type text here..."
										value={manualText}
										onChange={handleManualTextChange}
									/>
								)}
							</div>
						</div>

						{/* Recognized/Input Text Section */}
						<div className="flex flex-col bg-base-200/60 rounded-lg p-6 border border-base-300 shadow-lg transition-all duration-300 hover:shadow-xl">
							<h2 className="font-semibold text-lg text-primary mb-4">
								2. Recognized/Input Text
							</h2>
							<div className="flex-1">
								<div className="p-4 bg-base-300/60 rounded-lg h-48 overflow-y-auto text-base-content min-h-full text-sm">
									{recognizedText || (
										<span className="text-gray-500">
											Your spoken or typed text will appear here...
										</span>
									)}
								</div>
							</div>
							<button
								className="btn btn-accent mt-4 text-sm hover:bg-accent/80 transition-all duration-300"
								onClick={handleManualTranslate}
							>
								Translate Typed Text
							</button>
						</div>

						{/* Translated Text & Speech Section */}
						<div className="flex flex-col bg-base-200/60 rounded-lg p-6 border border-base-300 shadow-lg transition-all duration-300 hover:shadow-xl">
							<h2 className="font-semibold text-lg text-primary mb-4">
								3. Translated & Speech
							</h2>
							<div className="flex-1">
								<div className="p-4 bg-base-300/60 rounded-lg h-48 overflow-y-auto text-base-content min-h-full text-sm">
									{translatedText || (
										<span className="text-gray-500">
											Translation will appear here...
										</span>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 mt-4 w-full">
								<button
									className="btn btn-primary text-sm flex-1 hover:bg-primary/80 transition-all duration-300"
									onClick={handleSpeak}
									disabled={!translatedText}
								>
									Play
								</button>
								<button
									className="btn btn-outline text-sm flex-1 hover:bg-base-200 transition-all duration-300"
									onClick={handleStopSpeak}
									disabled={!translatedText}
								>
									<FiSquare size={14} className="inline mr-1" /> Stop
								</button>
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
