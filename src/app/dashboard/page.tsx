"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyInputForm from "@/components/PropertyInputForm";
import RiskMeter from "@/components/RiskMeter";
import RiskBreakdownCards from "@/components/RiskBreakdownCards";
import ActionPlanRoadmap from "@/components/ActionPlanRoadmap";
import DocumentVault from "@/components/DocumentVault";
import AgentThoughtLog from "@/components/AgentThoughtLog";
import NyayaAIChat from "@/components/NyayaAIChat";
import ApiKeyModal from "@/components/ApiKeyModal";
import LandRecordCard from "@/components/LandRecordCard";
import { PropertyInput, AnalysisResult } from "@/types/landnyaya";
import { generateLocalLegalAnalysis } from "@/lib/gemini";
import { CASE_PRESETS } from "@/lib/constants";
import { generateAndDownloadPdf } from "@/lib/pdfGenerator";
import { Language, TRANSLATIONS } from "@/lib/translations";
import confetti from "canvas-confetti";
import {
  Scale,
  ShieldAlert,
  FileCheck2,
  FileDown,
  Sparkles,
  MapPin,
  AlertTriangle,
  Gavel,
  BookOpen,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
  ListOrdered,
  FileText,
  HelpCircle,
  ExternalLink,
  Landmark,
  Download,
  AlertOctagon,
  Printer,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "risk_overview" | "land_record" | "action_plan" | "documents" | "ai_chat"
  >("risk_overview");
  const [selectedDocId, setSelectedDocId] = useState<string>("legal_notice");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [lang, setLang] = useState<Language>("en");

  // Load default AP Vijayawada 142/3A scenario on mount for instant visual feedback
  useEffect(() => {
    const savedLang = (localStorage.getItem("landnyaya_lang") as Language) || "en";
    if (savedLang === "en" || savedLang === "hi") {
      setLang(savedLang);
    }

    const defaultPreset = CASE_PRESETS[0];
    const initialResult = generateLocalLegalAnalysis(defaultPreset.input);
    setAnalysisResult(initialResult);

    const savedKey = localStorage.getItem("landnyaya_gemini_api_key");
    if (savedKey) setCustomApiKey(savedKey);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("landnyaya_lang", newLang);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleAnalyze = async (input: PropertyInput) => {
    setIsLoading(true);
    setActiveTab("risk_overview");

    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyInput: input,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);

        // Confetti celebration if clean title / low risk
        if (data.data.overallScore < 30) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      } else {
        // Fallback to local heuristic engine
        const fallback = generateLocalLegalAnalysis(input);
        setAnalysisResult(fallback);
      }
    } catch (err) {
      console.warn("Analysis API fetch failed. Using statutory legal intelligence engine:", err);
      const fallback = generateLocalLegalAnalysis(input);
      setAnalysisResult(fallback);
    } finally {
      setIsLoading(false);
      // Smooth scroll to results
      const resultsEl = document.getElementById("analysis-results-section");
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleNavigateToDoc = (docId: string) => {
    setSelectedDocId(docId);
    setActiveTab("documents");
    const resultsEl = document.getElementById("analysis-results-section");
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickDownloadPdf = (docType: "mutation" | "rti" | "notice" | "demarcation") => {
    if (!analysisResult) return;
    const surveyNo = analysisResult.propertyInput.surveyNumber;
    const landRec = analysisResult.landRecord;
    const propInput = analysisResult.propertyInput;

    if (docType === "mutation") {
      generateAndDownloadPdf(analysisResult.generatedDocuments.mutationForm, surveyNo, landRec, propInput);
    } else if (docType === "rti") {
      generateAndDownloadPdf(analysisResult.generatedDocuments.rtiApplication, surveyNo, landRec, propInput);
    } else if (docType === "notice") {
      generateAndDownloadPdf(analysisResult.generatedDocuments.legalNotice, surveyNo, landRec, propInput);
    } else if (docType === "demarcation") {
      generateAndDownloadPdf(analysisResult.generatedDocuments.demarcationSurvey, surveyNo, landRec, propInput);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        language={lang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Top Banner Ribbon */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-slate-200">
              {lang === "hi" ? "आंध्र प्रदेश भूमि कानूनी AI इंजन:" : "AP Legal AI Engine:"}
            </span>
            <span className="text-slate-400">
              AP RoR Act 1971 + Section 22-A + AP Survey & Boundaries Act 1923
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="hidden sm:inline">
              {lang === "hi"
                ? "अधिकार क्षेत्र: आंध्र प्रदेश (26 जिले • మీభూమి CCLA)"
                : "Jurisdiction: Andhra Pradesh (26 Districts • మీభూమి CCLA)"}
            </span>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              {customApiKey
                ? lang === "hi"
                  ? "Gemini Key: कनेक्टेड"
                  : "Custom Gemini Key Connected"
                : lang === "hi"
                ? "कस्टम Key जोड़ें"
                : "Connect Custom Key"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Section 1: Property Identification & Input Form */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {lang === "hi"
                  ? "आंध्र प्रदेश भूमि विवाद समाधान एवं टाइटल जांच"
                  : "Andhra Pradesh Land Title & Dispute Resolution Engine"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {lang === "hi"
                  ? "सर्वे नंबर और जिला दर्ज करें। मीभूमि अडंगल, ROR 1-B खाता, धारा 22-A प्रतिबंधित सूची और FMB सीमा माप का तुरंत विश्लेषण करें।"
                  : "Synthesize Survey numbers, MeeBhoomi Adangal, ROR 1-B Khata, Section 22-A prohibited properties, and FMB boundary demarcations."}
              </p>
            </div>
          </div>

          {/* Judge & Evaluator Instant 1-Click Demo Bar */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border-2 border-amber-500/40 p-4 sm:p-5 shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Zap className="w-4 h-4 fill-amber-400" />
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {lang === "hi"
                    ? "⚡ जजों एवं परीक्षकों के लिए 1-क्लिक टेस्ट मोड (Instant Judge Demo)"
                    : "⚡ 1-Click Demo Mode for Judges & Evaluators (< 3s Evaluation)"}
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {lang === "hi" ? "बिना टाइप किए तुरंत जांचें" : "Zero-Typing Instant Audit"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CASE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    handleAnalyze(preset.input);
                  }}
                  className="p-3 rounded-xl bg-slate-950/90 border border-slate-750 hover:border-amber-400 hover:bg-slate-900 transition-all text-left flex flex-col justify-between group shadow-sm hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {preset.input.surveyNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate font-medium">
                      {preset.input.district}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                    <span>{lang === "hi" ? "तुरंत चलाएं ➔" : "Run Demo ➔"}</span>
                    <span className="text-slate-400 font-normal">({preset.badge})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <PropertyInputForm
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            language={lang}
          />
        </section>

        {/* Section 2: Results & Synthesis */}
        {analysisResult && (
          <section id="analysis-results-section" className="space-y-8 pt-4">
            {/* Agent Thought Trace */}
            <AgentThoughtLog
              thoughtSteps={analysisResult.thoughtSteps}
              isLiveAnalyzing={isLoading}
              language={lang}
            />

            {/* Overall Score Header Card - Big Color-Coded Risk Score */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Background Glow */}
              <div
                className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20 ${
                  analysisResult.overallScore >= 70
                    ? "bg-red-500"
                    : analysisResult.overallScore >= 30
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Big Color-Coded Risk Gauge (Left) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center">
                  <RiskMeter
                    score={analysisResult.overallScore}
                    riskLevel={analysisResult.riskLevel}
                    size={220}
                  />
                </div>

                {/* Summary & Key Findings (Right) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-slate-200">
                      Survey: {analysisResult.propertyInput.surveyNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300">
                      {analysisResult.propertyInput.village ? `${analysisResult.propertyInput.village}, ` : ""}
                      {analysisResult.propertyInput.mandal || analysisResult.propertyInput.taluka ? `${analysisResult.propertyInput.mandal || analysisResult.propertyInput.taluka}, ` : ""}
                      {analysisResult.propertyInput.district}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold">
                      {analysisResult.propertyInput.propertyType}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      {t.resultsTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      {analysisResult.executiveSummary}
                    </p>
                  </div>

                  {/* Parties & Reference */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <div>
                      <span className="text-slate-400">{lang === "hi" ? "आवेदक: " : "Applicant: "}</span>
                      <span className="font-semibold text-slate-200">
                        {analysisResult.propertyInput.applicantName}
                      </span>
                    </div>
                    {analysisResult.propertyInput.opponentName && (
                      <div>
                        <span className="text-slate-400">{lang === "hi" ? "विरोधी पक्ष: " : "Opponent: "}</span>
                        <span className="font-semibold text-amber-300">
                          {analysisResult.propertyInput.opponentName}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400">Ref: </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {analysisResult.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant 1-Click PDF Downloads Ribbon */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-400" />
                    {t.downloadHeading}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang === "hi" ? "तुरंत PDF डाउनलोड करें" : "Click any button to download ready draft"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handleQuickDownloadPdf("mutation")}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-sm group"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400 group-hover:animate-bounce" />
                    <span>{t.btnDownloadMutation}</span>
                  </button>

                  <button
                    onClick={() => handleQuickDownloadPdf("rti")}
                    className="px-3.5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-sm group"
                  >
                    <FileDown className="w-4 h-4 text-cyan-400 group-hover:animate-bounce" />
                    <span>{t.btnDownloadRti}</span>
                  </button>

                  <button
                    onClick={() => handleQuickDownloadPdf("notice")}
                    className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-sm group"
                  >
                    <FileDown className="w-4 h-4 text-amber-400 group-hover:animate-bounce" />
                    <span>{t.btnDownloadNotice}</span>
                  </button>

                  <button
                    onClick={() => handleQuickDownloadPdf("demarcation")}
                    className="px-3.5 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-sm group"
                  >
                    <FileDown className="w-4 h-4 text-purple-400 group-hover:animate-bounce" />
                    <span>{t.btnDownloadDemarcation}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Clear Explanation of Problems Found */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    {t.problemsFoundHeading}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t.problemsFoundDesc}
                  </p>
                </div>
              </div>

              {/* Critical Flags List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.criticalFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200">{flag.title}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          flag.severity === "critical"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{flag.impact}</p>
                    <div className="text-[11px] text-emerald-400 font-mono pt-1">
                      {lang === "hi" ? "कानूनी धारा: " : "Citation: "} {flag.actCitation}
                    </div>
                    <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <strong className="text-slate-200">{lang === "hi" ? "उपाय: " : "Solution: "}</strong>
                      {flag.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Pillar Statutory Risk Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-400" />
                  {lang === "hi"
                    ? "4 मुख्य कानूनी आधारों का स्कोर विवरण"
                    : "4-Pillar Statutory Risk Breakdown"}
                </h3>
                <span className="text-xs text-slate-400">
                  {lang === "hi"
                    ? "रेवेन्यू और दीवानी कानून का संयुक्त विश्लेषण"
                    : "Weighted Synthesis across Revenue & Civil Law"}
                </span>
              </div>

              <RiskBreakdownCards breakdown={analysisResult.breakdown} language={lang} />
            </div>

            {/* Results Navigation Tabs (Roadmap, MeeBhoomi Record, Document Vault, AI Chat) */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setActiveTab("risk_overview")}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === "risk_overview"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{lang === "hi" ? "जोखिम समीक्षा" : "Risk Overview"}</span>
                </button>

                <button
                  onClick={() => setActiveTab("land_record")}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === "land_record"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span>{lang === "hi" ? "मीभूमि 1-B व अडंगल रिकॉर्ड" : "MeeBhoomi 1-B & Adangal"}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-amber-300 font-mono">
                    మీభూమి
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("action_plan")}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === "action_plan"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                  <span>{lang === "hi" ? "अगले कदम (Action Plan)" : "Next Action Roadmap"}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-emerald-400">
                    3 Phases
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === "documents"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <FileDown className="w-4 h-4" />
                  <span>{lang === "hi" ? "कानूनी ड्राफ्ट्स (PDF)" : "Legal Drafts Vault"}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 font-mono">
                    4 PDFs
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("ai_chat")}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === "ai_chat"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === "hi" ? "AI वकील से बातचीत" : "Nyaya AI Legal Copilot"}</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div>
                {activeTab === "risk_overview" && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {lang === "hi"
                            ? `सर्वे नंबर ${analysisResult.propertyInput.surveyNumber} के लिए रणनीतिक सलाह`
                            : `Strategic Recommendation for Survey No. ${analysisResult.propertyInput.surveyNumber}`}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {lang === "hi"
                            ? "लिमिटेशन एक्ट की समयसीमा सुरक्षित रखने हेतु 48 घंटों में आवश्यक नोटिस जारी करें।"
                            : "Execute immediate statutory notices within 48 hours to preserve limitation timelines under Article 58/65."}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => setActiveTab("land_record")}
                          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <Landmark className="w-3.5 h-3.5 text-amber-400" />
                          <span>{lang === "hi" ? "मीभूमि रिकॉर्ड देखें" : "View MeeBhoomi Record"}</span>
                        </button>
                        <button
                          onClick={() => handleNavigateToDoc("legal_notice")}
                          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>{lang === "hi" ? "वकील नोटिस डाउनलोड करें" : "Download Legal Notice"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "land_record" && analysisResult.landRecord && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-amber-400" />
                        {lang === "hi"
                          ? `सर्वे नंबर ${analysisResult.landRecord.surveyNumber} का आधिकारिक मीभूमि रिकॉर्ड`
                          : `Official State Revenue Extract for Survey No. ${analysisResult.landRecord.surveyNumber}`}
                      </h4>
                      <span className="text-xs text-slate-400">
                        Portal: {analysisResult.landRecord.portalSource}
                      </span>
                    </div>
                    <LandRecordCard
                      record={analysisResult.landRecord}
                      showApplyButton={false}
                      language={lang}
                    />
                  </div>
                )}

                {activeTab === "action_plan" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <ListOrdered className="w-5 h-5 text-emerald-400" />
                          {t.nextStepsHeading}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {t.nextStepsDesc}
                        </p>
                      </div>
                    </div>
                    <ActionPlanRoadmap
                      actionPlan={analysisResult.actionPlan}
                      onNavigateToDocument={handleNavigateToDoc}
                      language={lang}
                    />
                  </div>
                )}

                {activeTab === "documents" && (
                  <DocumentVault
                    documents={analysisResult.generatedDocuments}
                    surveyNumber={analysisResult.propertyInput.surveyNumber}
                    landRecord={analysisResult.landRecord}
                    propertyInput={analysisResult.propertyInput}
                    activeDocId={selectedDocId}
                    onSelectDocId={(id) => setSelectedDocId(id)}
                    language={lang}
                  />
                )}

                {activeTab === "ai_chat" && (
                  <NyayaAIChat
                    analysisResult={analysisResult}
                    customApiKey={customApiKey}
                  />
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(key) => setCustomApiKey(key)}
      />
    </div>
  );
}
