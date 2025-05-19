import sys
import json
import speech_recognition as sr
from pydub import AudioSegment
import os

def get_google_webspeech_code(lang_code):
    # Map to the best-supported Google Web Speech API codes
    mapping = {
        'en': 'en-US',
        'en-US': 'en-US',
        'hi': 'hi-IN',
        'hi-IN': 'hi-IN',
        'gu': 'gu-IN',
        'gu-IN': 'gu-IN',
        'mr': 'mr-IN',
        'mr-IN': 'mr-IN',
        'pa': 'pa-IN',
        'pa-IN': 'pa-IN',
        'bn': 'bn-IN',
        'bn-IN': 'bn-IN',
        'ta': 'ta-IN',
        'ta-IN': 'ta-IN',
        'te': 'te-IN',
        'te-IN': 'te-IN',
        'ml': 'ml-IN',
        'ml-IN': 'ml-IN',
        'kn': 'kn-IN',
        'kn-IN': 'kn-IN',
        'or': 'or-IN',
        'or-IN': 'or-IN',
        'es': 'es-ES',
        'es-ES': 'es-ES',
        'fr': 'fr-FR',
        'fr-FR': 'fr-FR',
        'de': 'de-DE',
        'de-DE': 'de-DE',
        'zh': 'zh-CN',
        'zh-CN': 'zh-CN',
        'ar': 'ar-SA',
        'ar-SA': 'ar-SA',
        'ru': 'ru-RU',
        'ru-RU': 'ru-RU',
        'ja': 'ja-JP',
        'ja-JP': 'ja-JP',
    }
    return mapping.get(lang_code, 'en-US')

def convert_to_wav(input_path):
    output_path = input_path + ".wav"
    try:
        audio = AudioSegment.from_file(input_path)
        audio.export(output_path, format="wav")
        return output_path
    except Exception as e:
        print(json.dumps({"error": f"ffmpeg/pydub error: {str(e)}"}))
        sys.exit(1)

def speech_to_text(audio_path, language="en-US"):
    recognizer = sr.Recognizer()
    wav_path = convert_to_wav(audio_path)
    google_lang = get_google_webspeech_code(language)
    try:
        with sr.AudioFile(wav_path) as source:
            recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio, language=google_lang)
                return text
            except sr.UnknownValueError:
                return ""
            except sr.RequestError as e:
                return ""
    except Exception as e:
        print(json.dumps({"error": f"speech_recognition error: {str(e)}"}))
        sys.exit(1)
    finally:
        if os.path.exists(wav_path):
            os.remove(wav_path)

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    audio_path = input_data["audio_path"]
    language = input_data.get("language", "en-US")
    text = speech_to_text(audio_path, language)
    print(json.dumps({"text": text})) 