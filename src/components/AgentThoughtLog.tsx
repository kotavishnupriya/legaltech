"use client";

import { AgentThoughtStep } from "@/types/landnyaya";
import { Language, TRANSLATIONS } from "@/lib/translations";
import {
  BrainCircuit,
  Clock,
  Sparkles,
  Search,
  Database,
  ShieldAlert,
  FileCheck,
} from "lucide-react";
import { useState } from "react";

interface AgentThoughtLogProps {
  thoughtSteps: AgentThoughtStep[];
  isLiveAnalyzing?: boolean;
  language?: Language;
}

export default function AgentThoughtLog({
  thoughtSteps,
  isLiveAnalyzing = false,
  language = "en",
}: AgentThoughtLogProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [isOpen, setIsOpen] = useState(true);

  const getStageIcon = (stageNum: number) => {
    switch (stageNum) {
      case 1:
        return Search;
      case 2:
        return Database;
      case 3:
        return ShieldAlert;
      case 4:
        return BrainCircuit;
      case 5:
        return FileCheck;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between gap-3 text-left hover:bg-slate-950 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {language === "hi" ? "AI कानूनी अन्वेषण प्रक्रिया (Thought Trace)" : "Gemini Legal Agent Reasoning Trace"}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                {language === "hi" ? "5 चरण सत्यापित" : "5 Stages Verified"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isLiveAnalyzing ? t.thoughtLogLive : t.thoughtLogDone}
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 hover:text-white font-medium">
          {isOpen
            ? language === "hi"
              ? "छुपाएं ▲"
              : "Collapse Trace ▲"
            : language === "hi"
            ? "विस्तार से देखें ▼"
            : "Expand Trace ▼"}
        </span>
      </button>

      {/* Body Steps */}
      {isOpen && (
        <div className="p-5 space-y-4 font-mono text-xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {thoughtSteps.map((step, idx) => {
              const Icon = getStageIcon(step.stageNumber);
              const isCompleted = step.status === "completed";

              return (
                <div key={idx} className="relative group">
                  {/* Step Node Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-500/30"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>

                  {/* Content */}
                  <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">
                          {language === "hi" ? `चरण ${step.stageNumber}:` : `Stage ${step.stageNumber}:`}
                        </span>
                        <span className="text-slate-200 font-sans font-semibold">{step.title}</span>
                      </div>
                      {step.completedAt && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {step.completedAt}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 font-sans text-xs leading-relaxed mt-1">
                      {step.description}
                    </p>

                    {/* Data Points Discovered */}
                    {step.dataPointsDiscovered && step.dataPointsDiscovered.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-800/60">
                        {step.dataPointsDiscovered.map((dp, dIdx) => (
                          <span
                            key={dIdx}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-750 text-slate-300"
                          >
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            {dp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
