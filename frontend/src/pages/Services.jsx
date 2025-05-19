import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiFileText, FiMic } from "react-icons/fi";
import axios from "axios";

const Services = () => {
	const navigate = useNavigate();

	const handleChat = () => navigate("/chat");
	const handleVideoConference = () => navigate("/video-conference");
	const handleTextScanner = () => navigate("/text-scanner");
	const handleOpenTranslator = () => navigate("/voice-translate");
	const handleSpeechToSpeech = () => navigate("/speech-to-speech");

	const services = [
		{
			id: 4,
			title: "Open Translator",
			description:
				"Translate full conversations or documents with our versatile open translator. Customize settings for accuracy and context.",
			icon: "🌐",
			onClick: handleOpenTranslator,
		},
		{
			id: 5,
			title: "Speech-to-Speech Translator",
			description:
				"Speak and instantly translate your voice to another language, then hear it spoken aloud. Perfect for real-time multilingual conversations.",
			icon: <FiMic className="text-4xl text-primary mb-2" />,
			onClick: handleSpeechToSpeech,
		},
		{
			id: 3,
			title: "Text Scanner",
			description:
				"Scan printed or handwritten text and translate it instantly. Perfect for documents, signs, or notes in any language.",
			icon: "📷",
			onClick: handleTextScanner,
		},
		{
			id: 1,
			title: "Real-Time Chatting",
			description:
				"Connect instantly with anyone, anywhere, using our AI-powered chat feature. Seamlessly translate messages in real-time across multiple languages.",
			icon: "💬",
			onClick: handleChat,
		},
		{
			id: 2,
			title: "Video Debugging",
			description:
				"Host crystal-clear video meetings with real-time translation and subtitles. Collaborate globally without language barriers.",
			icon: "🎥",
			onClick: handleVideoConference,
		},
	];

	const [userQuestion, setUserQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmitQuestion = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setAnswer("");
		try {
			const res = await axios.post("/api/ai-faq", {
				question: userQuestion,
				wordLimit: 40,
			});
			setAnswer(res.data.answer);
		} catch (err) {
			setAnswer(
				"Sorry, I couldn't get an answer right now. Please try again later."
			);
		}
		setIsSubmitting(false);
	};

	return (
		<main className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
			<div className="mx-auto py-12 sm:py-16 px-4 sm:px-8 md:px-12 max-w-6xl">
				{/* Hero Section */}
				<motion.section
					className="text-center mb-12 sm:mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
						All-in-One Communication Services
					</h1>
					<p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
						LangBridge brings together real-time chat, instant translation,
						speech-to-speech, text scanning, file sharing, and more—powered by
						AI to revolutionize global communication.
					</p>
				</motion.section>

				{/* Services Grid */}
				<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
					{services.map((service) => (
						<motion.div
							key={service.id}
							className="bg-base-200 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-primary/20 cursor-pointer"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: service.id * 0.1 }}
							onClick={service.onClick}
						>
							<div className="text-4xl mb-4 text-primary">{service.icon}</div>
							<h3 className="text-lg sm:text-xl font-semibold mb-2">
								{service.title}
							</h3>
							<p className="text-base-content/80 text-sm leading-relaxed">
								{service.description}
							</p>
							<motion.button
								className="mt-4 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-focus focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Learn More
							</motion.button>
						</motion.div>
					))}
				</section>

				{/* FAQ Section */}
				<section className="bg-base-200 rounded-xl shadow-lg p-6 sm:p-8 mb-12 sm:mb-16 border border-primary/20 transition-colors duration-300">
					<motion.h2
						className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6 sm:mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						Frequently Asked Questions
					</motion.h2>
					<div className="space-y-4">
						{[
							{
								question: "How does real-time chatting work?",
								answer:
									"Our AI translates your messages instantly as you type, supporting over 100 languages. You can chat, translate, scan, or speak in any language. Simply start a chat at /chat!",
							},
							{
								question: "Is video conferencing secure?",
								answer:
									"Yes, we use end-to-end encryption for all video calls and chats. Access it via /video-conference for secure global meetings.",
							},
							{
								question: "Can the Text Scanner recognize handwriting?",
								answer:
									"Yes, our advanced OCR technology supports both printed and handwritten text. You can scan, translate, and share instantly. Try it at /text-scanner!",
							},
							{
								question: "What makes Open Translator different?",
								answer:
									"It offers customizable translation settings for accuracy, ideal for complex documents. You can also use speech-to-speech and text scanning for more flexibility. Explore it at /open-translator!",
							},
						].map((faq, index) => (
							<details key={index} className="group">
								<summary className="text-base sm:text-lg font-semibold cursor-pointer group-open:mb-2">
									{faq.question}
								</summary>
								<p className="text-base-content/80 text-sm sm:text-base leading-relaxed">
									{faq.answer}
								</p>
							</details>
						))}
					</div>

					{/* Interactive Q&A */}
					<motion.div
						className="mt-6 sm:mt-8 p-4 sm:p-6 bg-primary/10 rounded-xl shadow-md border border-primary/20"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">
							Ask Your Question
						</h3>
						<form onSubmit={handleSubmitQuestion} className="space-y-4">
							<textarea
								className="w-full p-2 sm:p-3 border border-primary/20 rounded-lg bg-base-100 text-base-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-200"
								rows="3"
								value={userQuestion}
								onChange={(e) => setUserQuestion(e.target.value)}
								placeholder="Type your question here..."
								disabled={isSubmitting}
							/>
							<motion.button
								type="submit"
								className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-focus focus:ring-2 focus:ring-primary/20 transition-colors duration-200 disabled:bg-primary/40 disabled:cursor-not-allowed"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Answering..." : "Submit"}
							</motion.button>
						</form>
						{answer && (
							<motion.div
								className="mt-4 p-4 bg-base-100 rounded-lg shadow-md border border-primary/10 text-base-content/80 text-sm sm:text-base"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								<p>
									<strong>LangBridge Assistant:</strong> {answer}
								</p>
							</motion.div>
						)}
					</motion.div>
				</section>

				{/* CTA Section */}
				<motion.section
					className="text-center bg-primary/10 border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-300"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
						Ready to Explore?
					</h2>
					<p className="text-base sm:text-lg mb-6">
						Start experiencing seamless communication with LangBridge today.
					</p>
					<motion.button
						whileHover={{ scale: 1.05, backgroundColor: "#16a34a" }}
						whileTap={{ scale: 0.95 }}
						className="px-6 sm:px-8 py-2 sm:py-3 bg-primary text-white rounded-xl font-semibold text-base sm:text-lg shadow-md hover:bg-primary-focus focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
						onClick={handleChat}
					>
						Start Chatting Now
					</motion.button>
				</motion.section>
			</div>
		</main>
	);
};

export default Services;
