"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, Sparkles, Check, Volume2 } from "lucide-react";
import {
  isSpeechRecognitionSupported,
  startVoiceRecognition,
  parseSurveyNumberFromSpeech,
  parseDistrictFromSpeech,
  parseCombinedVoiceInput,
} from "@/lib/speechRecognition";
import { Language } from "@/lib/translations";

interface VoiceInputButtonProps {
  mode: "survey" | "district" | "combined";
  onValueDetected: (value: string | { surveyNumber?: string; district?: string }) => void;
  language?: Language;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function VoiceInputButton({
  mode,
  onValueDetected,
  language = "en",
  className = "",
  size = "md",
  label,
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [successFlash, setSuccessFlash] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSupported = isSpeechRecognitionSupported();

  const speechLangCode = language === "hi" ? "hi-IN" : "en-IN";

  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setErrorMessage(null);
    setTranscript("");
    setIsListening(true);

    const rec = startVoiceRecognition({
      language: speechLangCode,
      onResult: (text: string, isFinal: boolean) => {
        setTranscript(text);

        if (isFinal) {
          if (mode === "survey") {
            const parsed = parseSurveyNumberFromSpeech(text);
            if (parsed) {
              onValueDetected(parsed);
              triggerSuccess();
            }
          } else if (mode === "district") {
            const parsed = parseDistrictFromSpeech(text);
            if (parsed) {
              onValueDetected(parsed);
              triggerSuccess();
            }
          } else if (mode === "combined") {
            const parsed = parseCombinedVoiceInput(text);
            if (parsed.surveyNumber || parsed.district) {
              onValueDetected(parsed);
              triggerSuccess();
            }
          }
        }
      },
      onError: (err: any) => {
        setIsListening(false);
        if (err.error === "not-allowed") {
          setErrorMessage(
            language === "hi"
              ? "कृपया माइक्रोफ़ोन अनुमति की अनुमति दें"
              : "Microphone access denied"
          );
        } else if (err.error !== "no-speech") {
          setErrorMessage(
            language === "hi"
              ? "आवाज पहचानने में समस्या आई"
              : "Voice recognition failed"
          );
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    recognitionRef.current = rec;
  };

  const triggerSuccess = () => {
    setSuccessFlash(true);
    setTimeout(() => {
      setSuccessFlash(false);
      setTranscript("");
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!isSupported) {
    return null; // Gracefully degrade if browser does not support Speech API
  }

  const getButtonTitle = () => {
    if (isListening) {
      return language === "hi" ? "सुनना बंद करें" : "Stop listening";
    }
    if (mode === "survey") {
      return language === "hi"
        ? "सर्वे नंबर बोलकर दर्ज करें (उदा. '142/3A')"
        : "Speak survey number (e.g. 142/3A)";
    }
    if (mode === "district") {
      return language === "hi"
        ? "जिले का नाम बोलें (उदा. 'विजयवाड़ा', 'गुंटूर')"
        : "Speak district name (e.g. Vijayawada, Guntur)";
    }
    return language === "hi"
      ? "सर्वे नंबर व जिला बोलकर दर्ज करें"
      : "Speak Survey number and District";
  };

  const sizeClasses = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "px-3.5 py-2 text-sm font-semibold",
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggleListening}
        title={getButtonTitle()}
        className={`relative rounded-lg flex items-center gap-1.5 transition-all duration-200 border ${
          isListening
            ? "bg-red-500/20 text-red-300 border-red-500/60 ring-2 ring-red-500/30 animate-pulse"
            : successFlash
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60 ring-2 ring-emerald-500/30"
            : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border-slate-700 hover:border-emerald-500/40 shadow-sm"
        } ${sizeClasses[size]} ${className}`}
      >
        {isListening ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <Mic className="w-4 h-4 text-red-400 animate-bounce" />
            {label && (
              <span className="text-xs font-bold text-red-300">
                {language === "hi" ? "सुन रहे हैं..." : "Listening..."}
              </span>
            )}
          </>
        ) : successFlash ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            {label && (
              <span className="text-xs font-bold text-emerald-300">
                {language === "hi" ? "दर्ज हुआ!" : "Captured!"}
              </span>
            )}
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            {label && <span>{label}</span>}
          </>
        )}
      </button>

      {/* Live Voice Floating Transcript Tooltip */}
      {(isListening || transcript) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 p-2 rounded-lg bg-slate-950 border border-emerald-500/40 shadow-2xl text-[11px] text-slate-200 backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>{language === "hi" ? "वॉइस इनपुट:" : "Voice Input:"}</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              {speechLangCode}
            </span>
          </div>
          <p className="text-slate-100 font-medium italic truncate">
            {transcript || (language === "hi" ? "स्पष्ट बोलिए..." : "Speak clearly now...")}
          </p>
          <div className="text-[9px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
            {mode === "survey" && (language === "hi" ? "उदा. '142 बटा 3A'" : "e.g. '142 slash 3A'")}
            {mode === "district" && (language === "hi" ? "उदा. 'विजयवाड़ा' या 'गुंटूर'" : "e.g. 'Vijayawada'")}
            {mode === "combined" && (language === "hi" ? "उदा. 'सर्वे 142/3A जिला विजयवाड़ा'" : "e.g. 'Survey 142/3A district Guntur'")}
          </div>
        </div>
      )}

      {/* Error Tooltip */}
      {errorMessage && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 p-2 rounded-lg bg-red-950/90 border border-red-500/40 text-[10px] text-red-200 shadow-xl">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
