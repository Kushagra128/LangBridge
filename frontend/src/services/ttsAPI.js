// Service to call backend TTS API and play audio
import toast from "react-hot-toast";

export async function speakTextViaBackend(text, language = "en") {
	try {
		const response = await fetch("/api/tts", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text, language }),
		});
		if (!response.ok) throw new Error("TTS backend error");
		const { audioData } = await response.json();
		if (!audioData) throw new Error("No audio data received");
		const audio = new window.Audio(`data:audio/mp3;base64,${audioData}`);
		// Attach to DOM for reliability
		document.body.appendChild(audio);
		audio.onended = () => {
			try {
				document.body.removeChild(audio);
			} catch {}
		};
		audio.onerror = (e) => {
			toast.error("Audio playback failed");
			try {
				document.body.removeChild(audio);
			} catch {}
		};
		audio.play();
		return audio;
	} catch (err) {
		console.error("[TTS] Error:", err);
		toast.error("Text-to-speech failed");
		throw err;
	}
}
