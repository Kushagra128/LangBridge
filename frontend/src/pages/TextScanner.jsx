import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Tesseract from "tesseract.js";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiDownload,
  FiCopy,
  FiFileText,
  FiFile,
  FiPrinter,
  FiVolume2,
  FiSquare,
  FiInfo,
  FiClock,
  FiSettings,
  FiEye,
  FiX,
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

// Utility to strip HTML tags
function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export default function TextScanner() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState(
    "Test extracted text. This is a sample extracted text for development and UI testing. You can remove or change this default value as needed."
  );
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [ocrLang, setOcrLang] = useState("eng");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ page: 0, total: 0 });
  const [isFormatting, setIsFormatting] = useState(false);
  const [isFormattingTranslated, setIsFormattingTranslated] = useState(false);
  const [rawExtractedText, setRawExtractedText] = useState("");
  const [translationProgress, setTranslationProgress] = useState(0);
  const [history, setHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const translatedEndRef = useRef(null);

  useEffect(() => {
    if (translatedEndRef.current) {
      translatedEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [translatedText]);

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    setFile(f);
    setRawExtractedText("");
    setExtractedText("");
    setTranslatedText("");
    setPdfProgress({ page: 0, total: 0 });
    if (!f) return;
    if (f.type.startsWith("image/")) {
      setIsExtracting(true);
      try {
        const {
          data: { text },
        } = await Tesseract.recognize(f, ocrLang, { logger: (m) => {} });
        setRawExtractedText(text);
        setExtractedText(text);
        addToHistory({ type: "image", text, timestamp: new Date() });
        toast.success("Text extracted from image");
      } catch (err) {
        toast.error("Failed to extract text from image");
      } finally {
        setIsExtracting(false);
      }
    } else if (f.type === "application/pdf") {
      setIsExtracting(true);
      try {
        const pdfjsLib = await import("pdfjs-dist/build/pdf");
        const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker?url");
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
        const reader = new FileReader();
        reader.onload = async function () {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let text = "";
          setPdfProgress({ page: 0, total: pdf.numPages });
          for (let i = 1; i <= pdf.numPages; i++) {
            setPdfProgress({ page: i, total: pdf.numPages });
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            let lines = [];
            let lastY = null;
            let currentLine = [];
            content.items.forEach((item) => {
              if (lastY === null || Math.abs(item.transform[5] - lastY) < 2) {
                currentLine.push(item.str);
              } else {
                lines.push(currentLine.join(" "));
                currentLine = [item.str];
              }
              lastY = item.transform[5];
            });
            if (currentLine.length) lines.push(currentLine.join(" "));
            text += lines.join("\n") + "\n\n";
          }
          setRawExtractedText(text);
          setExtractedText(text);
          addToHistory({ type: "pdf", text, timestamp: new Date() });
          toast.success("Text extracted from PDF");
          setIsExtracting(false);
          setPdfProgress({ page: pdf.numPages, total: pdf.numPages });
        };
        reader.readAsArrayBuffer(f);
      } catch (err) {
        toast.error("Failed to extract text from PDF");
        setIsExtracting(false);
        setPdfProgress({ page: 0, total: 0 });
      }
    } else {
      toast.error("Only image and PDF files are supported");
    }
  };

  const autoFormatExtractedText = async (text) => {
    setIsFormatting(true);
    try {
      const res = await axios.post("/api/translate/format-with-gemini", {
        text,
      });
      setExtractedText(
        res.data.formattedHtml || res.data.formatted || res.data.text || ""
      );
    } catch (err) {
      toast.error("AI formatting failed");
      setExtractedText(text);
    } finally {
      setIsFormatting(false);
    }
  };

  const autoFormatTranslatedText = async (text) => {
    setIsFormattingTranslated(true);
    try {
      const res = await axios.post("/api/translate/format-with-gemini", {
        text,
      });
      setTranslatedText(
        res.data.formattedHtml || res.data.formatted || res.data.text || ""
      );
    } catch (err) {
      toast.error("AI formatting failed");
      setTranslatedText(text);
    } finally {
      setIsFormattingTranslated(false);
    }
  };

  const handleTranslate = async () => {
    if (!extractedText.trim()) return toast.error("No text to translate");
    setIsTranslating(true);
    setTranslationProgress(0);
    let progressInterval;
    try {
      progressInterval = setInterval(() => {
        setTranslationProgress((prev) => (prev < 95 ? prev + 5 : prev));
      }, 100);
      const res = await axios.post("/api/tts/translate", {
        text: stripHtml(extractedText),
        source: "auto",
        target: targetLang,
      });
      await autoFormatTranslatedText(res.data.translatedText);
      addToHistory({
        type: "translation",
        text: res.data.translatedText,
        lang: targetLang,
        timestamp: new Date(),
      });
      setTranslationProgress(100);
      toast.success("Translation complete");
    } catch (err) {
      toast.error("Translation failed");
      setTranslationProgress(0);
    } finally {
      setIsTranslating(false);
      clearInterval(progressInterval);
      setTimeout(() => setTranslationProgress(0), 500);
    }
  };

  const handleExportDOCX = () => {
    if (!window.htmlDocx) {
      toast.error("DOCX export library not loaded.");
      return;
    }
    const converted = window.htmlDocx.asBlob(translatedText);
    const url = URL.createObjectURL(converted);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translated.docx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const blob = new Blob([translatedText], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translated.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(stripHtml(translatedText));
    toast.success("Copied to clipboard");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<html><head><title>Print</title></head><body>${translatedText}</body></html>`
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleSpeak = () => {
    const text = stripHtml(translatedText);
    if (!text) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
  };

  const addToHistory = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 10)); // Keep last 10 entries
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-base-200">
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Text Scanner & Translator</h1>
        <p className="text-base-content/70">
          Effortlessly extract text from images or PDFs and translate it into
          20+ languages. Format, export, or share your results with ease.
        </p>
        <button
          className="btn btn-ghost btn-sm mt-2"
          onClick={() => setShowHelp(true)}
        >
          <FiInfo className="mr-1" /> Learn How It Works
        </button>
      </div>
      {/* Timeline + Content Rows */}
      <div className="w-full max-w-4xl flex flex-col relative">
        {/* Continuous Vertical Line */}
        <div
          className="absolute left-[30px] w-1 bg-primary/30 z-0"
          style={{
            top: "2rem", // Start below the first circle
            height: `calc(100% - 4rem)`, // Span the full height minus top/bottom offsets
            transform: "translateX(-50%)",
          }}
        />
        {/* Step 1: Upload File */}
        <div className="grid grid-cols-[60px_1fr] gap-10 items-start relative min-h-[120px]">
          {/* Timeline left */}
          <div className="flex flex-col items-center relative gap-2 pt-2">
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg bg-primary text-base-100 z-10">
                1
              </div>
            </div>
          </div>
          {/* Content right */}
          <div className="mb-8">
            <div className="card bg-base-100 shadow-lg p-6">
              <h2 className="font-semibold mb-4">Upload File</h2>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
                disabled={isExtracting}
              />
              {isExtracting && (
                <div className="text-center mt-4">
                  <p>Extracting text...</p>
                  {pdfProgress.total > 0 && (
                    <div className="mt-2">
                      <progress
                        className="progress progress-accent w-full"
                        value={pdfProgress.page}
                        max={pdfProgress.total}
                      />
                      <div>
                        Page {pdfProgress.page} of {pdfProgress.total} (
                        {pdfProgress.total > 0
                          ? Math.round((pdfProgress.page / pdfProgress.total) * 100)
                          : 0}
                        %)
                      </div>
                    </div>
                  )}
                </div>
              )}
              {file && (
                <div className="mt-4 flex justify-center">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowPreview(true)}
                  >
                    <FiEye className="mr-1" /> Preview File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Step 2: Extract Text */}
        {extractedText && (
          <div className="grid grid-cols-[60px_1fr] gap-10 items-start relative min-h-[120px]">
            <div className="flex flex-col items-center relative gap-2 pt-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg bg-primary text-base-100 z-10">
                2
              </div>
            </div>
            <div className="mb-8">
              <div className="card bg-base-100 shadow-lg p-6">
                <div className="tabs tabs-boxed mb-4">
                  <a className="tab tab-active">Extracted Text</a>
                </div>
                <ReactQuill
                  value={extractedText}
                  onChange={setExtractedText}
                  className="mb-4 quill-scroll"
                  placeholder="Extracted text will appear here..."
                />
              </div>
            </div>
          </div>
        )}
        {/* Step 3: Translate */}
        {extractedText && (
          <div className="grid grid-cols-[60px_1fr] gap-10 items-start relative min-h-[120px]">
            <div className="flex flex-col items-center relative gap-2 pt-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${
                  translatedText ? "bg-primary" : "bg-primary/30"
                } text-base-100 z-10`}
              >
                3
              </div>
            </div>
            <div className="mb-8">
              <div className="card bg-base-100 shadow-lg p-6">
                <div className="flex gap-2 items-center mb-4">
                  <label>Target Language:</label>
                  <select
                    className="select select-bordered"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-accent"
                    onClick={handleTranslate}
                    disabled={isTranslating}
                  >
                    {isTranslating ? "Translating..." : "Translate"}
                  </button>
                </div>
                {isTranslating && (
                  <div className="w-full flex flex-col items-center mb-4">
                    <progress
                      className="progress progress-success w-1/2"
                      value={translationProgress}
                      max={100}
                    />
                    <span>Translating... {translationProgress}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Step 4: Export/Share */}
        {translatedText && (
          <div className="grid grid-cols-[60px_1fr] gap-10 items-start relative min-h-[120px]">
            <div className="flex flex-col items-center relative gap-2 pt-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg bg-primary text-base-100 z-10">
                4
              </div>
            </div>
            <div className="mb-8">
              <div className="card bg-base-100 shadow-lg p-6">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  Translated Text
                  <button
                    className="btn btn-ghost btn-circle btn-sm"
                    onClick={handleSpeak}
                    title="Play Translated Speech"
                  >
                    <FiVolume2 size={18} />
                  </button>
                  <button
                    className="btn btn-ghost btn-circle btn-sm"
                    onClick={handleStopSpeak}
                    title="Stop Speech"
                  >
                    <FiSquare size={18} />
                  </button>
                </h2>
                <ReactQuill
                  value={translatedText}
                  onChange={setTranslatedText}
                  className="mb-4 quill-scroll"
                  placeholder="Translated text will appear here..."
                />
                <div className="flex gap-2">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleExportDOCX}
                    title="Export as DOCX"
                  >
                    <FiDownload className="mr-1" /> DOCX
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleExportHTML}
                    title="Export as HTML"
                  >
                    <FiDownload className="mr-1" /> HTML
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleCopy}
                    title="Copy to Clipboard"
                  >
                    <FiCopy className="mr-1" /> Copy
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handlePrint}
                    title="Print"
                  >
                    <FiPrinter className="mr-1" /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* File Preview Modal */}
      {showPreview && file && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">File Preview</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowPreview(false)}
            >
              <FiX />
            </button>
            <div className="mt-4">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded preview"
                  className="max-h-96 w-full rounded shadow border"
                />
              ) : file.type === "application/pdf" ? (
                <iframe
                  src={URL.createObjectURL(file)}
                  title="PDF preview"
                  className="w-full h-96 rounded shadow border"
                />
              ) : null}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowPreview(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Help Modal */}
      {showHelp && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">How It Works</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowHelp(false)}
            >
              <FiX />
            </button>
            <div className="mt-4 space-y-4">
              <p>
                <strong>1. Upload a File</strong>: Select an image or PDF to
                extract text from. Supported formats include PNG, JPG, and PDF.
              </p>
              <p>
                <strong>2. Extract Text</strong>: Our OCR technology will
                process the file and extract text, which you can edit in the
                provided editor.
              </p>
              <p>
                <strong>3. Translate</strong>: Choose a target language and
                translate the extracted text. The translated text is also
                editable.
              </p>
              <p>
                <strong>4. Export or Share</strong>: Save your results as DOCX
                or HTML, copy to clipboard, or print directly.
              </p>
              <p>
                <strong>Additional Features</strong>:
                <ul className="list-disc ml-6">
                  <li>Listen to translated text with text-to-speech.</li>
                  <li>
                    Track recent scans and translations in the history panel.
                  </li>
                  <li>Customize OCR language and theme in settings.</li>
                </ul>
              </p>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowHelp(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}