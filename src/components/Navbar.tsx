"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, ShieldAlert, Sparkles, Key, Globe, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Language, TRANSLATIONS } from "@/lib/translations";

interface NavbarProps {
  onOpenApiKeyModal?: () => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export default function Navbar({
  onOpenApiKeyModal,
  language = "en",
  onLanguageChange,
}: NavbarProps) {
  const pathname = usePathname();
  const [hasApiKey, setHasApiKey] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(language);

  useEffect(() => {
    const savedLang = (localStorage.getItem("landnyaya_lang") as Language) || language;
    if (savedLang) {
      setCurrentLang(savedLang);
      if (onLanguageChange && savedLang !== language) {
        onLanguageChange(savedLang);
      }
    }

    const key = localStorage.getItem("landnyaya_gemini_api_key");
    if (key) {
      setHasApiKey(true);
    }
  }, []);

  const handleToggleLang = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem("landnyaya_lang", lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-emerald-400 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                {t.appName}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                AP MeeBhoomi AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium -mt-0.5 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-slate-800/70 text-emerald-400"
                : "hover:text-white hover:bg-slate-850"
            }`}
          >
            {t.navOverview}
          </Link>
          <Link
            href="/dashboard"
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname === "/dashboard"
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            {t.navDashboard}
          </Link>
        </nav>

        {/* Right Actions: Language Switcher + Key + Launch Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hindi / English Language Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-750 p-0.5 rounded-lg text-xs font-semibold shadow-inner">
            <button
              onClick={() => handleToggleLang("en")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currentLang === "en"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => handleToggleLang("hi")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currentLang === "hi"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="हिंदी में देखें"
            >
              हिन्दी
            </button>
          </div>

          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              title="Configure Custom Gemini API Key"
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                hasApiKey
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                  : "border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">
                {hasApiKey ? "Gemini Key: Active" : t.navApiKey}
              </span>
            </button>
          )}

          <Link
            href="/dashboard"
            className="px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:shadow-emerald-500/30 hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{t.navLaunchAgent}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5 hidden sm:inline" />
          </Link>
        </div>
      </div>
    </header>
  );
}
