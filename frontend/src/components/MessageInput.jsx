import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Mic, StopCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from 'react-i18next';

const MessageInput = () => {
	const { t } = useTranslation();
	const { sendMessage } = useChatStore();
	const { authUser } = useAuthStore();
	const [text, setText] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [isRecording, setIsRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);
	const [recordingDuration, setRecordingDuration] = useState(0);
	const [recorder, setRecorder] = useState(null);
	const imageInput = useRef(null);
	const timerRef = useRef(null);

	const handleChange = (e) => {
		setText(e.target.value);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreview(reader.result);
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		} else {
			toast.error(t('app.select_image_file', 'Please select an image file'));
			setImage(null);
			setImagePreview(null);
		}
	};

	const handleRemoveImage = () => {
		setImage(null);
		setImagePreview(null);
		if (imageInput.current) {
			imageInput.current.value = "";
		}
	};

	const toggleRecording = async () => {
		if (isRecording) {
			// Stop recording
			stopRecording();
		} else {
			// Start recording
			startRecording();
		}
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			const audioChunks = [];

			mediaRecorder.addEventListener("dataavailable", (event) => {
				audioChunks.push(event.data);
			});

			mediaRecorder.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
				const reader = new FileReader();
				reader.onload = () => {
					setAudioBlob(reader.result);
					toast.success(t('app.voice_recorded', 'Voice message recorded!'));
				};
				reader.readAsDataURL(audioBlob);

				// Stop all tracks in the stream
				stream.getTracks().forEach((track) => track.stop());
			});

			// Start recording
			mediaRecorder.start();
			setRecorder(mediaRecorder);
			setIsRecording(true);

			// Start timer
			setRecordingDuration(0);
			timerRef.current = setInterval(() => {
				setRecordingDuration((prev) => prev + 1);
			}, 1000);

			toast.success(t('app.recording_started', 'Recording started...'));
		} catch (error) {
			console.error("Error starting recording:", error);
			toast.error(t('app.could_not_start_recording', 'Could not start recording. Please check microphone permissions.'));
		}
	};

	const stopRecording = () => {
		if (recorder && recorder.state === "recording") {
			recorder.stop();
			setIsRecording(false);
			clearInterval(timerRef.current);
		}
	};

	const formatDuration = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if ((!text.trim() && !image && !audioBlob) || isRecording) {
			return;
		}

		try {
			const messageData = {
				text: text.trim(),
				image,
				language: authUser?.language || "en", // Include user's preferred language
			};

			// If we have voice data, add it to the message
			if (audioBlob) {
				messageData.voiceMessage = audioBlob;
				messageData.isVoice = true;
			}

			await sendMessage(messageData);

			// Clear form after sending
			setText("");
			setImage(null);
			setImagePreview(null);
			setAudioBlob(null);
			if (imageInput.current) {
				imageInput.current.value = "";
			}
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error(t('app.failed_to_send_message', 'Failed to send message'));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="p-4 border-t border-base-300">
			{/* Image Preview */}
			{imagePreview && (
				<div className="relative mb-2 inline-block">
					<img
						src={imagePreview}
						alt="Preview"
						className="h-32 w-auto rounded-md"
					/>
					<button
						type="button"
						onClick={handleRemoveImage}
						className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1"
					>
						<X size={16} />
					</button>
				</div>
			)}

			{/* Audio Blob Preview */}
			{audioBlob && !isRecording && (
				<div className="relative mb-2 flex items-center bg-base-200 p-2 rounded-md">
					<audio src={audioBlob} controls className="w-full h-10" />
					<button
						type="button"
						onClick={() => setAudioBlob(null)}
						className="ml-2 bg-error text-white rounded-full p-1"
					>
						<X size={16} />
					</button>
				</div>
			)}

			{/* Recording Indicator */}
			{isRecording && (
				<div className="mb-2 flex items-center bg-error/20 p-2 rounded-md text-error animate-pulse">
					<span className="mr-2">● Recording</span>
					<span className="ml-auto">{formatDuration(recordingDuration)}</span>
				</div>
			)}

			<div className="flex items-center gap-2">
				{/* Text Input */}
				<input
				type="text"
				placeholder={t('app.type_message')}
				className="flex-1 input input-bordered bg-base-200 focus:outline-none"
				value={text}
				onChange={handleChange}
				disabled={isRecording}
			/>

				{/* Image Upload Button */}
				<button
					type="button"
					className="btn btn-circle btn-ghost"
					onClick={() => imageInput.current.click()}
					disabled={isRecording}
				>
					<Image size={20} className="text-primary" />
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="hidden"
						ref={imageInput}
					/>
				</button>

				{/* Voice Message Button */}
				<button
					type="button"
					className={`btn btn-circle ${
						isRecording ? "btn-error animate-pulse" : "btn-ghost"
					}`}
					onClick={toggleRecording}
				>
					{isRecording ? (
						<StopCircle size={20} className="text-white" />
					) : (
						<Mic size={20} className="text-primary" />
					)}
				</button>

				{/* Send Button */}
				<button
					type="submit"
					className="btn btn-circle btn-primary"
					disabled={(!text.trim() && !image && !audioBlob) || isRecording}
				>
					<Send size={20} className="text-white" />
				</button>
			</div>
		</form>
	);
};

// Helper function to get language name from code
function getLanguageName(code) {
	const languages = {
		en: "English",
		es: "Spanish",
		fr: "French",
		de: "German",
		it: "Italian",
		pt: "Portuguese",
		ru: "Russian",
		zh: "Chinese",
		ja: "Japanese",
		ar: "Arabic",
		hi: "Hindi",
	};
	return languages[code] || "English";
}

export default MessageInput;
