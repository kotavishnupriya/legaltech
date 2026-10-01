"use client";

import { useState } from "react";
import { ActionPlanStep } from "@/types/landnyaya";
import { Language, TRANSLATIONS } from "@/lib/translations";
import {
  Clock,
  Landmark,
  FileCheck2,
  CheckSquare,
  Square,
  DollarSign,
  ChevronRight,
} from "lucide-react";

interface ActionPlanRoadmapProps {
  actionPlan: {
    immediate: ActionPlanStep[];
    revenueAuthority: ActionPlanStep[];
    judicialRemedy: ActionPlanStep[];
  };
  onNavigateToDocument?: (docId: string) => void;
  language?: Language;
}

export default function ActionPlanRoadmap({
  actionPlan,
  onNavigateToDocument,
  language = "en",
}: ActionPlanRoadmapProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sections = [
    {
      id: "immediate",
      title: language === "hi" ? "चरण 1: त्वरित कानूनी कदम" : "Phase 1: Immediate Statutory Actions",
      timeframe: language === "hi" ? "1 से 7 दिन" : "Days 1 to 7",
      color: "border-amber-500/40 text-amber-400 bg-amber-500/10",
      steps: actionPlan.immediate,
      badge: language === "hi" ? "महत्वपूर्ण पहला कदम" : "Crucial First Step",
    },
    {
      id: "revenue",
      title: language === "hi" ? "चरण 2: राजस्व अधिकारी / तहसीलदार कार्यवाही" : "Phase 2: Revenue Authority Proceedings",
      timeframe: language === "hi" ? "2 से 4 सप्ताह" : "Weeks 2 to 4",
      color: "border-blue-500/40 text-blue-400 bg-blue-500/10",
      steps: actionPlan.revenueAuthority,
      badge: language === "hi" ? "तहसीलदार एवं सर्वे कार्यालय" : "Tahsildar & Survey Office",
    },
    {
      id: "judicial",
      title: language === "hi" ? "चरण 3: दीवानी एवं न्यायिक उपाय" : "Phase 3: Civil & Judicial Remedies",
      timeframe: language === "hi" ? "30 से 90+ दिन" : "Days 30 to 90+",
      color: "border-purple-500/40 text-purple-400 bg-purple-500/10",
      steps: actionPlan.judicialRemedy,
      badge: language === "hi" ? "दीवानी कोर्ट एवं RDO अपील" : "Civil Court & RDO Appeal",
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div
          key={section.id}
          className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg"
        >
          {/* Section Header */}
          <div className="px-5 py-4 bg-slate-950/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${section.color}`}>
                {section.timeframe}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">{section.title}</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
              {section.badge}
            </span>
          </div>

          {/* Section Steps */}
          <div className="divide-y divide-slate-800/70 p-2">
            {section.steps.map((step) => {
              const isChecked = !!completedSteps[step.id];

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg transition-colors ${
                    isChecked ? "bg-emerald-950/20 opacity-80" : "hover:bg-slate-850/60"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Interactive Checkbox */}
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="mt-1 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                      title={language === "hi" ? "कदम को पूर्ण चिह्नित करें" : "Mark step as done"}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                      )}
                    </button>

                    {/* Step Body */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            isChecked ? "line-through text-slate-400" : "text-slate-200"
                          }`}
                        >
                          {step.title}
                        </h4>

                        <div className="flex items-center gap-2">
                          {step.priority === "Urgent" && (
                            <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
                              {language === "hi" ? "अति आवश्यक (Urgent)" : "Urgent"}
                            </span>
                          )}
                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {step.timeframe}
                          </span>
                        </div>
                      </div>

                      {/* Authority & Cost ribbon */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1 text-slate-300">
                          <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{step.authority}</span>
                        </div>
                        {step.estimatedCost && (
                          <div className="flex items-center gap-1 text-amber-300/90 font-mono">
                            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                            <span>{language === "hi" ? "अनुमानित शुल्क: " : "Cost: "}{step.estimatedCost}</span>
                          </div>
                        )}
                      </div>

                      {/* Instruction Points */}
                      <ul className="space-y-1.5 pt-1 text-xs text-slate-300">
                        {step.instructions.map((inst, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Quick Action Button to Documents */}
                      {onNavigateToDocument && (
                        <div className="pt-2 flex items-center gap-2">
                          {step.id === "act-1" && (
                            <button
                              onClick={() => onNavigateToDocument("legal_notice")}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium border border-slate-700 transition-colors"
                            >
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                              {language === "hi" ? "वकील कानूनी नोटिस देखें" : "View Generated Legal Notice"}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          {step.id === "act-2" && (
                            <button
                              onClick={() => onNavigateToDocument("rti_application")}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium border border-slate-700 transition-colors"
                            >
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                              {language === "hi" ? "RTI फॉर्म A आवेदन देखें" : "View Generated RTI Form A"}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          {step.id === "act-3" && (
                            <button
                              onClick={() => onNavigateToDocument("demarcation_survey")}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium border border-slate-700 transition-colors"
                            >
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                              {language === "hi" ? "F-लाइन सीमा आवेदन देखें" : "View F-Line Survey Application"}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          {step.id === "act-4" && (
                            <button
                              onClick={() => onNavigateToDocument("mutation_form")}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium border border-slate-700 transition-colors"
                            >
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                              {language === "hi" ? "फॉर्म-6A म्यूटेशन ड्राफ्ट देखें" : "View Mutation Petition Draft"}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
