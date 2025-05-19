import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { speakTextViaBackend } from "../services/ttsAPI";
import { useTranslation } from "react-i18next";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { Trash2 } from "lucide-react";

// Language configurations for text-to-speech
const LANGUAGE_VOICES = {
	en: { lang: "en-US", name: "English" },
	es: { lang: "es-ES", name: "Spanish" },
	fr: { lang: "fr-FR", name: "French" },
	de: { lang: "de-DE", name: "German" },
	it: { lang: "it-IT", name: "Italian" },
	pt: { lang: "pt-BR", name: "Portuguese" },
	ru: { lang: "ru-RU", name: "Russian" },
	zh: { lang: "zh-CN", name: "Chinese" },
	ja: { lang: "ja-JP", name: "Japanese" },
	ar: { lang: "ar-SA", name: "Arabic" },
	hi: { lang: "hi-IN", name: "Hindi" },
	gu: { lang: "gu-IN", name: "Gujarati" },
	bn: { lang: "bn-IN", name: "Bengali" },
	ta: { lang: "ta-IN", name: "Tamil" },
	te: { lang: "te-IN", name: "Telugu" },
	ml: { lang: "ml-IN", name: "Malayalam" },
	or: { lang: "or-IN", name: "Odia" },
};

const ChatContainer = () => {
	const { t } = useTranslation();
	const {
		messages,
		getMessages,
		isMessagesLoading,
		selectedUser,
		subscribeToMessages,
		unsubscribeFromMessages,
		deleteMessage,
	} = useChatStore();
	const { authUser } = useAuthStore();
	const messageEndRef = useRef(null);
	const messagesContainerRef = useRef(null);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [currentSpeakingText, setCurrentSpeakingText] = useState("");
	const [currentSpeakingLanguage, setCurrentSpeakingLanguage] = useState("");
	const synth = useRef(window.speechSynthesis);
	const availableVoices = useRef([]);
	const [modalImage, setModalImage] = useState(null);
	const [speakingMessageId, setSpeakingMessageId] = useState(null);

	// Initialize available voices
	useEffect(() => {
		const loadVoices = () => {
			availableVoices.current = synth.current.getVoices();
		};

		// Load voices right away if they're already available
		if (synth.current) {
			loadVoices();

			// Chrome loads voices asynchronously, so we need this event
			synth.current.onvoiceschanged = loadVoices;
		}

		return () => {
			if (synth.current) {
				synth.current.onvoiceschanged = null;
			}
		};
	}, []);

	// Stop any speech when component unmounts or conversation changes
	useEffect(() => {
		return () => {
			if (synth.current && synth.current.speaking) {
				synth.current.cancel();
				setIsSpeaking(false);
				setCurrentSpeakingText("");
				setCurrentSpeakingLanguage("");
			}
		};
	}, [selectedUser]);

	useEffect(() => {
		getMessages(selectedUser._id);
		subscribeToMessages();
		return () => unsubscribeFromMessages();
	}, [
		selectedUser._id,
		getMessages,
		subscribeToMessages,
		unsubscribeFromMessages,
	]);

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		if (messageEndRef.current && messagesContainerRef.current && messages) {
			// Use scrollIntoView with block: "end" to scroll within the container
			messageEndRef.current.scrollIntoView({
				behavior: "smooth",
				block: "end",
				inline: "nearest",
			});
		}
	}, [messages]);

	const getBestVoice = (languageCode) => {
		const langConfig = LANGUAGE_VOICES[languageCode] || LANGUAGE_VOICES.en;

		if (availableVoices.current.length === 0) {
			return null;
		}

		// Try to find a voice matching the exact language code
		let voice = availableVoices.current.find((v) =>
			v.lang.startsWith(langConfig.lang)
		);

		// If no voice found, fall back to English
		if (!voice && languageCode !== "en") {
			setIsSpeaking(false);
			setCurrentSpeakingText("");
			setCurrentSpeakingLanguage("");
		}
	};

	const speakMessage = (text, languageCode = "en", messageId = null) => {
		if (!text) return;
		const langConfig = LANGUAGE_VOICES[languageCode] || LANGUAGE_VOICES.en;
		if (synth.current.speaking) {
			synth.current.cancel();
		}
		setIsSpeaking(true);
		setCurrentSpeakingText(text);
		setCurrentSpeakingLanguage(langConfig.name);
		setSpeakingMessageId(messageId);
		const utterance = new window.SpeechSynthesisUtterance(text);
		utterance.lang = langConfig.lang;
		utterance.onend = () => {
			setIsSpeaking(false);
			setCurrentSpeakingText("");
			setCurrentSpeakingLanguage("");
			setSpeakingMessageId(null);
		};
		window.speechSynthesis.speak(utterance);
	};

	const stopSpeaking = () => {
		window.speechSynthesis.cancel();
		setIsSpeaking(false);
		setCurrentSpeakingText("");
		setCurrentSpeakingLanguage("");
		setSpeakingMessageId(null);
	};

	if (isMessagesLoading) {
		return (
			<div className="h-full flex flex-col overflow-hidden">
				<ChatHeader />
				<div className="flex-1 overflow-y-auto p-4">
					<MessageSkeleton />
				</div>
				<MessageInput />
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col overflow-hidden">
			{/* Chat Header - Fixed at the top */}
			<div className="z-10 bg-base-100 border-b border-base-300">
				<ChatHeader />
				{isSpeaking && (
					<div className="flex items-center justify-center gap-2 p-2 bg-primary/20 text-sm">
						<Volume2 size={16} className="animate-pulse text-primary" />
						<span>
							Speaking in {currentSpeakingLanguage || "English"}...{" "}
							<span className="text-xs opacity-75">
								"{currentSpeakingText.substring(0, 30)}
								{currentSpeakingText.length > 30 ? "..." : ""}"
							</span>
						</span>
						<button
							className="btn btn-xs btn-error ml-auto"
							onClick={stopSpeaking}
						>
							<VolumeX size={14} />
							Stop
						</button>
					</div>
				)}
			</div>

			{/* Chat Messages - Scrollable */}
			<div
				ref={messagesContainerRef}
				className="flex-1 overflow-y-auto p-4 space-y-4"
			>
				{messages.length === 0 ? (
					<div className="text-center text-base-content/60 py-4">
						{t("app.no_messages")}
					</div>
				) : (
					messages.map((message) => (
						<div
							key={message._id}
							className={`chat ${
								message.senderId === authUser._id ? "chat-end" : "chat-start"
							}`}
						>
							<div className="chat-image avatar">
								<div className="size-8 rounded-full border">
									<img
										src={
											message.senderId === authUser._id
												? authUser.profileImage || "./src/assets/prof.jpg"
												: selectedUser.profileImage || "./src/assets/prof.jpg"
										}
										alt="profile pic"
									/>
								</div>
							</div>
							<div className="chat-header mb-1 flex items-center">
								<span className="font-bold text-xs opacity-70">
									{message.senderId === authUser._id
										? authUser.username
										: selectedUser.username}
								</span>
								<time className="text-xs opacity-50 ml-1">
									{formatMessageTime(message.createdAt)}
								</time>

								{/* Text-to-Speech Button for any text message */}
								{message.text && (
									<button
										className="ml-2 text-primary opacity-70 hover:opacity-100 flex items-center"
										onClick={() =>
											speakingMessageId === message._id
												? stopSpeaking()
												: speakMessage(
														message.text,
														message.language ||
															(message.senderId === authUser._id
																? authUser.language
																: selectedUser.language) ||
															"en",
														message._id
												  )
										}
										title={
											speakingMessageId === message._id
												? `Stop text-to-speech`
												: `Play text-to-speech (${
														LANGUAGE_VOICES[
															message.language ||
																(message.senderId === authUser._id
																	? authUser.language
																	: selectedUser.language) ||
																"en"
														].name
												  })`
										}
									>
										{speakingMessageId === message._id ? (
											<VolumeX
												size={16}
												className="hover:scale-110 transition-transform text-error"
											/>
										) : (
											<Volume2
												size={16}
												className="hover:scale-110 transition-transform"
											/>
										)}
									</button>
								)}

								{message.senderId === authUser._id && (
									<button
										className="ml-2 text-error opacity-70 hover:opacity-100 flex items-center"
										onClick={() => {
											if (window.confirm("Delete this message?")) {
												deleteMessage(message._id);
											}
										}}
										title="Delete message"
									>
										<Trash2
											size={16}
											className="hover:scale-110 transition-transform"
										/>
									</button>
								)}
							</div>

							<div className="chat-bubble flex flex-col">
								{message.image && (
									<img
										src={message.image}
										alt="Attachment"
										className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:shadow-lg transition-shadow"
										onClick={() => setModalImage(message.image)}
									/>
								)}
								{message.isVoice && message.voiceMessage && (
									<div className="flex items-center bg-base-300/30 p-2 rounded-md">
										<Volume2 size={20} className="mr-2 text-primary" />
										<audio
											src={message.voiceMessage}
											controls
											className="w-full h-8"
										/>
									</div>
								)}
								{message.text && (
									<div className="relative group">
										<p>{message.text}</p>
										{message.language && message.language !== "en" && (
											<span className="text-xs opacity-50 absolute -bottom-4 right-0 hidden group-hover:inline-block">
												{LANGUAGE_VOICES[message.language]?.name ||
													message.language}
											</span>
										)}
									</div>
								)}
							</div>
						</div>
					))
				)}
				<div ref={messageEndRef} />
			</div>

			{/* Message Input - Fixed at the bottom */}
			<div className="z-10 bg-base-100 border-t border-base-300">
				<MessageInput />
			</div>

			{/* Modal Overlay */}
			{modalImage && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
					onClick={() => setModalImage(null)}
				>
					<div className="relative" onClick={(e) => e.stopPropagation()}>
						<button
							className="absolute top-2 right-2 bg-error text-white rounded-full p-1 z-10"
							onClick={() => setModalImage(null)}
							aria-label="Close"
						>
							&times;
						</button>
						<img
							src={modalImage}
							alt="Full size"
							className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-base-100"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatContainer;
