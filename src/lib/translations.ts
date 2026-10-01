export type Language = "en" | "hi";

export interface Translations {
  // Navigation
  appName: string;
  appSubtitle: string;
  navOverview: string;
  navDashboard: string;
  navApiKey: string;
  navLaunchAgent: string;

  // Hero
  heroPill: string;
  heroTitle1: string;
  heroTitleGradient: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  statScore: string;
  statScoreLabel: string;
  stat22A: string;
  stat22ALabel: string;
  statDrafts: string;
  statDraftsLabel: string;

  // Live Demo Preview
  demoTitle: string;
  demoSubtitle: string;
  demoEncroachment: string;
  demoKhata: string;
  demoSec22A: string;
  demoStay: string;
  demoBund: string;
  demoDraftsReady: string;
  demoLaunchCase: string;

  // 3-Step Process
  stepsHeading: string;
  stepsSubheading: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Real Scenarios
  scenariosHeading: string;
  scenariosSubheading: string;
  scenarioTestCta: string;

  // 4 Pillars
  pillarsHeading: string;
  pillarsSubheading: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;

  // Glossary
  glossaryHeading: string;
  glossarySubheading: string;

  // FAQs
  faqHeading: string;
  faqSubheading: string;

  // Form
  formHeading: string;
  formSubheading: string;
  presetsTitle: string;
  presetsSubtitle: string;
  quickTestTitle: string;
  surveyLabel: string;
  surveyPlaceholder: string;
  stateLabel: string;
  districtLabel: string;
  mandalLabel: string;
  villageLabel: string;
  propertyTypeLabel: string;
  disputeTypeLabel: string;
  applicantLabel: string;
  opponentLabel: string;
  disputeDescLabel: string;
  fileUploadTitle: string;
  fileUploadSubtitle: string;
  fileChooseBtn: string;
  submitBtn: string;
  submittingBtn: string;

  // Voice Input Assistant
  voiceSmartBarTitle: string;
  voiceSmartBarDesc: string;
  voiceSpeakBtn: string;
  voiceListeningMsg: string;
  voiceCapturedMsg: string;
  voiceMicSurveyTitle: string;
  voiceMicDistrictTitle: string;

  // Results
  resultsTitle: string;
  resultsRiskScore: string;
  riskSafe: string;
  riskModerate: string;
  riskHigh: string;
  riskCritical: string;
  problemsFoundHeading: string;
  problemsFoundDesc: string;
  nextStepsHeading: string;
  nextStepsDesc: string;
  downloadHeading: string;
  downloadDesc: string;
  btnDownloadMutation: string;
  btnDownloadRti: string;
  btnDownloadNotice: string;
  btnDownloadDemarcation: string;

  // Document Vault
  vaultTitle: string;
  vaultSubtitle: string;
  vaultTabDemarcation: string;
  vaultTabMutation: string;
  vaultTabNotice: string;
  vaultTabRti: string;
  vaultBtnEdit: string;
  vaultBtnSave: string;
  vaultBtnCopy: string;
  vaultBtnCopied: string;
  vaultBtnPrint: string;
  vaultBtnDownloadPdf: string;
  vaultEnclosuresTitle: string;
  vaultAuthorityBlockTitle: string;
  vaultKeyClausesTitle: string;

  // Roadmap & Reasoning
  roadmapTitle: string;
  roadmapSubtitle: string;
  roadmapPhase1: string;
  roadmapPhase2: string;
  roadmapPhase3: string;
  reasoningTitle: string;
  reasoningSubtitle: string;
  thoughtLogTitle: string;
  thoughtLogLive: string;
  thoughtLogDone: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    // Navigation
    appName: "LandNyaya",
    appSubtitle: "Andhra Pradesh Land Title & Dispute Intelligence • మీభూమి",
    navOverview: "Overview",
    navDashboard: "Dispute Dashboard",
    navApiKey: "Gemini Key",
    navLaunchAgent: "Launch Agent",

