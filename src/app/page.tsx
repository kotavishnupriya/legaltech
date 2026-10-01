"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RiskMeter from "@/components/RiskMeter";
import ApiKeyModal from "@/components/ApiKeyModal";
import { CASE_PRESETS, AP_LEGAL_TERMS_GLOSSARY } from "@/lib/constants";
import { Language, TRANSLATIONS } from "@/lib/translations";
import {
  Scale,
  ShieldAlert,
  FileCheck2,
  FileDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  Gavel,
  Compass,
  Building,
  FileText,
  Clock,
  Landmark,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Zap,
  BookOpen,
  MapPin,
  AlertOctagon,
  FileSearch,
} from "lucide-react";

export default function LandingPage() {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("landnyaya_lang") as Language;
    if (savedLang === "en" || savedLang === "hi") {
      setLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("landnyaya_lang", newLang);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const faqs = [
    {
      q:
        lang === "hi"
          ? "LandNyaya क्या है और यह आंध्र प्रदेश में भूमि विवादों को कैसे हल करता है?"
          : "What is LandNyaya and how does it resolve Andhra Pradesh land disputes?",
      a:
        lang === "hi"
          ? "LandNyaya एक AI आधारित कानूनी प्रणाली है जो आंध्र प्रदेश भूमि कानूनों के लिए बनाई गई है। आप अपना सर्वे नंबर, मंडल और जिला दर्ज करते हैं (या मीभूमि अडंगल / 1-B / सेल डीड अपलोड करते हैं)। AI तुरंत मीभूमि रिकॉर्ड, धारा 22-A प्रतिबंधित सूची, FMB सीमाओं और कोर्ट केस की जांच करके 0-100 का कलर-कोडेड रिस्क स्कोर और तहसीलदार/कोर्ट के लिए तैयार कानूनी PDF आवेदन तैयार करता है।"
          : "LandNyaya is an AI legal intelligence system built specifically for Andhra Pradesh Land and Revenue Laws. Enter your Survey Number, Mandal, and District (or upload a MeeBhoomi Adangal, ROR 1-B Khata, or Sale Deed). The AI agent reasons through the AP Rights in Land & Pattadar Pass Books Act 1971, screens Section 22-A Prohibited Property lists, evaluates FMB boundary markers, calculates a 0-100 statutory risk score, and generates ready-to-file legal drafts in PDF format.",
    },
    {
      q:
        lang === "hi"
          ? "धारा 22-A (Section 22-A) प्रतिबंधित भूमि की जांच कैसे काम करती है?"
          : "How does the Section 22-A Prohibited Properties check work?",
      a:
        lang === "hi"
          ? "यह रजिस्ट्री एक्ट 1908 की धारा 22-A के तहत 4 श्रेणियों की जांच करता है: (1) सरकारी पोरम्बोक भूमि, (2) देवस्थानम ट्रस्ट / मंदिर भूमि, (3) वक्फ बोर्ड संपत्ति, और (4) असाइन्ड डी-पट्टा भूमि (POT Act 1977)। यदि जमीन प्रतिबंधित है, तो रजिस्ट्री कानूनन अमान्य होती है। LandNyaya आपको आरटीआई द्वारा 1954 RSR निकालने और डी-नोटिफिकेशन का कानूनी रास्ता देता है।"
          : "The agent cross-checks your property against the statutory categories under Section 22-A of the Registration Act, 1908 (AP Amendment): Government Poramboke, Endowment Temple properties, Waqf Board lands, and Assigned D-Patta lands (POT Act 1977). It flags registration bars and provides statutory de-notification roadmaps.",
    },
    {
      q:
        lang === "hi"
          ? "कौन-कौन से कानूनी दस्तावेज (PDF) तुरंत डाउनलोड किए जा सकते हैं?"
          : "Which ready-to-download legal documents are generated as PDF?",
      a:
        lang === "hi"
          ? "आप 1-क्लिक में 4 तैयार कानूनी दस्तावेज PDF में डाउनलोड कर सकते हैं: (1) फॉर्म-6A मीभूमि म्यूटेशन आवेदन, (2) धारा 9 और 10 AP सर्वे एक्ट के तहत तत्काल F-लाइन डिमार्केशन अर्जी, (3) सीमा पर अतिक्रमण और मेड़ तोड़े जाने पर 15-दिवसीय वकील कानूनी नोटिस, और (4) 1954 RSR व 1-B रिकॉर्ड प्राप्त करने हेतु RTI फॉर्म A आवेदन।"
          : "The platform generates 4 formatted, statutory drafts ready to download: (1) Form-6A MeeBhoomi ROR Mutation Application under Section 5 AP RoR Act 1971; (2) Statutory Tatkal F-Line Survey Demarcation Petition under Sections 9 & 10 AP Survey & Boundaries Act 1923; (3) 15-Day Advocate Cease-and-Desist Notice for boundary encroachment; and (4) RTI Act 2005 Form A Application for certified 1954 RSR and 1-B Khata extracts.",
    },
    {
      q:
        lang === "hi"
          ? "यदि तहसीलदार 30 दिनों में म्यूटेशन (दाखिल-खारिज) न करे तो क्या उपाय है?"
          : "What remedy is available if the Tahsildar delays Form-6A mutation beyond 30 days?",
      a:
        lang === "hi"
          ? "AP Rights in Land and Pattadar Pass Books Act, 1971 की धारा 5 के तहत तहसीलदार को 30 दिनों में म्यूटेशन का निस्तारण करना अनिवार्य है। देरी या अस्वीकृति होने पर LandNyaya धारा 5-B के तहत रेवेन्यू डिविजनल ऑफिसर (RDO) के समक्ष 60 दिनों के भीतर वैधानिक अपील का पूरा ड्राफ्ट तैयार करता है।"
          : "Under Section 5(1) & (3) of the AP Rights in Land and Pattadar Pass Books Act 1971, the Tahsildar is mandated to dispose of mutation applications within 30 days. If delayed or rejected, LandNyaya generates the procedural draft to file a Statutory Appeal before the Revenue Divisional Officer (RDO) under Section 5-B within 60 days.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        language={lang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800/80">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Language Switcher Ribbon + Pill Badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.heroPill}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                {/* Inline Lang Switcher */}
                <div className="inline-flex items-center bg-slate-900 border border-slate-750 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`px-2.5 py-0.5 rounded transition-all ${
                      lang === "en"
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange("hi")}
                    className={`px-2.5 py-0.5 rounded transition-all ${
                      lang === "hi"
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                {t.heroTitle1}{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  {t.heroTitleGradient}
                </span>{" "}
                {t.heroTitle2}
              </h1>

              {/* Simple Human-Friendly Subheadline */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{t.heroCtaPrimary}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-750 hover:border-slate-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>{t.heroCtaSecondary}</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {t.statScore}
                  </div>
                  <div className="text-xs text-slate-400">{t.statScoreLabel}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                    {t.stat22A}
                  </div>
                  <div className="text-xs text-slate-400">{t.stat22ALabel}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                    {t.statDrafts}
                  </div>
                  <div className="text-xs text-slate-400">{t.statDraftsLabel}</div>
                </div>
              </div>
            </div>

            {/* Right Live Interactive Demo Widget */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750 p-6 sm:p-7 shadow-2xl shadow-emerald-950/40">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Scale className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {t.demoTitle}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {t.demoSubtitle}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
                    {t.demoEncroachment}
                  </span>
                </div>

                {/* Big Color-Coded Risk Meter Visual */}
                <div className="py-2">
                  <RiskMeter score={74} riskLevel="HIGH RISK (Clouded Title)" size={200} />
                </div>

                {/* 4 Vector Micro Summary */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">MeeBhoomi 1-B</span>
                    <span className="text-emerald-400 font-bold">{t.demoKhata}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Section 22-A</span>
                    <span className="text-emerald-400 font-bold">{t.demoSec22A}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Litigation</span>
                    <span className="text-slate-200 font-bold">{t.demoStay}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">FMB Boundary</span>
                    <span className="text-red-400 font-bold">{t.demoBund}</span>
                  </div>
                </div>

                {/* Generated Document Pills */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                    {t.demoDraftsReady}
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    {t.demoLaunchCase} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Simple 3-Step Process */}
      <section id="how-it-works" className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.stepsHeading}
            </h2>
            <p className="text-sm text-slate-400">
              {t.stepsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{t.step1Title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{t.step2Title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <FileDown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{t.step3Title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: 4 AP Core Case Presets */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.scenariosHeading}
          </h2>
          <p className="text-sm text-slate-400">
            {t.scenariosSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CASE_PRESETS.map((preset) => (
            <Link
              key={preset.id}
              href="/dashboard"
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                <span className="inline-block text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {preset.badge}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {preset.shortSummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>{t.scenarioTestCta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section: 4-Pillar Statutory Architecture */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.pillarsHeading}
            </h2>
            <p className="text-sm text-slate-400">
              {t.pillarsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{t.pillar1Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.pillar1Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{t.pillar2Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.pillar2Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Gavel className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{t.pillar3Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.pillar3Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{t.pillar4Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.pillar4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Andhra Pradesh Revenue Glossary */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            {t.glossaryHeading}
          </h2>
          <p className="text-sm text-slate-400">
            {t.glossarySubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AP_LEGAL_TERMS_GLOSSARY.map((g, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-emerald-300 font-mono">
                  {g.term}
                </h3>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                  {g.context}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {g.meaning}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-900/50 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.faqHeading}
            </h2>
            <p className="text-sm text-slate-400">
              {t.faqSubheading}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-sm font-bold text-white hover:text-emerald-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}
