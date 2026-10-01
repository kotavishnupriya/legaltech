"use client";

import { useState, useRef, useEffect } from "react";
import { AnalysisResult, ChatMessage } from "@/types/landnyaya";
import {
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Scale,
  RotateCcw,
  BookOpen,
} from "lucide-react";

interface NyayaAIChatProps {
  analysisResult: AnalysisResult | null;
  customApiKey?: string;
}

export default function NyayaAIChat({ analysisResult, customApiKey }: NyayaAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `నమస్కారం! I am **Nyaya AI**, your Senior Counsel for **Andhra Pradesh Land & Revenue Law**. I have ingested the MeeBhoomi Record of Rights for **Survey No. ${
        analysisResult?.propertyInput.surveyNumber || "your land"
      }** in **${analysisResult?.propertyInput.district || "AP"}** (MeeBhoomi 1-B Khata: **${analysisResult?.landRecord?.khataNumber || "1-B Record"}**, Section 22-A Status: **${analysisResult?.landRecord?.section22AFlag ? analysisResult?.landRecord?.section22ACategory : "Clear"}**).

How can I assist you with **Section 22-A Prohibited Properties**, **MeeBhoomi Form-6A Mutation**, **F-Line Demarcation**, **Section 148A Caveat**, or **RDO Section 5-B Appeals**?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions = [
    "How to de-notify property from Section 22-A Prohibited List?",
    "How to file Tatkal F-Line Demarcation under AP Survey Act 1923?",
    "What to do if Tahsildar delays Form-6A MeeBhoomi mutation beyond 30 days?",
    "How to file Section 148A Caveat Petition in AP District Court?",
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          analysisContext: analysisResult,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          customApiKey: customApiKey || (typeof window !== "undefined" ? localStorage.getItem("landnyaya_gemini_api_key") || undefined : undefined),
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Thank you. Please refer to the generated legal drafts for direct filing.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I encountered an issue connecting to the counsel agent. Please verify your internet or API key.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[560px]">
      {/* Header */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Nyaya AI • Interactive Legal Counsel
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Survey No: {analysisResult?.propertyInput.surveyNumber || "Selected Land"} • {analysisResult?.propertyInput.state || "State Jurisdiction"}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "reset",
                role: "assistant",
                content: "Chat session refreshed. You can ask any specific legal question regarding your land records or litigation strategy.",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ])
          }
          className="text-xs text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors"
          title="Clear chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Suggested Queries:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-500/15 hover:text-emerald-300 text-slate-300 border border-slate-700/80 hover:border-emerald-500/30 text-[11px] transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-emerald-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1.5 ${
                    isUser ? "text-emerald-200 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-200" />
              <span className="text-[11px] text-slate-400 ml-1">Consulting Indian Land Acts...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Nyaya AI about caveats, civil injunctions, tehsildar hearings..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4 fill-slate-950" />
          </button>
        </form>
      </div>
    </div>
  );
}