    // Hero
    heroPill: "Andhra Pradesh MeeBhoomi Legal Intelligence • మీభూమి",
    heroTitle1: "Instant, AI-Powered",
    heroTitleGradient: "Andhra Pradesh Land",
    heroTitle2: "Dispute Resolution & Title Safety",
    heroSubtitle:
      "Enter your Survey Number, Mandal, and District. LandNyaya automatically cross-checks MeeBhoomi ROR 1-B Khata, Gram Adangal, Section 22-A Prohibited Lists & FMB Tippon boundaries to calculate a Color-Coded Risk Score and generate ready-to-file legal PDF drafts.",
    heroCtaPrimary: "Check Land Safety Now",
    heroCtaSecondary: "How It Works",
    statScore: "0–100",
    statScoreLabel: "Statutory Risk Score",
    stat22A: "Sec 22-A",
    stat22ALabel: "Prohibited Land Check",
    statDrafts: "4 PDF Drafts",
    statDraftsLabel: "Mutation, RTI & Notice",

    // Live Demo Preview
    demoTitle: "Survey No. 142/3A (Khata #412)",
    demoSubtitle: "Nunna, Vijayawada Rural, NTR",
    demoEncroachment: "Boundary Encroachment",
    demoKhata: "1-B Khata: Active (#412)",
    demoSec22A: "Section 22-A: Clear",
    demoStay: "Court Suits: Nil Pending",
    demoBund: "Boundary: 15 Cents Encroached",
    demoDraftsReady: "4 Legal Drafts Ready (PDF)",
    demoLaunchCase: "View Full Analysis",

    // 3-Step Process
    stepsHeading: "How LandNyaya Protects Your Land in 3 Simple Steps",
    stepsSubheading: "No complicated legalese. Instant clarity on land ownership, disputes, and solutions.",
    step1Title: "1. Enter Survey Number & Location",
    step1Desc: "Provide your Survey Number, District, and Mandal, or optionally upload a MeeBhoomi Adangal / 1-B / Sale Deed document.",
    step2Title: "2. Instant AI Statutory Audit",
    step2Desc: "Our AI scans MeeBhoomi records, Section 22-A prohibited lists, court stay dockets, and FMB Tippon boundary measurements in seconds.",
    step3Title: "3. Get Risk Score & Download Legal Drafts",
    step3Desc: "See a clear Green/Yellow/Red Risk Score with problems explained, and download ready-to-submit Form-6A, RTI, and Advocate Notices as PDFs.",

    // Real Scenarios
    scenariosHeading: "Real-World Andhra Pradesh Dispute Scenarios",
    scenariosSubheading: "Click any scenario below to test instant AI reasoning and legal document generation.",
    scenarioTestCta: "Test in Dashboard",

    // 4 Pillars
    pillarsHeading: "The 4 Pillars of Land Title Verification",
    pillarsSubheading: "Every land record is evaluated across four essential legal checks.",
    pillar1Title: "1. MeeBhoomi ROR 1-B Mutation",
    pillar1Desc: "Checks if ownership is updated in the 1-B Khata and verifies Column 12 (Pattadar) vs Column 13 (Enjoyer/Occupant) in Adangal.",
    pillar2Title: "2. Section 22-A Prohibited List",
    pillar2Desc: "Screens against Government Poramboke, Endowment Temple, Waqf, and D-Patta Assigned Lands (POT Act 1977) where registration is void.",
    pillar3Title: "3. Court Litigation & Stay Orders",
    pillar3Desc: "Detects pending civil suits, Section 52 Lis Pendens liens, Order 39 injunctions, and Section 5-B RDO appeal proceedings.",
    pillar4Title: "4. FMB Tippon & Boundary Markers",
    pillar4Desc: "Verifies official field measurement coordinates against demolished bunds, neighbor encroachments, and missing survey stones.",

