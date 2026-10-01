"use client";

import { RiskAssessmentBreakdown } from "@/types/landnyaya";
import { Language } from "@/lib/translations";
import {
  FileCheck,
  Building,
  Gavel,
  Compass,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Info,
} from "lucide-react";

interface RiskBreakdownCardsProps {
  breakdown: RiskAssessmentBreakdown;
  language?: Language;
}

export default function RiskBreakdownCards({ breakdown, language = "en" }: RiskBreakdownCardsProps) {
  const cards = [
    {
      id: "mutationStatus",
      title: language === "hi" ? "1. म्यूटेशन एवं ROR 1-B खाता" : "1. Mutation Status (1-B Khata)",
      weight: language === "hi" ? "25% भारांक" : "25% Weight",
      icon: FileCheck,
      data: breakdown.mutationStatus,
      description:
        language === "hi"
          ? "मीभूमि 1-B खाता, फॉर्म-6A ई-पासबुक स्थिति और राजस्व आपत्तियों का सत्यापन।"
          : "Verification of Record of Rights (RoR 1-B), Form-6A passbook status, and revenue objections.",
    },
    {
      id: "encumbrance",
      title: language === "hi" ? "2. भार, बंधक एवं धारा 22-A" : "2. Encumbrance & Sec 22-A",
      weight: language === "hi" ? "30% भारांक" : "30% Weight",
      icon: Building,
      data: breakdown.encumbrance,
      description:
        language === "hi"
          ? "सब-रजिस्ट्रार 30-वर्षीय भार प्रमाणपत्र (EC), बैंक बंधक, एवं धारा 22A प्रतिबंध जांच।"
          : "Sub-Registrar 30-year search, bank mortgages, and Section 22-A prohibited property check.",
    },
    {
      id: "pendingCourtCases",
      title: language === "hi" ? "3. दीवानी मुकदमे एवं स्टे आर्डर" : "3. Court Cases & Injunctions",
      weight: language === "hi" ? "25% भारांक" : "25% Weight",
      icon: Gavel,
      data: breakdown.pendingCourtCases,
      description:
        language === "hi"
          ? "दीवानी कोर्ट मुकदमे, लिस पेंडेंस धारा 52, निषेधाज्ञा और RDO के समक्ष धारा 5-B अपील।"
          : "Civil court suits, interim stay orders, injunctions, and Lis Pendens under Section 52 TPA.",
    },
    {
      id: "boundaryInheritance",
      title: language === "hi" ? "4. FMB सीमा माप एवं मेड़ विवाद" : "4. Boundary & FMB Demarcation",
      weight: language === "hi" ? "20% भारांक" : "20% Weight",
      icon: Compass,
      data: breakdown.boundaryInheritance,
      description:
        language === "hi"
          ? "FMB टिप्पन सीमा पत्थर, तोड़ी गई मेड़ (వరవ గట్టు), और पड़ोसी द्वारा अतिक्रमण की जांच।"
          : "Physical encroachment, missing F-Line/FMB survey markers, and neighbor boundary disputes.",
    },
  ];

  const getStatusBadge = (status: string, score: number) => {
    if (score >= 75 || status === "CRITICAL") {
      return {
        bg: "bg-red-500/15 text-red-400 border-red-500/30",
        bar: "bg-red-500",
        icon: AlertCircle,
        label: language === "hi" ? "अति जोखिम (Critical)" : "Critical Risk",
      };
    }
    if (score >= 50 || status === "DISPUTED") {
      return {
        bg: "bg-orange-500/15 text-orange-400 border-orange-500/30",
        bar: "bg-orange-500",
        icon: AlertCircle,
        label: language === "hi" ? "विवादित / उच्च (High)" : "Disputed / High",
      };
    }
    if (score >= 25 || status === "PENDING") {
      return {
        bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        bar: "bg-amber-500",
        icon: HelpCircle,
        label: language === "hi" ? "समीक्षाधीन (Review)" : "Pending Review",
      };
    }
    return {
      bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      bar: "bg-emerald-500",
      icon: CheckCircle2,
      label: language === "hi" ? "सत्यापित / स्पष्ट (Clear)" : "Clear / Verified",
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card) => {
        const style = getStatusBadge(card.data.status, card.data.score);
        const IconComponent = card.icon;
        const StatusIcon = style.icon;

        return (
          <div
            key={card.id}
            className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition-all duration-200 shadow-md relative overflow-hidden group"
          >
            {/* Top Indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${style.bar}`} />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">{card.title}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{card.weight}</span>
                </div>
              </div>

              {/* Status Pill */}
              <div className={`px-2.5 py-1 rounded-md border text-xs font-semibold flex items-center gap-1.5 ${style.bg}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{style.label}</span>
              </div>
            </div>

            {/* Progress Meter */}
            <div className="space-y-1.5 mb-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {language === "hi" ? "जोखिम स्कोर योगदान" : "Factor Risk Contribution"}
                </span>
                <span className="font-mono font-bold text-slate-200">{card.data.score} / 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${style.bar}`}
                  style={{ width: `${card.data.score}%` }}
                />
              </div>
            </div>

            {/* Key Finding */}
            <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/80 space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {card.data.keyFinding}
              </p>

              {/* Legal Basis Citation */}
              <div className="pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-[11px] text-slate-400">
                <Info className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="font-mono text-slate-300">{card.data.legalBasis}</span>
              </div>
            </div>

            {/* Extended Details */}
            <p className="text-[11px] text-slate-400 leading-relaxed mt-3 italic">
              {card.data.details}
            </p>
          </div>
        );
      })}
    </div>
  );
}
