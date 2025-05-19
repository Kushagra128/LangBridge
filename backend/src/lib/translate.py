# To enable transliteration for Indian languages, install:
# pip install indic-transliteration
from googletrans import Translator
import sys
import json
import speech_recognition as sr
# from deep_translator import GoogleTranslator
from gtts import gTTS
import base64
import os

recognizer = sr.Recognizer()
translator = Translator()

def speech_to_text(audio_data, language="en-US"):
    try:
        audio_bytes = base64.b64decode(audio_data)
        with open("temp.wav", "wb") as f:
            f.write(audio_bytes)
        with sr.AudioFile("temp.wav") as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio, language=language)
        os.remove("temp.wav")
        return text
    except sr.UnknownValueError:
        print("Could not understand audio.", file=sys.stderr)
        return ""
    except sr.RequestError as e:
        print(f"Speech Recognition Request Error: {e}", file=sys.stderr)
        return ""
    except Exception as e:
        print(f"Speech-to-Text Error: {e}", file=sys.stderr)
        return ""

def translate_text(text, from_lang="en", to_lang="hi"):
    try:
        if not text or not text.strip():
            return text
        if from_lang == to_lang:
            return text
        print(f"Translating from {from_lang} to {to_lang}", file=sys.stderr)
        translated = translator.translate(text, src=from_lang, dest=to_lang)
        print(f"Translated from {from_lang} to {to_lang}: {translated.text}", file=sys.stderr)
        return translated.text
    except Exception as e:
        print(f"Translation Error: {e}", file=sys.stderr)
        return text

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    action = input_data.get("action", "translate")

    if action == "speech_to_text":
        audio_data = input_data["audioData"]
        language = input_data.get("language", "en-US")
        text = speech_to_text(audio_data, language)
        output = {"text": text}
        print(json.dumps(output))
    elif action == "text_to_speech":
        text = input_data["text"]
        language = input_data.get("language", "en")
        tts = gTTS(text=text, lang=language)
        tts.save("temp.mp3")
        with open("temp.mp3", "rb") as f:
            audio_bytes = f.read()
        os.remove("temp.mp3")
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        output = {"audioData": audio_base64}
        print(json.dumps(output))
    elif action == "translate":
        text = input_data["text"]
        from_lang = input_data.get("fromLang", "en")
        to_lang = input_data.get("toLang", "hi")
        translated_text = translate_text(text, from_lang, to_lang)
        output = {"translatedText": translated_text}
        print(json.dumps(output))
    sys.stdout.flush()