    // Glossary
    glossaryHeading: "Andhra Pradesh Revenue Glossary (రెవెన్యూ పదకోశం)",
    glossarySubheading: "Understand common MeeBhoomi and revenue terms in simple language.",

    // FAQs
    faqHeading: "Frequently Asked Questions",
    faqSubheading: "Simple, direct answers about land verification, Section 22-A, and dispute resolution in Andhra Pradesh.",

    // Form
    formHeading: "Andhra Pradesh Land Identification",
    formSubheading: "Enter Survey Number & Mandal. The system synchronizes with MeeBhoomi ROR 1-B and Section 22-A in real-time.",
    presetsTitle: "Quick Andhra Pradesh Dispute Presets",
    presetsSubtitle: "Click any scenario to test instant statutory analysis",
    quickTestTitle: "MeeBhoomi Quick-Test Survey Numbers",
    surveyLabel: "Survey / Sub-Division Number",
    surveyPlaceholder: "e.g. 142/3A, 89/2, 204/C, 58/1",
    stateLabel: "State Revenue Jurisdiction",
    districtLabel: "District (జిల్లా)",
    mandalLabel: "Mandal / Tehsil (మండలం)",
    villageLabel: "Village / Gramam (గ్రామం)",
    propertyTypeLabel: "Land Classification",
    disputeTypeLabel: "Dispute Category",
    applicantLabel: "Pattadar / Applicant Name",
    opponentLabel: "Opponent / Disputant Name (Optional)",
    disputeDescLabel: "Dispute Description & Background",
    fileUploadTitle: "Upload MeeBhoomi Adangal / 1-B / Sale Deed (Optional)",
    fileUploadSubtitle: "PDF, JPG, PNG (Max 15MB)",
    fileChooseBtn: "Choose Document",
    submitBtn: "Run Statutory Dispute Analysis",
    submittingBtn: "Analyzing MeeBhoomi & Revenue Records...",

    // Voice Input Assistant
    voiceSmartBarTitle: "Smart Voice Assistant (Browser Speech Recognition)",
    voiceSmartBarDesc: "Click the mic and speak in Hindi or English (e.g. 'Survey number 142/3A district Vijayawada')",
    voiceSpeakBtn: "Speak Land Details",
    voiceListeningMsg: "Listening... Speak now",
    voiceCapturedMsg: "Details Captured!",
    voiceMicSurveyTitle: "Click to speak Survey Number (e.g. '142/3A')",
    voiceMicDistrictTitle: "Click to speak District Name (e.g. 'Guntur', 'Vijayawada')",

    // Results
    resultsTitle: "Statutory Title Assessment & Risk Index",
    resultsRiskScore: "Dispute Risk Score",
    riskSafe: "SAFE TITLE (Clear & Marketable)",
    riskModerate: "MODERATE RISK (Caution Advised)",
    riskHigh: "HIGH RISK (Clouded Title)",
    riskCritical: "CRITICAL RISK (Void Under Law)",
    problemsFoundHeading: "Summary of Identified Problems & Risks",
    problemsFoundDesc: "Clear breakdown of issues found in MeeBhoomi, Registration Act Section 22-A, and Boundary records.",
    nextStepsHeading: "Recommended Next Steps & Action Roadmap",
    nextStepsDesc: "Step-by-step guidance on immediate actions, Tahsildar petitions, and judicial remedies.",
    downloadHeading: "Ready-to-File Legal Documents (Instant PDF Download)",
    downloadDesc: "Download professionally drafted, statutory legal applications tailored to your survey number.",
    btnDownloadMutation: "Download Form-6A Mutation PDF",
    btnDownloadRti: "Download RTI Form A PDF",
    btnDownloadNotice: "Download 15-Day Legal Notice PDF",
    btnDownloadDemarcation: "Download F-Line Demarcation PDF",

