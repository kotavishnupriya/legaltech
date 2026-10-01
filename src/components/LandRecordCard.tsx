"use client";

import { LandRecord } from "@/types/landnyaya";
import { Language } from "@/lib/translations";
import {
  Building2,
  Clock,
  ShieldCheck,
  Landmark,
  Scale,
  FileText,
  MapPin,
  UserCheck,
  Sparkles,
  ShieldAlert,
  Compass,
  Percent,
} from "lucide-react";

interface LandRecordCardProps {
  record: LandRecord;
  onApplyRecord?: (record: LandRecord) => void;
  showApplyButton?: boolean;
  language?: Language;
}

export default function LandRecordCard({
  record,
  onApplyRecord,
  showApplyButton = true,
  language = "en",
}: LandRecordCardProps) {
  const isMutationPending = record.mutationStatus === "Pending in Form-6A";
  const isMutationRejected = record.mutationStatus === "Rejected / Stalled";

  const is22AProhibited = record.section22AFlag;
  const isEncumbered = record.encumbrance.isEncumbered;
  const hasLitigation = record.litigation.hasActiveCourtCase;
  const isBoundaryDisputed = record.boundaryAndPossession.isEncroachedOrDisputed;

  return (
    <div className="rounded-2xl bg-slate-900/95 border border-emerald-500/30 shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300">
      {/* Official Andhra Pradesh MeeBhoomi Header Ribbon */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-white shadow-inner">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {language === "hi" ? "आंध्र प्रदेश राजस्व विभाग" : "Government of Andhra Pradesh"}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-mono">
                {record.portalSource}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/20 font-bold">
                {language === "hi" ? "पासबुक: " : "Passbook: "}
                {record.pattadarPassbookNo}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono mt-0.5">
              {language === "hi"
                ? `ग्राम: ${record.village} • मंडल: ${record.mandal} • जिला: ${record.district}`
                : `Village: ${record.village} • Mandal: ${record.mandal} • District: ${record.district}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Risk Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
              record.compositeRiskScore >= 70
                ? "bg-red-500/20 text-red-300 border-red-500/40"
                : record.compositeRiskScore >= 40
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>
              {language === "hi" ? "स्कोर: " : "Score: "}
              {record.compositeRiskScore}/100
            </span>
            <span className="text-[10px] font-normal opacity-90 hidden sm:inline">
              ({record.riskCategory})
            </span>
          </div>

          {showApplyButton && onApplyRecord && (
            <button
              onClick={() => onApplyRecord(record)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Apply these Andhra Pradesh revenue details into the dispute form"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === "hi" ? "फॉर्म में भरें" : "Use in Case Analysis"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Section 22-A Prohibited Properties Banner */}
      <div
        className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          is22AProhibited
            ? "bg-red-950/60 border-red-500/50 text-red-200"
            : "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
        }`}
      >
        <div className="flex items-center gap-2">
          {is22AProhibited ? (
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse flex-shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span className="font-bold">
            {language === "hi"
              ? "धारा 22-A रजिस्ट्री एक्ट प्रतिबंध जांच (22-A Prohibited List):"
              : "AP Section 22-A Registration Act Check (సెక్షన్ 22-A నిషేధిత జాబితా):"}
          </span>
          <span className="font-semibold">
            {is22AProhibited
              ? record.section22ACategory || (language === "hi" ? "प्रतिबंधित भूमि सूची में शामिल" : "FLAGGED AS PROHIBITED PROPERTY")
              : language === "hi"
              ? "स्पष्ट (Clear - धारा 22A प्रतिबंध नहीं है)"
              : "CLEAR (No Section 22-A Prohibition)"}
          </span>
        </div>

        {is22AProhibited && (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-900/80 text-red-100 border border-red-500 animate-pulse">
            {language === "hi" ? "रजिस्ट्री कानूनन अमान्य (VOID)" : "CONVEYANCE VOID UNDER LAW"}
          </span>
        )}
      </div>

      {/* Core Land Metadata Grid */}
      <div className="p-5 space-y-5">
        {/* Section A: Identification, Location & Extent */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Survey & 1-B Khata */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {language === "hi" ? "सर्वे एवं 1-B खाता विवरण" : "Survey & 1-B Khata (భూమి గుర్తింపు)"}
            </span>
            <div className="text-base font-extrabold text-white flex items-center justify-between">
              <span>{language === "hi" ? "सर्वे नं. " : "Survey No. "}{record.surveyNumber}</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {language === "hi" ? "खाता #" : "Khata #"}{record.khataNumber}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {language === "hi" ? "पासबुक: " : "Passbook: "}{record.pattadarPassbookNo}
            </div>
          </div>

          {/* Card 2: Jurisdiction */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {language === "hi" ? "राजस्व अधिकार क्षेत्र" : "AP Revenue Jurisdiction (రెవెన్యూ పరిధి)"}
            </span>
            <div className="text-xs font-bold text-slate-200">
              {language === "hi" ? "ग्राम: " : "Village: "}{record.village}
            </div>
            <div className="text-[11px] text-slate-400">
              {language === "hi"
                ? `मंडल: ${record.mandal} • जिला: ${record.district}`
                : `Mandal: ${record.mandal} • Dist: ${record.district}`}
            </div>
          </div>

          {/* Card 3: Extent & Classification */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {language === "hi" ? "रकबा एवं वर्गीकरण" : "Extent & Classification (విస్తీర్ణం & రకం)"}
            </span>
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span className="text-sm font-extrabold text-emerald-400">{record.totalExtent}</span>
            </div>
            <div className="text-[11px] text-slate-300 truncate">
              {record.landClassification}
            </div>
          </div>
        </div>

        {/* Section B: Pattadar & Father/Husband Name */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                {language === "hi" ? "मीभूमि पट्टादार (मालिक का नाम)" : "MeeBhoomi Pattadar (పట్టాదారు పేరు)"}
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
              <span>{record.ownerName}</span>
              <span className="text-xs font-normal text-slate-400">
                ({language === "hi" ? "पिता/पति: " : "S/o / W/o: "}<span className="text-slate-200 font-semibold">{record.fatherOrHusbandName}</span>)
              </span>
            </div>
          </div>

          {/* Risk Score Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-semibold text-slate-400">
                {language === "hi" ? "टाइटल स्थिति" : "Risk Assessment"}
              </div>
              <div className="text-xs font-bold text-slate-200">{record.riskCategory}</div>
            </div>
          </div>
        </div>

        {/* Section C: 4 Statutory Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pillar 1: Form-6A Mutation */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isMutationRejected
                ? "bg-red-950/25 border-red-500/40"
                : isMutationPending
                ? "bg-amber-950/25 border-amber-500/40"
                : "bg-emerald-950/20 border-emerald-500/30"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {language === "hi" ? "1. म्यूटेशन (दाखिल-खारिज)" : "1. Mutation (మ్యుటేషన్)"}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                    isMutationRejected
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : isMutationPending
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {record.mutationDetails.status}
                </span>
              </div>
              {record.mutationDetails.tokenNo && (
                <div className="text-[10px] font-mono text-emerald-400 font-semibold pt-1">
                  Token: {record.mutationDetails.tokenNo}
                </div>
              )}
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                {record.mutationDetails.remarks}
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/60 mt-2 flex justify-between">
              <span>{language === "hi" ? "जोखिम योगदान:" : "Risk Contribution:"}</span>
              <span className="font-bold text-amber-400">{record.mutationDetails.riskScoreContribution}%</span>
            </div>
          </div>

          {/* Pillar 2: Encumbrance / EC */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isEncumbered
                ? "bg-amber-950/25 border-amber-500/40"
                : "bg-emerald-950/20 border-emerald-500/30"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {language === "hi" ? "2. भार / बंधक (EC)" : "2. Encumbrance (ఈసీ)"}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                    isEncumbered
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {isEncumbered ? "Encumbered" : "Clean (Nil)"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                SRO: {record.encumbrance.sroOffice}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                {record.encumbrance.details}
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/60 mt-2 flex justify-between">
              <span>{language === "hi" ? "जोखिम योगदान:" : "Risk Contribution:"}</span>
              <span className="font-bold text-amber-400">{record.encumbrance.riskScoreContribution}%</span>
            </div>
          </div>

          {/* Pillar 3: Court Litigation */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              hasLitigation
                ? "bg-red-950/25 border-red-500/40"
                : "bg-emerald-950/20 border-emerald-500/30"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  {language === "hi" ? "3. मुकदमे / स्टे आर्डर" : "3. Court Cases (కోర్టు కేసులు)"}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                    hasLitigation
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {hasLitigation ? "Active Litigation" : "Clean Docket"}
                </span>
              </div>
              {record.litigation.caseNumber && (
                <div className="text-[10px] font-mono text-red-400 font-semibold pt-1">
                  {record.litigation.caseNumber}
                </div>
              )}
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                {record.litigation.details}
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/60 mt-2 flex justify-between">
              <span>{language === "hi" ? "जोखिम योगदान:" : "Risk Contribution:"}</span>
              <span className="font-bold text-amber-400">{record.litigation.riskScoreContribution}%</span>
            </div>
          </div>

          {/* Pillar 4: Boundary & FMB */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between ${
              isBoundaryDisputed
                ? "bg-red-950/25 border-red-500/40"
                : "bg-emerald-950/20 border-emerald-500/30"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  {language === "hi" ? "4. सीमा एवं FMB माप" : "4. Boundaries (హద్దులు & FMB)"}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                    isBoundaryDisputed
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {isBoundaryDisputed ? "Encroachment" : "FMB Intact"}
                </span>
              </div>
              {record.boundaryAndPossession.missingCents && (
                <div className="text-[10px] font-mono text-red-400 font-semibold pt-1">
                  {language === "hi" ? "गुम रकबा: " : "Missing: "}
                  {record.boundaryAndPossession.missingCents}
                </div>
              )}
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                {record.boundaryAndPossession.details}
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/60 mt-2 flex justify-between">
              <span>{language === "hi" ? "जोखिम योगदान:" : "Risk Contribution:"}</span>
              <span className="font-bold text-amber-400">{record.boundaryAndPossession.riskScoreContribution}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
