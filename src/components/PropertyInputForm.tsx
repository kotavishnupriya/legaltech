"use client";

import { useState, useMemo } from "react";
import { PropertyInput, PropertyType, DisputeType, CasePreset, LandRecord } from "@/types/landnyaya";
import { ANDHRA_PRADESH_DISTRICTS, CASE_PRESETS } from "@/lib/constants";
import { fetchAPLandRecord, SAMPLE_SURVEY_NUMBERS } from "@/lib/mockLandRecords";
import LandRecordCard from "@/components/LandRecordCard";
import VoiceInputButton from "@/components/VoiceInputButton";
import { Language, TRANSLATIONS } from "@/lib/translations";
import {
  Search,
  UploadCloud,
  FileText,
  Sparkles,
  MapPin,
  User,
  Zap,
  Landmark,
  Layers,
  ChevronDown,
  ChevronUp,
  FileUp,
  Check,
  Volume2,
} from "lucide-react";

interface PropertyInputFormProps {
  onSubmit: (input: PropertyInput) => void;
  isLoading: boolean;
  initialInput?: PropertyInput;
  language?: Language;
}

export default function PropertyInputForm({
  onSubmit,
  isLoading,
  language = "en",
}: PropertyInputFormProps) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedState, setSelectedState] = useState<string>("Andhra Pradesh");
  const [district, setDistrict] = useState<string>("NTR (Vijayawada)");
  const [surveyNumber, setSurveyNumber] = useState<string>("142/3A");
  const [mandal, setMandal] = useState<string>("Vijayawada Rural");
  const [village, setVillage] = useState<string>("Nunna");
  const [propertyType, setPropertyType] = useState<PropertyType>("Agricultural (మెట్ట / మాగాణి వ్యవసాయ భూమి)");
  const [disputeType, setDisputeType] = useState<DisputeType>("boundary_encroachment");
  const [applicantName, setApplicantName] = useState<string>("Venkata Satyanarayana Rao");
  const [opponentName, setOpponentName] = useState<string>("Adjacent Landowner (Encroacher)");
  const [disputeDescription, setDisputeDescription] = useState<string>(
    "Owner of 2.50 Acres in Survey No. 142/3A, Nunna village, Vijayawada Rural. Adjacent owner demolished the common field bund (Gattu) and encroached 15 cents. FMB tippon coordinates mismatch. Demanding Tatkal F-Line Survey Demarcation under AP Survey & Boundaries Act 1923 and 15-Day Advocate Legal Notice."
  );

  const [showRecordPreview, setShowRecordPreview] = useState<boolean>(true);

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
    textPreview: string;
  } | null>({
    name: "MeeBhoomi_Adangal_Sy142_3A_Nunna.pdf",
    size: 1840000,
    type: "application/pdf",
    textPreview:
      "AP MeeBhoomi ROR 1-B & Gram Adangal: Dist: NTR (Vijayawada), Mandal: Vijayawada Rural, Village: Nunna. Survey No: 142/3A, Khata No: 412. Extent: 2.50 Acres. Pattadar: Venkata Satyanarayana Rao. Father: Late Subba Rao. Passbook: AP-NTR-2021-99812. Status: Mutation Active. Encumbrance: Nil (Gunadala SRO). Boundary: 15 Cents encroached.",
  });

  // Dynamically compute the realistic AP MeeBhoomi land record
  const currentLandRecord: LandRecord = useMemo(() => {
    const rec = fetchAPLandRecord(surveyNumber, district);
    if (mandal && rec.mandal !== mandal) rec.mandal = mandal;
    if (village && rec.village !== village) rec.village = village;
    return rec;
  }, [surveyNumber, district, mandal, village]);

  const loadPreset = (preset: CasePreset) => {
    setSelectedState("Andhra Pradesh");
    setDistrict(preset.input.district);
    setSurveyNumber(preset.input.surveyNumber);
    setMandal(preset.input.mandal || preset.input.taluka || "");
    setVillage(preset.input.village || "");
    setPropertyType(preset.input.propertyType);
    setDisputeType(preset.input.disputeType);
    setApplicantName(preset.input.applicantName);
    setOpponentName(preset.input.opponentName || "");
    setDisputeDescription(preset.input.disputeDescription || "");

    if (preset.input.documentData) {
      setUploadedFile({
        name: preset.input.documentData.fileName,
        size: preset.input.documentData.fileSize,
        type: preset.input.documentData.fileType,
        textPreview: preset.input.documentData.extractedText || "",
      });
    } else {
      setUploadedFile(null);
    }
  };

  const handleApplyRecordDetails = (rec: LandRecord) => {
    setApplicantName(rec.ownerName);
    if (rec.mandal) setMandal(rec.mandal);
    if (rec.village) setVillage(rec.village);
  };

  const handleQuickSurveySelect = (sample: typeof SAMPLE_SURVEY_NUMBERS[0]) => {
    setDistrict(sample.district);
    setSurveyNumber(sample.survey);
    setMandal(sample.mandal);
    setVillage(sample.village);

    const rec = fetchAPLandRecord(sample.survey, sample.district);
    setApplicantName(rec.ownerName);

    if (rec.section22AFlag) {
      setDisputeType("section_22a_prohibited");
      setOpponentName("Tahsildar / O/o RDO");
      setDisputeDescription(`Property in Survey No. ${rec.surveyNumber} (${rec.totalExtent}) in ${rec.village}, ${rec.mandal} is classified under ${rec.section22ACategory || "Section 22-A"}. Resumption notice / rejection issued. Seeking RTI 1954 RSR verification and de-notification.`);
    } else if (rec.boundaryAndPossession.isEncroachedOrDisputed) {
      setDisputeType("boundary_encroachment");
      setOpponentName("Adjacent Landowner (Encroacher)");
      setDisputeDescription(`Survey No. ${rec.surveyNumber} (${rec.totalExtent}): ${rec.boundaryAndPossession.details} Demanding Tatkal F-Line Demarcation under AP Survey & Boundaries Act 1923.`);
    } else if (rec.mutationStatus === "Pending in Form-6A" || rec.mutationStatus === "Rejected / Stalled") {
      setDisputeType("mutation_delay");
      setOpponentName("Office of the Tahsildar");
      setDisputeDescription(`Survey No. ${rec.surveyNumber} (${rec.totalExtent}): ${rec.mutationDetails.remarks} Seeking statutory order under Section 5/5B of AP RoR Act 1971.`);
    } else {
      setDisputeType("title_cloud_general");
      setOpponentName("None (Pre-Purchase Legal Audit)");
      setDisputeDescription(`Pre-purchase statutory title audit for Survey No. ${rec.surveyNumber} (${rec.totalExtent}) in ${rec.village}, ${rec.district}. Undisputed MeeBhoomi 1-B title record.`);
    }
  };

  const handleVoiceCombinedInput = (detected: string | { surveyNumber?: string; district?: string }) => {
    if (typeof detected === "object") {
      if (detected.surveyNumber) setSurveyNumber(detected.surveyNumber);
      if (detected.district) setDistrict(detected.district);
    } else if (typeof detected === "string") {
      setSurveyNumber(detected);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate AP MeeBhoomi OCR extraction
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      textPreview: `[AP MeeBhoomi OCR Preview for ${file.name}]: Verified under Andhra Pradesh Revenue Department. Survey No: ${surveyNumber}, 1-B Khata: ${currentLandRecord.khataNumber}, Extent: ${currentLandRecord.totalExtent}, Pattadar: ${currentLandRecord.ownerName}, 22-A Flag: ${currentLandRecord.section22AFlag ? "TRUE" : "FALSE"}.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const inputData: PropertyInput = {
      surveyNumber,
      state: "Andhra Pradesh",
      district,
      mandal,
      taluka: mandal,
      village,
      propertyType,
      applicantName,
      opponentName: opponentName.trim() ? opponentName : undefined,
      disputeType,
      disputeDescription,
      landRecord: currentLandRecord,
      documentData: uploadedFile
        ? {
            fileName: uploadedFile.name,
            fileType: uploadedFile.type,
            fileSize: uploadedFile.size,
            extractedText: uploadedFile.textPreview,
          }
        : undefined,
    };

    onSubmit(inputData);
  };

  return (
    <div className="space-y-6">
      {/* Smart Voice Assistant Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Volume2 className="w-4 h-4 animate-pulse" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {t.voiceSmartBarTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              {t.voiceSmartBarDesc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <VoiceInputButton
              mode="combined"
              onValueDetected={handleVoiceCombinedInput}
              language={language}
              size="lg"
              label={language === "hi" ? "माइक दबाकर बोलें" : "Click to Speak"}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-500/50 shadow-md font-bold"
            />
          </div>
        </div>
      </div>

      {/* 4 AP Core Case Presets */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t.presetsTitle}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {t.presetsSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CASE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset)}
              className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850/90 transition-all text-left flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {preset.badge}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {preset.title}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.shortSummary}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AP Quick Survey Test Chips */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>{t.quickTestTitle}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            NTR (Vijayawada) • Visakhapatnam • Guntur • Tirupati
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Search className="w-3 h-3 text-amber-400" />
            {language === "hi" ? "त्वरित केस चुनें:" : "Quick Scenarios:"}
          </span>
          {SAMPLE_SURVEY_NUMBERS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickSurveySelect(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border flex items-center gap-1.5 ${
                surveyNumber === s.survey && district === s.district
                  ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-md font-bold"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
              }`}
            >
              <span className="font-bold">{s.survey}</span>
              <span className="text-[10px] text-slate-400 font-sans truncate max-w-[200px]">
                {s.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              {t.formHeading}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.formSubheading}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRecordPreview(!showRecordPreview)}
            className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {showRecordPreview
                ? language === "hi"
                  ? "मीभूमि कार्ड छुपाएं"
                  : "Hide MeeBhoomi Card"
                : language === "hi"
                ? "मीभूमि कार्ड देखें"
                : "View MeeBhoomi Card"}
            </span>
            {showRecordPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Core Inputs: Survey Number, State, District */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Survey / Plot Number with Voice Input Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                {t.surveyLabel} <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-normal">MeeBhoomi Sync</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                placeholder={t.surveyPlaceholder}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-3.5 pr-12 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
                <VoiceInputButton
                  mode="survey"
                  onValueDetected={(val) => setSurveyNumber(typeof val === "string" ? val : val.surveyNumber || "")}
                  language={language}
                  size="sm"
                  className="bg-transparent hover:bg-slate-800 border-none text-slate-400 hover:text-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* State (Fixed to Andhra Pradesh) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              {t.stateLabel} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              readOnly
              value="Andhra Pradesh (ఆంధ్రప్రదేశ్)"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-emerald-400 font-semibold cursor-not-allowed"
            />
          </div>

          {/* District Selector with Voice Input Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                {t.districtLabel} <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {language === "hi" ? "आवाज से चुनें" : "Voice enabled"}
              </span>
            </label>
            <div className="relative flex items-center">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-medium appearance-none"
              >
                {ANDHRA_PRADESH_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-auto">
                <VoiceInputButton
                  mode="district"
                  onValueDetected={(val) => {
                    const distName = typeof val === "string" ? val : val.district;
                    if (distName) setDistrict(distName);
                  }}
                  language={language}
                  size="sm"
                  className="bg-transparent hover:bg-slate-800 border-none text-slate-400 hover:text-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live MeeBhoomi Land Record Card Preview */}
        {showRecordPreview && currentLandRecord && (
          <div className="space-y-2 pt-1 pb-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {language === "hi"
                  ? `सर्वे नंबर ${currentLandRecord.surveyNumber} का मीभूमि रिकॉर्ड (${currentLandRecord.village}, ${currentLandRecord.mandal} मंडल):`
                  : `MeeBhoomi Record for Survey No. ${currentLandRecord.surveyNumber} (${currentLandRecord.village}, ${currentLandRecord.mandal} Mandal):`}
              </span>
              <span className="text-[11px] text-slate-400">
                {language === "hi" ? "खाता #" : "Khata #"}
                {currentLandRecord.khataNumber} • {currentLandRecord.totalExtent}
              </span>
            </div>
            <LandRecordCard
              record={currentLandRecord}
              onApplyRecord={handleApplyRecordDetails}
              showApplyButton={true}
              language={language}
            />
          </div>
        )}

        {/* Secondary Inputs: Mandal, Village, Property Type, Dispute Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">{t.mandalLabel}</label>
            <input
              type="text"
              value={mandal}
              onChange={(e) => setMandal(e.target.value)}
              placeholder="e.g. Vijayawada Rural, Anandapuram, Mangalagiri"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">{t.villageLabel}</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Nunna, Vemulavalasa, Nowlur"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">{t.propertyTypeLabel}</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Agricultural (మెట్ట / మాగాణి వ్యవసాయ భూమి)">
                {language === "hi" ? "कृषि भूमि (Agricultural Dry/Wet)" : "Agricultural (మెట్ట / మాగాణి)"}
              </option>
              <option value="Residential Plot / Layout (నివాస స్థలం)">
                {language === "hi" ? "आवासीय प्लॉट (Residential Plot)" : "Residential Plot / Layout (నివాస స్థలం)"}
              </option>
              <option value="Commercial / Industrial (వాణిజ్య / పారిశ్రామిక)">
                {language === "hi" ? "व्यावसायिक (Commercial / Industrial)" : "Commercial / Industrial (వాణిజ్య స్థలం)"}
              </option>
              <option value="Ancestral / Coparcenary (పూర్వీకుల ఆస్తి)">
                {language === "hi" ? "पैतृक संपत्ति (Ancestral Property)" : "Ancestral / Coparcenary (పూర్వీకుల ఆస్తి)"}
              </option>
              <option value="Assigned / D-Form Patta (అసైన్డ్ / డి-పట్టా)">
                {language === "hi" ? "असाइन्ड डी-पट्टा (Assigned D-Patta)" : "Assigned / D-Patta (అసైన్డ్ భూమి)"}
              </option>
              <option value="Gram Kantham / Abadi (గ్రామ కంఠం)">
                {language === "hi" ? "ग्राम कंठम (Gram Kantham / Abadi)" : "Gram Kantham / Abadi (గ్రామ కంఠం)"}
              </option>
              <option value="Endowment / Temple / Inam (దేవాదాయ / ఇనామ్ భూమి)">
                {language === "hi" ? "देवस्थानम / मंदिर ट्रस्ट भूमि" : "Endowment / Temple / Inam (దేవాదాయ)"}
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">{t.disputeTypeLabel}</label>
            <select
              value={disputeType}
              onChange={(e) => setDisputeType(e.target.value as DisputeType)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-medium text-emerald-400 text-xs"
            >
              <option value="boundary_encroachment">
                {language === "hi" ? "सीमा अतिक्रमण (Boundary Encroachment)" : "హద్దుల ఆక్రమణ (Boundary Encroachment)"}
              </option>
              <option value="section_22a_prohibited">
                {language === "hi" ? "धारा 22-A प्रतिबंधित सूची (Section 22-A)" : "సెక్షన్ 22-A నిషేధం (Section 22-A Prohibited)"}
              </option>
              <option value="mutation_delay">
                {language === "hi" ? "फॉर्म-6A म्यूटेशन में देरी (Mutation Delay)" : "ఫారం-6A మ్యుటేషన్ ఆలస్యం (Mutation Delay)"}
              </option>
              <option value="double_sale_fraud">
                {language === "hi" ? "दोहरी रजिस्ट्री धोखाधड़ी (Double Sale)" : "డబుల్ రిజిస్ట్రేషన్ ఫ్రాడ్ (Double Sale Fraud)"}
              </option>
              <option value="inheritance_partition">
                {language === "hi" ? "वारिस बंटवारा विवाद (Inheritance Partition)" : "వారసత్వ పంపకాలు (Inheritance Partition)"}
              </option>
              <option value="gram_kantham_conversion">
                {language === "hi" ? "ग्राम कंठम विवाद (Gram Kantham)" : "గ్రామ కంఠం వివాదం (Gram Kantham Dispute)"}
              </option>
              <option value="unauthorized_possession">
                {language === "hi" ? "अवैध कब्जा (Unauthorized Possession)" : "అనధికార ఆక్రమణ (Unauthorized Possession)"}
              </option>
              <option value="title_cloud_general">
                {language === "hi" ? "जमीन खरीदने से पूर्व टाइटल ऑडिट (Audit)" : "క్లియర్ టైటిల్ ఆడిట్ (Pre-Purchase Audit)"}
              </option>
            </select>
          </div>
        </div>

        {/* Parties Involved */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              {t.applicantLabel} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="e.g. Venkata Satyanarayana Rao"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-red-400" />
              {t.opponentLabel}
            </label>
            <input
              type="text"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
              placeholder="e.g. Adjacent Landowner (Encroacher)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Dispute Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            {t.disputeDescLabel} <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={disputeDescription}
            onChange={(e) => setDisputeDescription(e.target.value)}
            placeholder={
              language === "hi"
                ? "विवाद का संक्षिप्त विवरण लिखें: मेड़ तोड़ना, धारा 22A रोक, फॉर्म-6A टोकन नंबर, या लंबित RDO अपील..."
                : "Describe chronology: Field bund destruction, Section 22A refusal, Form-6A token number, or pending RDO appeal..."
            }
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-y leading-relaxed"
          />
        </div>

        {/* Optional Revenue Extract OCR File Upload */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              {t.fileUploadTitle}
            </span>
            <span className="text-[11px] text-slate-400">{t.fileUploadSubtitle}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors">
              <FileUp className="w-4 h-4 text-emerald-400" />
              <span>{t.fileChooseBtn}</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadedFile ? (
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 flex-1">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-mono truncate">{uploadedFile.name}</span>
                <span className="text-[10px] text-slate-500 flex-shrink-0">
                  ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">
                {language === "hi" ? "कोई दस्तावेज़ संलग्न नहीं है (वैकल्पिक)" : "No document attached yet (optional)"}
              </span>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>{t.submittingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{t.submitBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