    // Document Vault
    vaultTitle: "Statutory Document Generator & Legal Vault",
    vaultSubtitle: "Official revenue petitions & legal notices pre-filled with your land data. Edit, print, or download as PDF.",
    vaultTabDemarcation: "F-Line Demarcation Petition",
    vaultTabMutation: "Form-6A MeeBhoomi Mutation",
    vaultTabNotice: "15-Day Advocate Notice",
    vaultTabRti: "RTI Form A (RSR & 1-B)",
    vaultBtnEdit: "Edit Document",
    vaultBtnSave: "Save Changes",
    vaultBtnCopy: "Copy Full Text",
    vaultBtnCopied: "Copied to Clipboard!",
    vaultBtnPrint: "Print Document",
    vaultBtnDownloadPdf: "Download Official PDF",
    vaultEnclosuresTitle: "Mandatory Statutory Enclosures (Attachments)",
    vaultAuthorityBlockTitle: "Submitting Authority / Recipient",
    vaultKeyClausesTitle: "Key Statutory Clauses & Citing Acts",

    // Roadmap & Reasoning
    roadmapTitle: "Action Plan & Legal Roadmap",
    roadmapSubtitle: "Interactive checklist of statutory remedies under AP Land Revenue & Boundary Acts.",
    roadmapPhase1: "Phase 1: Immediate Statutory Actions (Days 1 to 7)",
    roadmapPhase2: "Phase 2: Revenue Authority Proceedings (Weeks 2 to 4)",
    roadmapPhase3: "Phase 3: Civil & Judicial Remedies (Days 30 to 90+)",
    reasoningTitle: "Statutory Legal Reasoning Engine",
    reasoningSubtitle: "Deterministic decision tree grounded in AP Land Laws and High Court precedents.",
    thoughtLogTitle: "Agent Statutory Investigation Trace",
    thoughtLogLive: "Executing real-time AP MeeBhoomi & Section 22-A synthesis...",
    thoughtLogDone: "Investigation complete. 4 statutory pillars analyzed.",
  },
  hi: {
    // Navigation
    appName: "LandNyaya",
    appSubtitle: "आंध्र प्रदेश भूमि रिकॉर्ड एवं विवाद समाधान AI • మీభూమి",
    navOverview: "अवलोकन",
    navDashboard: "विवाद डैशबोर्ड",
    navApiKey: "Gemini Key",
    navLaunchAgent: "एजेंट शुरू करें",

    // Hero
    heroPill: "आंध्र प्रदेश मीभूमि कानूनी बुद्धिमत्ता • మీభూమి",
    heroTitle1: "AI द्वारा संचालित",
    heroTitleGradient: "आंध्र प्रदेश भूमि विवाद",
    heroTitle2: "समाधान एवं टाइटल सुरक्षा",
    heroSubtitle:
      "अपना सर्वे नंबर, मंडल और जिला दर्ज करें। LandNyaya तुरंत मीभूमि ROR 1-B खाता, ग्राम अडंगल, धारा 22-A प्रतिबंधित सूची और FMB सीमाओं की जांच करके कलर-कोडेड रिस्क स्कोर और तैयार कानूनी PDF ड्राफ्ट प्रदान करता है।",
    heroCtaPrimary: "अभी जमीन की सुरक्षा जांचें",
    heroCtaSecondary: "यह कैसे काम करता है",
    statScore: "0–100",
    statScoreLabel: "कानूनी रिस्क स्कोर",
    stat22A: "धारा 22-A",
    stat22ALabel: "प्रतिबंधित भूमि जांच",
    statDrafts: "4 PDF ड्राफ्ट",
    statDraftsLabel: "म्यूटेशन, RTI और नोटिस",

    // Live Demo Preview
    demoTitle: "सर्वे नंबर 142/3A (खाता #412)",
    demoSubtitle: "नुन्ना, विजयवाड़ा रूरल, NTR जिला",
    demoEncroachment: "सीमा पर अतिक्रमण पाया गया",
    demoKhata: "1-B खाता: सक्रिय (#412)",
    demoSec22A: "धारा 22-A: स्पष्ट (Clear)",
    demoStay: "कोर्ट केस: कोई लंबित नहीं",
    demoBund: "सीमा: 15 सेंट पर पड़ोसी का कब्जा",
    demoDraftsReady: "4 कानूनी ड्राफ्ट तैयार (PDF)",
    demoLaunchCase: "पूरा विश्लेषण देखें",

    // 3-Step Process
    stepsHeading: "LandNyaya आपकी जमीन की सुरक्षा कैसे करता है (3 आसान चरण)",
    stepsSubheading: "कोई कठिन कानूनी भाषा नहीं। जमीन के मालिकाना हक, विवाद और समाधान की तुरंत स्पष्ट जानकारी।",
    step1Title: "1. सर्वे नंबर और स्थान दर्ज करें",
    step1Desc: "अपना सर्वे नंबर, जिला और मंडल दर्ज करें, या मीभूमि अडंगल / 1-B / सेल डीड फाइल अपलोड करें।",
    step2Title: "2. AI द्वारा तुरंत कानूनी जांच",
    step2Desc: "हमारा AI मीभूमि रिकॉर्ड, धारा 22-A प्रतिबंधित सूची, कोर्ट स्टे आर्डर और FMB सीमा माप की सेकंडों में जांच करता है।",
    step3Title: "3. रिस्क स्कोर देखें और कानूनी ड्राफ्ट डाउनलोड करें",
    step3Desc: "हरा/पीला/लाल रिस्क स्कोर देखें और तहसीलदार या कोर्ट में जमा करने हेतु फॉर्म-6A, RTI और वकील नोटिस PDF डाउनलोड करें।",

    // Real Scenarios
    scenariosHeading: "आंध्र प्रदेश के वास्तविक विवाद परिदृश्य",
    scenariosSubheading: "AI विश्लेषण और कानूनी दस्तावेज तैयार करने हेतु नीचे दिए गए किसी भी केस पर क्लिक करें।",
    scenarioTestCta: "डैशबोर्ड में जांचें",

    // 4 Pillars
    pillarsHeading: "भूमि टाइटल सत्यापन के 4 मुख्य आधार",
    pillarsSubheading: "प्रत्येक भूमि रिकॉर्ड की चार अनिवार्य कानूनी पहलुओं पर जांच की जाती है।",
    pillar1Title: "1. मीभूमि ROR 1-B म्यूटेशन (दाखिल-खारिज)",
    pillar1Desc: "जांचता है कि क्या 1-B खाते में नाम दर्ज है और अडंगल के कॉलम 12 (पट्टादार) व कॉलम 13 (कब्जाधारक) में कोई अंतर तो नहीं है।",
    pillar2Title: "2. धारा 22-A प्रतिबंधित भूमि सूची",
    pillar2Desc: "सरकारी पोरम्बोक, देवस्थानम ट्रस्ट, वक्फ बोर्ड और असाइन्ड डी-पट्टा भूमि की जांच जहां रजिस्ट्री कानूनन अमान्य और शून्य होती है।",
    pillar3Title: "3. दीवानी मुकदमे और RDO अपील",
    pillar3Desc: "धारा 52 लिस पेंडेंस, कोर्ट स्टे आर्डर, निषेधाज्ञा (Injunction) और RDO के समक्ष धारा 5-B अपील की जांच करता है।",
    pillar4Title: "4. FMB सीमा माप एवं पत्थर निशान",
    pillar4Desc: "फील्ड मेजरमेंट बुक (FMB) के आधार पर तोड़ी गई मेड़ (Gattu) और पड़ोसी द्वारा किए गए अवैध कब्जे की पहचान करता है।",

    // Glossary
    glossaryHeading: "आंध्र प्रदेश रेवेन्यू शब्दावली (రెవెన్యూ పదకోశం)",
    glossarySubheading: "मीभूमि और राजस्व विभाग के सामान्य शब्दों को आसान भाषा में समझें।",

    // FAQs
    faqHeading: "अक्सर पूछे जाने वाले सवाल (FAQs)",
    faqSubheading: "आंध्र प्रदेश में भूमि जांच, धारा 22-A और सीमा विवादों के बारे में स्पष्ट उत्तर।",

    // Form
    formHeading: "आंध्र प्रदेश भूमि विवरण दर्ज करें",
    formSubheading: "सर्वे नंबर और मंडल दर्ज करें। सिस्टम वास्तविक समय में मीभूमि ROR 1-B और धारा 22-A रिकॉर्ड से जुड़ता है।",
    presetsTitle: "प्रमुख आंध्र प्रदेश विवाद परिदृश्य",
    presetsSubtitle: "तुरंत विश्लेषण देखने के लिए किसी भी केस पर क्लिक करें",
    quickTestTitle: "मीभूमि त्वरित टेस्ट सर्वे नंबर",
    surveyLabel: "सर्वे / सब-डिवीजन नंबर",
    surveyPlaceholder: "उदा. 142/3A, 89/2, 204/C, 58/1",
    stateLabel: "राज्य राजस्व अधिकार क्षेत्र",
    districtLabel: "जिला (District)",
    mandalLabel: "मंडल / तहसील (Mandal)",
    villageLabel: "ग्राम / राजस्व गांव (Village)",
    propertyTypeLabel: "भूमि वर्गीकरण",
    disputeTypeLabel: "विवाद का प्रकार",
    applicantLabel: "पट्टादार / आवेदक का नाम",
    opponentLabel: "विरोधी / कब्जाधारी का नाम (वैकल्पिक)",
    disputeDescLabel: "विवाद का विवरण एवं पृष्ठभूमि",
    fileUploadTitle: "मीभूमि अडंगल / 1-B / सेल डीड अपलोड करें (वैकल्पिक)",
    fileUploadSubtitle: "PDF, JPG, PNG (अधिकतम 15MB)",
    fileChooseBtn: "दस्तावेज़ चुनें",
    submitBtn: "कानूनी विवाद विश्लेषण शुरू करें",
    submittingBtn: "मीभूमि और रेवेन्यू रिकॉर्ड्स की जांच हो रही है...",

    // Voice Input Assistant
    voiceSmartBarTitle: "स्मार्ट वॉइस असिस्टेंट (बोलकर दर्ज करें)",
    voiceSmartBarDesc: "माइक पर क्लिक करें और हिंदी या अंग्रेजी में बोलें (उदा. 'सर्वे नंबर 142/3A जिला विजयवाड़ा')",
    voiceSpeakBtn: "बोलकर दर्ज करें",
    voiceListeningMsg: "सुन रहे हैं... बोलिए",
    voiceCapturedMsg: "विवरण दर्ज हो गया!",
    voiceMicSurveyTitle: "सर्वे नंबर बोलें (उदा. '142 बटा 3A')",
    voiceMicDistrictTitle: "जिले का नाम बोलें (उदा. 'विजयवाड़ा', 'गुंटूर')",

    // Results
    resultsTitle: "कानूनी टाइटल मूल्यांकन एवं रिस्क इंडेक्स",
    resultsRiskScore: "विवाद रिस्क स्कोर",
    riskSafe: "सुरक्षित टाइटल (SAFE - कोई विवाद नहीं)",
    riskModerate: "मध्यम जोखिम (MODERATE - सावधानी जरूरी)",
    riskHigh: "उच्च जोखिम (HIGH - विवादित टाइटल)",
    riskCritical: "अति जोखिम (CRITICAL - कानूनन शून्य)",
    problemsFoundHeading: "पाई गई समस्याओं और जोखिमों का विवरण",
    problemsFoundDesc: "मीभूमि, रजिस्ट्री एक्ट धारा 22-A और सीमा अतिक्रमण में मिली खामियों का स्पष्ट विश्लेषण।",
    nextStepsHeading: "अनुशंसित अगले कदम (एक्शन प्लान)",
    nextStepsDesc: "तुरंत उठाए जाने वाले कदम, तहसीलदार के समक्ष आवेदन और कानूनी उपायों की चरणबद्ध योजना।",
    downloadHeading: "तैयार कानूनी दस्तावेज (तुरंत PDF डाउनलोड करें)",
    downloadDesc: "अपने सर्वे नंबर के अनुसार तैयार किए गए कानूनी आवेदनों को 1-क्लिक में PDF के रूप में डाउनलोड करें।",
    btnDownloadMutation: "फॉर्म-6A म्यूटेशन आवेदन PDF",
    btnDownloadRti: "RTI फॉर्म A आवेदन PDF",
    btnDownloadNotice: "15-दिवसीय कानूनी नोटिस PDF",
    btnDownloadDemarcation: "F-लाइन सीमा डिमार्केशन आवेदन PDF",

    // Document Vault
    vaultTitle: "कानूनी दस्तावेज वॉल्ट एवं जनरेटर",
    vaultSubtitle: "आपके भूमि विवरण के साथ स्वतः भरे गए आधिकारिक आवेदन व कानूनी नोटिस। संपादित करें, प्रिंट करें या PDF डाउनलोड करें।",
    vaultTabDemarcation: "F-लाइन सीमा डिमार्केशन आवेदन",
    vaultTabMutation: "फॉर्म-6A मीभूमि म्यूटेशन आवेदन",
    vaultTabNotice: "15-दिवसीय वकील कानूनी नोटिस",
    vaultTabRti: "RTI फॉर्म A (RSR एवं 1-B रिकॉर्ड)",
    vaultBtnEdit: "दस्तावेज़ संपादित करें",
    vaultBtnSave: "परिवर्तन सहेजें",
    vaultBtnCopy: "पूरा टेक्स्ट कॉपी करें",
    vaultBtnCopied: "क्लिपबोर्ड पर कॉपी हो गया!",
    vaultBtnPrint: "प्रिंट करें",
    vaultBtnDownloadPdf: "आधिकारिक PDF डाउनलोड करें",
    vaultEnclosuresTitle: "अनिवार्य कानूनी संलग्नक (Attachments)",
    vaultAuthorityBlockTitle: "प्राप्तकर्ता / सक्षम अधिकारी",
    vaultKeyClausesTitle: "प्रमुख कानूनी धाराएं एवं अधिनियम",

    // Roadmap & Reasoning
    roadmapTitle: "एक्शन प्लान एवं कानूनी रोडमैप",
    roadmapSubtitle: "आंध्र प्रदेश राजस्व व सीमा अधिनियमों के तहत उपलब्ध कानूनी उपायों की इंटरैक्टिव चेकलिस्ट।",
    roadmapPhase1: "चरण 1: त्वरित कानूनी कदम (1 से 7 दिन)",
    roadmapPhase2: "चरण 2: राजस्व अधिकारी / तहसीलदार कार्यवाही (2 से 4 सप्ताह)",
    roadmapPhase3: "चरण 3: दीवानी एवं न्यायिक उपाय (30 से 90+ दिन)",
    reasoningTitle: "कानूनी तर्क एवं निर्णय वृक्ष (Reasoning Tree)",
    reasoningSubtitle: "आंध्र प्रदेश भूमि कानूनों एवं हाईकोर्ट के नज़ीरों पर आधारित स्वचालित निर्णय प्रणाली।",
    thoughtLogTitle: "AI कानूनी अन्वेषण प्रक्रिया (Thought Trace)",
    thoughtLogLive: "मीभूमि एवं धारा 22-A रिकॉर्ड्स का लाइव विश्लेषण चल रहा है...",
    thoughtLogDone: "अन्वेषण पूर्ण। 4 कानूनी आधारों का सफलतापूर्वक विश्लेषण किया गया।",
  },
};
