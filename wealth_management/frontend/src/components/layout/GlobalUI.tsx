"use client";
import React, { useRef, useState } from "react";
import { useTheme } from "../providers/ThemeProvider";
import { useCurrency } from "../providers/CurrencyProvider";
import { useLanguage } from "../providers/LanguageProvider";

const Toast: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose,
}) => (
  <div className="fixed bottom-20 right-6 z-50 bg-black text-white px-4 py-2 rounded shadow-lg animate-fade-in">
    {message}
    <button onClick={onClose} className="ml-4 text-sm underline">
      Close
    </button>
  </div>
);

const VoiceAssistant: React.FC = () => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { setTheme } = useTheme();
  const { setCurrency, currencies } = useCurrency();
  const { setLanguage, languages } = useLanguage();

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utter = new window.SpeechSynthesisUtterance(text);
    synth.speak(utter);
  };

  const handleVoiceCommand = (command: string) => {
    const cmd = command.toLowerCase();
    if (cmd.includes("dark")) {
      setTheme("dark");
      speak("Dark mode enabled");
    } else if (cmd.includes("light")) {
      setTheme("light");
      speak("Light mode enabled");
    } else if (cmd.includes("currency")) {
      for (const c of currencies) {
        if (cmd.includes(c.toLowerCase())) {
          setCurrency(c);
          speak(`Currency set to ${c}`);
          return;
        }
      }
    } else if (cmd.includes("language")) {
      for (const l of languages) {
        if (cmd.includes(l.label.toLowerCase()) || cmd.includes(l.code)) {
          setLanguage(l.code);
          speak(`Language set to ${l.label}`);
          return;
        }
      }
    } else {
      speak("Sorry, I didn't understand the command.");
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleVoiceCommand(transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white rounded-full shadow-lg p-4 hover:bg-indigo-700 focus:outline-none group"
      title="Voice Assistant"
    >
      <span role="img" aria-label="microphone">
        🎤
      </span>
      {listening && <span className="ml-2 animate-pulse">Listening...</span>}
      <span className="absolute bottom-16 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Voice Assistant
      </span>
    </button>
  );
};

export const GlobalUI: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencies } = useCurrency();
  const { language, setLanguage, languages } = useLanguage();
  const [toast, setToast] = useState<string>("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      {/* Theme Toggle, Currency, Language */}
      <div className="fixed top-6 right-6 z-50 flex space-x-2 items-center">
        <div className="relative group">
          <button
            onClick={() => {
              toggleTheme();
              showToast(`Theme: ${theme === "dark" ? "Light" : "Dark"}`);
            }}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded shadow focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Toggle Theme
          </span>
        </div>
        <div className="relative group">
          <select
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              showToast(`Currency: ${e.target.value}`);
            }}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded focus:outline-none"
            aria-label="Select currency"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Select Currency
          </span>
        </div>
        <div className="relative group">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              showToast(
                `Language: ${
                  languages.find((l) => l.code === e.target.value)?.name
                }`
              );
            }}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded focus:outline-none max-h-60 overflow-y-auto"
            aria-label="Select language"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
          <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Select Language
          </span>
        </div>
      </div>
      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      {/* Voice Assistant */}
      <VoiceAssistant />
      <footer className="fixed bottom-0 left-0 w-full bg-gray-100 text-gray-700 text-center py-2 text-sm z-50 border-t border-gray-200">
        For support, contact Binary Data Labs:
        <a href="mailto:naiksoham267@gmail.com" className="underline mx-1">
          naiksoham267@gmail.com
        </a>{" "}
        |<span className="mx-1">+91 9325828760</span> |
        <a
          href="https://www.linkedin.com/in/sohamnaik26/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline mx-1"
        >
          LinkedIn: Soham Naik
        </a>{" "}
        |
        <a
          href="https://www.instagram.com/sohamnaik26/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline mx-1"
        >
          Instagram: @sohamnaik26
        </a>
      </footer>
    </>
  );
};
