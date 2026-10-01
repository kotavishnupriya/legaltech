"use client";

import { useState } from "react";
import { LegalDocumentArtifact, LandRecord, PropertyInput } from "@/types/landnyaya";
import { generateAndDownloadPdf } from "@/lib/pdfGenerator";
import { Language, TRANSLATIONS } from "@/lib/translations";
import {
  FileDown,
  Copy,
  Check,
  Edit3,
  Printer,
  ShieldCheck,
  Paperclip,
  CheckCircle2,
} from "lucide-react";

interface DocumentVaultProps {
  documents: {
    mutationForm: LegalDocumentArtifact;
    rtiApplication: LegalDocumentArtifact;
    legalNotice: LegalDocumentArtifact;
    demarcationSurvey: LegalDocumentArtifact;
  };
  surveyNumber: string;
  landRecord?: LandRecord;
  propertyInput?: PropertyInput;
  activeDocId?: string;
  onSelectDocId?: (id: string) => void;
  language?: Language;
}

export default function DocumentVault({
  documents,
  surveyNumber,
  landRecord,
  propertyInput,
  activeDocId = "legal_notice",
  onSelectDocId,
  language = "en",
}: DocumentVaultProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedTab, setSelectedTab] = useState<string>(activeDocId);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTexts, setEditableTexts] = useState<Record<string, string>>({
    legal_notice: documents.legalNotice.content,
    mutation_form: documents.mutationForm.content,
    rti_application: documents.rtiApplication.content,
    demarcation_survey: documents.demarcationSurvey.content,
  });

  const tabOptions = [
    {
      id: "demarcation_survey",
      title: language === "hi" ? "F-लाइन डिमार्केशन आवेदन" : "F-Line Demarcation Petition",
      subtitleTelugu: "ఎఫ్-లైన్ సర్వే దరఖాస్తు",
      tag: "AP Survey Act 1923",
      artifact: documents.demarcationSurvey,
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "mutation_form",
      title: language === "hi" ? "फॉर्म-6A मीभूमि म्यूटेशन" : "Form-6A MeeBhoomi Mutation",
      subtitleTelugu: "ఫారం-6A మ్యుటేషన్ & 1-B ఖాతా",
      tag: "AP RoR Act 1971",
      artifact: documents.mutationForm,
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: "legal_notice",
      title: language === "hi" ? "15-दिवसीय वकील कानूनी नोटिस" : "15-Day Advocate Notice",
      subtitleTelugu: "హద్దుల ఆక్రమణ లీగల్ నోటీసు",
      tag: "Cease & Desist",
      artifact: documents.legalNotice,
      color: "from-amber-500 to-red-600",
    },
    {
      id: "rti_application",
      title: language === "hi" ? "RTI फॉर्म A (1954 RSR व 1-B)" : "RTI Form A (RSR & 1-B Records)",
      subtitleTelugu: "సమాచార హక్కు దరఖాస్తు",
      tag: "RTI Act 2005",
      artifact: documents.rtiApplication,
      color: "from-blue-500 to-cyan-600",
    },
  ];

  const currentTab = tabOptions.find((t) => t.id === selectedTab) || tabOptions[0];
  const currentContent = editableTexts[currentTab.id] || currentTab.artifact.content;

  const handleTabChange = (id: string) => {
    setSelectedTab(id);
    setIsEditing(false);
    if (onSelectDocId) onSelectDocId(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const customizedArtifact: LegalDocumentArtifact = {
      ...currentTab.artifact,
      content: currentContent,
    };
    generateAndDownloadPdf(customizedArtifact, surveyNumber, landRecord, propertyInput);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${currentTab.artifact.title} - Survey No ${surveyNumber}</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #111; }
              h1 { font-size: 16pt; text-align: center; margin-bottom: 4px; }
              h2 { font-size: 12pt; text-align: center; font-style: italic; color: #555; margin-top: 0; }
              .meta { border: 1px solid #ccc; padding: 10px; margin: 20px 0; background: #f9f9f9; font-size: 10pt; }
              pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 11pt; }
            </style>
          </head>
          <body>
            <h1>${currentTab.artifact.title}</h1>
            <h2>${currentTab.artifact.subtitle}</h2>
            <div class="meta">
              <strong>Reference No:</strong> ${currentTab.artifact.referenceNumber} | 
              <strong>Date:</strong> ${currentTab.artifact.dateGenerated} | 
              <strong>Survey No:</strong> ${surveyNumber}
            </div>
            <pre>${currentContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {tabOptions.map((tab) => {
          const isActive = tab.id === selectedTab;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? "bg-slate-850 border-emerald-500/50 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.tag}
                </span>
                {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <span className={`text-xs font-bold block ${isActive ? "text-white" : "text-slate-300"}`}>
                  {tab.title}
                </span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                  {tab.subtitleTelugu}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Document View & Toolbar */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        {/* Top Control Header */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {currentTab.artifact.referenceNumber}
              </span>
              <span className="text-xs text-slate-400">
                • {language === "hi" ? "जमा करने हेतु तैयार" : "Ready for Filing"}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {currentTab.artifact.title}
            </h3>
            <p className="text-xs text-slate-400 italic">{currentTab.artifact.subtitle}</p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isEditing
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
              }`}
              title="Edit document text"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? (language === "hi" ? "संपादन पूर्ण" : "Done Editing") : t.vaultBtnEdit}</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t.vaultBtnCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.vaultBtnCopy}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors hidden sm:flex"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.vaultBtnPrint}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <FileDown className="w-4 h-4 fill-slate-950" />
              <span>{t.vaultBtnDownloadPdf}</span>
            </button>
          </div>
        </div>

        {/* Filing Instructions banner */}
        <div className="bg-slate-950/40 px-5 py-3 border-b border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-200">
              {language === "hi" ? "जमा करने के निर्देश: " : "Filing Instructions: "}
            </span>
            <span className="text-slate-400">{currentTab.artifact.instructionsForFiling}</span>
          </div>
        </div>

        {/* Main Document Parchment Container */}
        <div className="p-4 sm:p-8 bg-slate-950/60 overflow-x-auto">
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-750 rounded-xl p-6 sm:p-10 shadow-2xl relative font-serif text-slate-200">
            {/* Watermark effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-6xl font-bold text-white uppercase transform -rotate-12">
              LandNyaya Draft
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-slate-700 pb-4 mb-6 text-center space-y-1">
              <div className="text-[11px] font-sans font-bold tracking-widest uppercase text-emerald-400">
                LandNyaya Legal Tech • Certified Dispute Draft
              </div>
              <h2 className="text-base sm:text-xl font-bold text-slate-100 tracking-wide uppercase">
                {currentTab.artifact.title}
              </h2>
              <p className="text-xs text-slate-400 italic">{currentTab.artifact.subtitle}</p>
            </div>

            {/* Recipient & Metadata Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 mb-6 font-sans text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  {t.vaultAuthorityBlockTitle}:
                </span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">
                  {currentTab.artifact.authorityOrRecipient}
                </p>
              </div>
              <div className="space-y-1.5 sm:text-right">
                <div>
                  <span className="text-slate-400">{language === "hi" ? "संदर्भ सं: " : "Ref No: "}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {currentTab.artifact.referenceNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">{language === "hi" ? "दिनांक: " : "Date of Draft: "}</span>
                  <span className="text-slate-200">{currentTab.artifact.dateGenerated}</span>
                </div>
                <div>
                  <span className="text-slate-400">{language === "hi" ? "अधिनियम: " : "Governing Act: "}</span>
                  <span className="text-slate-300 font-medium">
                    {currentTab.artifact.statutoryAct}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable or Static Content Display */}
            {isEditing ? (
              <div className="space-y-2">
                <span className="text-xs font-sans text-amber-400 font-semibold flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  {language === "hi"
                    ? "लाइव संपादन मोड: डाउनलोड करने से पहले टेक्स्ट में आवश्यक बदलाव करें"
                    : "Live Edit Mode: Modify clauses below before downloading"}
                </span>
                <textarea
                  rows={20}
                  value={currentContent}
                  onChange={(e) =>
                    setEditableTexts({
                      ...editableTexts,
                      [currentTab.id]: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 text-slate-200 p-4 rounded-lg border border-amber-500/40 focus:border-amber-400 focus:outline-none font-serif text-sm leading-relaxed"
                />
              </div>
            ) : (
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-serif">
                {currentContent}
              </div>
            )}

            {/* Enclosures / Attachments Checklist */}
            <div className="mt-8 pt-6 border-t border-slate-800 font-sans text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
                {t.vaultEnclosuresTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentTab.artifact.requiredAttachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/80 text-slate-300"
                  >
                    <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-[11px]">{att}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
