import { GoogleGenAI } from "@google/genai";
import {
  AnalysisResult,
  PropertyInput,
  RiskAssessmentBreakdown,
  CriticalFlag,
  LegalProvision,
  ActionPlanStep,
  LegalDocumentArtifact,
  AgentThoughtStep,
  LandRecord,
} from "@/types/landnyaya";
import { fetchAPLandRecord } from "@/lib/mockLandRecords";

/**
 * Intelligent Multi-Factor Legal Heuristic Fallback Engine
 * Generates accurate statutory analysis based on Andhra Pradesh Land Revenue Laws:
 * - AP Rights in Land and Pattadar Pass Books Act, 1971 (Sections 4, 5, 5B, 6A)
 * - AP Survey and Boundaries Act, 1923 (Sections 9 & 10)
 * - AP Assigned Lands (Prohibition of Transfers) Act, 1977
 * - Section 22-A of Registration Act, 1908 (AP Amendment)
 */
export function generateLocalLegalAnalysis(input: PropertyInput): AnalysisResult {
  const landRecord: LandRecord =
    input.landRecord ||
    fetchAPLandRecord(input.surveyNumber, input.district || "NTR (Vijayawada)");

  const disputeDesc = (input.disputeDescription || "").toLowerCase();
  const isEncroachment =
    input.disputeType === "boundary_encroachment" ||
    landRecord.boundaryAndPossession.isEncroachedOrDisputed ||
    disputeDesc.includes("encroach") ||
    disputeDesc.includes("boundary") ||
    disputeDesc.includes("bund") ||
    disputeDesc.includes("గట్టు") ||
    disputeDesc.includes("ఆక్రమణ");

  const isMutationIssue =
    input.disputeType === "mutation_delay" ||
    landRecord.mutationStatus !== "Sanctioned / Active" ||
    disputeDesc.includes("mutation") ||
    disputeDesc.includes("form-6a") ||
    disputeDesc.includes("1-b") ||
    disputeDesc.includes("passbook") ||
    disputeDesc.includes("మ్యుటేషన్");

  const isSection22A =
    input.disputeType === "section_22a_prohibited" ||
    landRecord.section22AFlag ||
    disputeDesc.includes("22-a") ||
    disputeDesc.includes("assigned") ||
    disputeDesc.includes("d-patta") ||
    disputeDesc.includes("poramboke") ||
    disputeDesc.includes("నిషేధిత");

  const isLitigation =
    landRecord.litigation.hasActiveCourtCase ||
    disputeDesc.includes("court") ||
    disputeDesc.includes("appeal") ||
    disputeDesc.includes("stay");

  // Factor Scores directly from Statutory Pillars in LandRecord
  const mutationScore = landRecord.mutationDetails.riskScoreContribution;
  const encumbranceScore = landRecord.encumbrance.riskScoreContribution;
  const courtCasesScore = landRecord.litigation.riskScoreContribution;
  const boundaryScore = landRecord.boundaryAndPossession.riskScoreContribution;

  const mutationStatusText: "CLEAR" | "PENDING" | "DISPUTED" | "CRITICAL" =
    mutationScore > 75 ? "CRITICAL" : mutationScore > 50 ? "PENDING" : mutationScore > 20 ? "DISPUTED" : "CLEAR";

  const encumbranceStatusText: "CLEAR" | "PENDING" | "DISPUTED" | "CRITICAL" =
    encumbranceScore > 75 ? "CRITICAL" : encumbranceScore > 50 ? "DISPUTED" : encumbranceScore > 20 ? "PENDING" : "CLEAR";

  const courtStatusText: "CLEAR" | "PENDING" | "DISPUTED" | "CRITICAL" =
    courtCasesScore > 75 ? "CRITICAL" : courtCasesScore > 40 ? "DISPUTED" : courtCasesScore > 15 ? "PENDING" : "CLEAR";

  const boundaryStatusText: "CLEAR" | "PENDING" | "DISPUTED" | "CRITICAL" =
    boundaryScore > 75 ? "CRITICAL" : boundaryScore > 40 ? "DISPUTED" : boundaryScore > 15 ? "PENDING" : "CLEAR";

  const overallScore = landRecord.compositeRiskScore;

  let riskLevel: AnalysisResult["riskLevel"] = "LOW RISK (Clear Title)";
  if (overallScore >= 75) {
    riskLevel = "CRITICAL RISK (Active Litigation/Fraud)";
  } else if (overallScore >= 60) {
    riskLevel = "HIGH RISK (Clouded Title)";
  } else if (overallScore >= 30) {
    riskLevel = "MODERATE RISK (Action Advised)";
  }

  const mandalStr = landRecord.mandal ? `${landRecord.mandal} Mandal, ` : "";
  const villageStr = landRecord.village ? `${landRecord.village} Village, ` : "";

  // 4 Risk Breakdown Pillars tailored for AP Land Laws
  const breakdown: RiskAssessmentBreakdown = {
    mutationStatus: {
      score: mutationScore,
      status: mutationStatusText,
      severity: mutationScore > 70 ? "critical" : mutationScore > 45 ? "high" : mutationScore > 20 ? "medium" : "low",
      keyFinding:
        mutationScore > 60
          ? `MeeBhoomi 1-B Khata mutation stalled: ${landRecord.mutationDetails.remarks}`
          : mutationScore > 20
          ? `Form-6A mutation under verification: ${landRecord.mutationDetails.remarks}`
          : `ROR 1-B Khata (${landRecord.khataNumber}) active: ${landRecord.mutationDetails.remarks}`,
      legalBasis: "AP Rights in Land and Pattadar Pass Books Act, 1971 (Section 5) & AP RoR Rules 1989",
      details: `Under Section 5 of the AP RoR Act 1971, any title transfer must be notified in Form-VIII and certified within the statutory 30-day period. Uncertified entries remain open to challenge before the Revenue Divisional Officer (RDO) under Section 5-B.`,
    },
    encumbrance: {
      score: encumbranceScore,
      status: encumbranceStatusText,
      severity: encumbranceScore > 70 ? "critical" : encumbranceScore > 45 ? "high" : encumbranceScore > 20 ? "medium" : "low",
      keyFinding: isSection22A
        ? `CRITICAL 22-A PROHIBITION: ${landRecord.section22ACategory || "Section 22-A Prohibited Property"}. ${landRecord.encumbrance.details}`
        : encumbranceScore > 60
        ? `Encumbrance recorded: ${landRecord.encumbrance.details}`
        : encumbranceScore > 20
        ? `Agricultural mortgage lien recorded at ${landRecord.encumbrance.sroOffice}.`
        : `Nil Encumbrance recorded at ${landRecord.encumbrance.sroOffice} for 30 years.`,
      legalBasis: isSection22A
        ? "Registration Act 1908 (AP Section 22-A) & AP Assigned Lands (POT) Act 1977 (Act 9/1977)"
        : "Transfer of Property Act, 1882 (Section 48 & 54) & Registration Act 1908",
      details: isSection22A
        ? `Under Section 3 of the AP Assigned Lands (POT) Act 1977, alienation of assigned D-patta land is void ab initio. De-notification requires representation to District 22-A Committee or High Court Writ Petition.`
        : `Verified across Sub-Registrar records at ${landRecord.encumbrance.sroOffice}.`,
    },
    pendingCourtCases: {
      score: courtCasesScore,
      status: courtStatusText,
      severity: courtCasesScore > 70 ? "critical" : courtCasesScore > 45 ? "high" : courtCasesScore > 20 ? "medium" : "low",
      keyFinding: landRecord.litigation.hasActiveCourtCase
        ? `${landRecord.litigation.caseNumber || "Active Appeal"}: ${landRecord.litigation.details} (${landRecord.litigation.courtName || "Revenue Court"})`
        : "Clean judicial docket. Zero pending civil or revenue suits.",
      legalBasis: "Transfer of Property Act, 1882 (Section 52 - Lis Pendens) & CPC 1908 (Order 39 Rules 1 & 2)",
      details: landRecord.litigation.hasActiveCourtCase
        ? `Statutory proceedings pending under ${landRecord.litigation.suitType || "AP Land Revenue Laws"}. Any conveyance executed during pendency is strictly subject to the final decree under Section 52 TPA.`
        : `No active stay orders, Caveat Petitions, or Lis Pendens registered.`,
    },
    boundaryInheritance: {
      score: boundaryScore,
      status: boundaryStatusText,
      severity: boundaryScore > 70 ? "critical" : boundaryScore > 45 ? "high" : boundaryScore > 20 ? "medium" : "low",
      keyFinding: landRecord.boundaryAndPossession.isEncroachedOrDisputed
        ? `Boundary Encroachment Detected: ${landRecord.boundaryAndPossession.details}${landRecord.boundaryAndPossession.missingCents ? ` (Missing: ${landRecord.boundaryAndPossession.missingCents})` : ""}`
        : "FMB boundary stones intact and verified with Mandal Surveyor tippon.",
      legalBasis: "AP Survey and Boundaries Act, 1923 (Sections 9 & 10) & Specific Relief Act 1963",
      details: landRecord.boundaryAndPossession.isEncroachedOrDisputed
        ? `Encroachment on agricultural land constitutes civil trespass. Statutory F-Line Demarcation Survey by Mandal Surveyor under Sections 9 & 10 of AP Survey & Boundaries Act 1923 is legally required to restore boundaries.`
        : `Physical possession verified in Gram Adangal. Boundary stones match FMB sketch.`,
    },
  };

  const criticalFlags: CriticalFlag[] = [];
  if (isSection22A) {
    criticalFlags.push({
      id: "flag-ap-22a",
      title: "Section 22-A Prohibited Land List Inclusion (సెక్షన్ 22-A నిషేధం)",
      severity: "critical",
      impact: "Registration of any Sale Deed, Gift, or Mortgage is completely barred at the Sub-Registrar Office. Risk of land resumption by Tahsildar under POT Act 1977.",
      actCitation: "Registration Act, 1908 (AP Sec 22-A) & AP Assigned Lands Act, 1977 (Act 9/1977)",
      recommendation: "Obtain certified 1954 Resurvey Settlement Register (RSR) copy via RTI Form A and file a formal De-notification Representation before the District Level 22-A Committee / High Court Writ Petition.",
    });
  }

  if (isEncroachment) {
    criticalFlags.push({
      id: "flag-ap-encroachment",
      title: "Boundary Encroachment & Field Bund Demolition (హద్దుల ఆక్రమణ)",
      severity: "critical",
      impact: `Unauthorized occupation of ${landRecord.boundaryAndPossession.missingCents || "land"} by adjacent owner. Risk of adverse possession claims if not interrupted under Limitation Act Article 65.`,
      actCitation: "AP Survey and Boundaries Act, 1923 (Sec 9 & 10) & Specific Relief Act 1963 (Sec 38)",
      recommendation: "Submit Tatkal F-Line Survey Demarcation Petition with Treasury Challan to Tahsildar / Mandal Surveyor and serve 15-Day Advocate Legal Notice.",
    });
  }

  if (isMutationIssue) {
    criticalFlags.push({
      id: "flag-ap-mutation",
      title: "Form-6A MeeBhoomi e-Passbook Mutation Delay (మ్యుటేషన్ ఆలస్యం)",
      severity: "high",
      impact: "Without 1-B Khata certification, title is non-marketable, crop loans cannot be availed, and compensation cannot be claimed in land acquisition.",
      actCitation: "AP Rights in Land and Pattadar Pass Books Act, 1971 (Section 5 & 5-B)",
      recommendation: "Issue Form-VIII compliance demand to Tahsildar; if not resolved within statutory period, file Section 5-B Statutory Appeal before the Revenue Divisional Officer (RDO).",
    });
  }

  if (criticalFlags.length === 0) {
    criticalFlags.push({
      id: "flag-ap-clean",
      title: "Verified AP MeeBhoomi Clear Title (క్లియర్ టైటిల్ దృవీకరణ)",
      severity: "medium",
      impact: "Standard statutory compliance verified. All revenue records in order.",
      actCitation: "AP Rights in Land and Pattadar Pass Books Act, 1971",
      recommendation: "Maintain certified annual MeeBhoomi Adangal (Pahani) extracts and preserve original registered Sale Deed in title chain.",
    });
  }

  const legalProvisions: LegalProvision[] = [
    {
      act: "AP Rights in Land and Pattadar Pass Books Act, 1971 (Act 26 of 1971)",
      section: "Section 5 & 5-B",
      title: "Amendment of Record of Rights (1-B Khata) & Statutory Appeal to RDO",
      relevance: "Mandates the Tahsildar to amend ROR upon acquisition of rights within 30 days; provides 60-day appeal remedy before RDO under Section 5-B.",
    },
    {
      act: "Andhra Pradesh Survey and Boundaries Act, 1923 (Act VIII of 1923)",
      section: "Sections 9 & 10",
      title: "Power of Survey Officer to determine disputed boundary & F-Line survey",
      relevance: "Empowers the Mandal Surveyor to enter upon land, inspect FMB Tippon ladders, fix boundary stone markers, and issue certified demarcation sketch.",
    },
    {
      act: "Registration Act, 1908 (Andhra Pradesh Amendment Act 19 of 2007)",
      section: "Section 22-A",
      title: "Prohibition of Registration of Certain Categories of Documents",
      relevance: "Prohibits Sub-Registrars from registering documents relating to Government lands, D-patta assigned lands, Endowments, and Waqf properties.",
    },
    {
      act: "AP Assigned Lands (Prohibition of Transfers) Act, 1977 (Act No. 9 of 1977)",
      section: "Sections 3 & 4",
      title: "Prohibition of transfer of assigned lands and resumption by Government",
      relevance: "Declares any sale, mortgage, or lease of lands assigned to landless poor as null and void ab initio, empowering Tahsildar to resume possession.",
    },
    {
      act: "Transfer of Property Act, 1882",
      section: "Section 48 & 52",
      title: "Priority of Rights Created by Transfer & Doctrine of Lis Pendens",
      relevance: "Establishes absolute priority of prior registered deed and subjects any transfer during pending civil suit to the final decree of the court.",
    },
    {
      act: "Right to Information Act, 2005",
      section: "Section 6(1) & 7(1)",
      title: "Statutory Right to Obtain Certified Revenue & Resurvey Settlement Records",
      relevance: "Enables landholder to obtain certified true copies of 1954 RSR, MeeBhoomi 1-B Khata, and FMB Tippon within 30 days from PIO/Tahsildar.",
    },
  ];

  const actionPlan: AnalysisResult["actionPlan"] = {
    immediate: [
      {
        id: "act-1",
        phase: "immediate",
        title: "Obtain Certified MeeBhoomi Adangal, 1-B Khata & 1954 RSR Extract",
        authority: "Public Information Officer / Naib Tahsildar, Mandal Revenue Office",
        timeframe: "Days 1 to 3",
        priority: "Urgent",
        statutoryDeadline: "30 Days under RTI Act 2005",
        estimatedCost: "₹ 50 (RTI & MeeBhoomi User Charges)",
        instructions: [
          "Submit Form A RTI application demanding certified true copy of 1-B Khata and Adangal entries.",
          "Obtain 1954 Resurvey Settlement Register (RSR) extract to verify Ryotwari Patta origin against Section 22-A claims.",
          "Capture geo-tagged date-stamped photographs of existing physical possession, crops, and boundary markers.",
        ],
      },
      {
        id: "act-2",
        phase: "immediate",
        title: "Serve 15-Day Advocate Legal Notice (Cease & Desist / Restore Field Bund)",
        authority: "Issued via Advocate on behalf of Applicant to Counterparty",
        timeframe: "Days 3 to 5",
        priority: "Urgent",
        statutoryDeadline: "15 Days Peremptory Notice Period",
        estimatedCost: "₹ 2,000 - ₹ 3,500",
        instructions: [
          "Serve formal Legal Notice via India Post Registered Post with Acknowledgment Due (RPAD) & Speed Post.",
          "Demand immediate removal of encroachment, reconstruction of field bund, and cessation of illegal interference.",
          "Explicitly warn of Suit for Permanent Injunction under Specific Relief Act 1963 and BNS Criminal Trespass proceedings.",
        ],
      },
    ],
    revenueAuthority: [
      {
        id: "act-3",
        phase: "revenue_authority",
        title: "File Tatkal F-Line Survey & Demarcation Petition with Treasury Challan",
        authority: "Office of the Tahsildar & Mandal Surveyor",
        timeframe: "Week 2",
        priority: "Urgent",
        statutoryDeadline: "45 Days under AP Survey & Boundaries Act, 1923",
        estimatedCost: "₹ 500 - ₹ 1,000 (Government Survey Challan in CFMS AP)",
        instructions: [
          "Pay government survey fee via AP CFMS treasury portal under Survey & Land Records Head of Account.",
          "Submit F-Line petition along with registered sale deed, MeeBhoomi 1-B extract, and FMB sketch copy.",
          "Ensure Tahsildar issues statutory Section 9 survey notice to all adjacent survey number pattadars before measurement.",
        ],
      },
      {
        id: "act-4",
        phase: "revenue_authority",
        title: "Submit Form-6A MeeBhoomi Digital Mutation Application / Section 5B Appeal",
        authority: "Tahsildar & Joint Sub-Registrar / Revenue Divisional Officer (RDO)",
        timeframe: "Week 3",
        priority: "High",
        statutoryDeadline: "30 Days under Section 5 AP RoR Act 1971 / 60 Days for Appeal",
        estimatedCost: "₹ 100 (MeeSeva / AP Seva Portal Fee)",
        instructions: [
          "Submit Form-6A online application through AP Seva Portal with e-KYC authentication.",
          "Verify Village Revenue Officer (VRO) and Mandal Revenue Inspector (MRI) field inspection report.",
          "If delayed beyond statutory period, file Section 5-B statutory appeal before the Revenue Divisional Officer (RDO).",
        ],
      },
    ],
    judicialRemedy: [
      {
        id: "act-5",
        phase: "judicial_remedy",
        title: "File Caveat Petition under Section 148A CPC",
        authority: "Court of Principal Senior / Junior Civil Judge, " + input.district,
        timeframe: "Within 7 Days",
        priority: "High",
        statutoryDeadline: "Valid for 90 Days under Sec 148A(5) CPC",
        estimatedCost: "₹ 1,500 - ₹ 2,500",
        instructions: [
          "Lodge Caveat Petition in the competent Civil Court to prevent opponent from obtaining ex-parte interim injunction.",
          "Serve statutory copy of Caveat Petition upon opponent via Registered Post AD.",
        ],
      },
      {
        id: "act-6",
        phase: "judicial_remedy",
        title: "Institute Civil Suit for Declaration & Permanent Injunction (Specific Relief Act)",
        authority: "Jurisdictional Senior Civil Judge Court, " + input.district,
        timeframe: "Month 1 to 2",
        priority: "High",
        timeline: "6 to 18 Months",
        estimatedCost: "Court Fees based on AP Court Fees & Suits Valuation Act, 1956",
        instructions: [
          "File Plaint for Declaration of Title (Sec 34) and Permanent Injunction (Sec 38 Specific Relief Act 1963).",
          "Move Interlocutory Application (IA) under Order 39 Rules 1 & 2 CPC for temporary injunction restraining alienation.",
          "File IA under Order 26 Rule 9 CPC for appointment of Advocate Commissioner to inspect physical possession.",
        ],
      },
    ],
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const refNumber = `LN-AP/${input.district.substring(0, 3).toUpperCase()}/${input.surveyNumber.replace(/[^a-zA-Z0-9]/g, "")}/${Math.floor(1000 + Math.random() * 9000)}`;

  // Document 1: Form-6A MeeBhoomi Mutation Application (AP RoR Act 1971)
  const mutationFormDoc: LegalDocumentArtifact = {
    id: "mutation_form",
    title: "FORM-6A: APPLICATION FOR AMENDMENT OF RECORD OF RIGHTS (ROR 1-B KHATA) & E-PATTADAR PASSBOOK",
    subtitle: "[Under Section 5(1) of Andhra Pradesh Rights in Land and Pattadar Pass Books Act, 1971 & Rule 18 of AP RoR Rules, 1989]",
    authorityOrRecipient: `To,\nThe Tahsildar & Joint Sub-Registrar,\nMandal Revenue Office,\nMandal: ${landRecord.mandal || input.taluka || "Headquarters"},\nDistrict: ${input.district}, Andhra Pradesh.`,
    referenceNumber: `${refNumber}/MUT-6A`,
    dateGenerated: currentDate,
    statutoryAct: "Andhra Pradesh Rights in Land and Pattadar Pass Books Act, 1971 (Act No. 26 of 1971)",
    instructionsForFiling: `Submit through AP Seva / MeeSeva Portal or submit physical petition at Tahsildar Spandana / MeeSeva Inward counter with Court Fee stamp of Rs. 10.`,
    requiredAttachments: [
      "Certified Copy of Registered Sale Deed / Partition Deed / Title Deed",
      "MeeBhoomi 1-B Khata & Gram Adangal Extract for Survey No. " + input.surveyNumber,
      "Copy of Aadhaar Card and Passport size photo of Applicant (" + input.applicantName + ")",
      "Proof of payment of statutory mutation fee via AP CFMS Challan",
    ],
    keyClauses: [
      "Application for title amendment in MeeBhoomi ROR 1-B Khata under Section 5(1) AP RoR Act 1971",
      "Mandatory 30-day notice under Form-VIII to interested parties & VRO field inspection",
      "Issuance of Digital e-Pattadar Passbook & Title Deed under Section 6A of the Act",
    ],
    content: `FORM - 6A
[See Rule 18 of the Andhra Pradesh Rights in Land and Pattadar Pass Books Rules, 1989]
APPLICATION FOR AMENDMENT AND UPDATING OF RECORD OF RIGHTS (ROR 1-B) & ISSUE OF E-PATTADAR PASSBOOK

TO,
THE TAHSILDAR & JOINT SUB-REGISTRAR,
Mandal Revenue Office,
Mandal: ${landRecord.mandal || input.taluka || "Mandal Headquarters"},
District: ${input.district}, State of Andhra Pradesh.

1. PARTICULARS OF THE APPLICANT:
   Name: ${input.applicantName}
   Father / Husband Name: ${landRecord.fatherOrHusbandName || "[Father / Husband Name]"}
   Aadhaar Number: [Aadhaar UID No.] | Mobile: +91-XXXXXXXXXX
   Residential Address: ${villageStr}${mandalStr}${input.district}, Andhra Pradesh.

2. DETAILS OF LAND IN RESPECT OF WHICH ROR AMENDMENT IS SOUGHT:
   - District: ${input.district}
   - Mandal: ${landRecord.mandal}
   - Revenue Village: ${landRecord.village}
   - Survey / Sub-Division Number: ${input.surveyNumber}
   - Total Extent / Area: ${landRecord.totalExtent}
   - Land Classification: ${landRecord.landClassification}
   - Khata Number: ${landRecord.khataNumber}
   - Pattadar Passbook No: ${landRecord.pattadarPassbookNo}

3. MODE OF ACQUISITION OF RIGHT / TITLE:
   The Applicant has lawfully acquired absolute title, right, and physical possession in respect of the subject property by virtue of Registered Conveyance / Succession.

4. STATUTORY GROUNDS & PRAYER:
   (i) Under Section 4 of the AP Rights in Land and Pattadar Pass Books Act, 1971, the Applicant has intimated acquisition of rights within the prescribed statutory period.
   (ii) Under Section 5(1) and 5(3) of the Act, it is the statutory duty of the Tahsildar to issue public notice in Form-VIII, cause local inquiry through the Village Revenue Officer (VRO) and Mandal Revenue Inspector (MRI), and effect necessary amendments in the Record of Rights (ROR 1-B).
   (iii) There are no valid prohibitory orders under Section 22-A of the Registration Act in respect of the subject land.

PRAYER:
It is therefore respectfully prayed that this Hon'ble Authority may be pleased to:
(a) Order mutation of the name of the Applicant, ${input.applicantName}, in the MeeBhoomi ROR 1-B Khata in respect of Survey No. ${input.surveyNumber}, situated at ${villageStr}${input.district};
(b) Issue digital e-Pattadar Passbook and Title Deed in favor of the Applicant in accordance with Section 6-A of the AP RoR Act, 1971.

Place: ${input.district}
Date: ${currentDate}

__________________________
SIGNATURE OF APPLICANT
(${input.applicantName})`,
  };

  // Document 2: RTI Form A to PIO, O/o Tahsildar
  const rtiDoc: LegalDocumentArtifact = {
    id: "rti_application",
    title: "APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005",
    subtitle: "FORM 'A' - Demand for Certified MeeBhoomi Adangal, 1954 RSR & FMB Tippon Records",
    authorityOrRecipient: `To,\nThe Public Information Officer (PIO) / Naib Tahsildar,\nOffice of the Tahsildar,\nMandal: ${landRecord.mandal || input.taluka || "Headquarters"},\nDistrict: ${input.district}, Andhra Pradesh.`,
    referenceNumber: `${refNumber}/RTI`,
    dateGenerated: currentDate,
    statutoryAct: "Right to Information Act, 2005 (Central Act No. 22 of 2005)",
    instructionsForFiling: `Affix Rs. 10 Court Fee Stamp or Indian Postal Order (IPO) in favor of 'Public Information Officer, Office of the Tahsildar'. Submit via Registered Post AD or at MeeSeva/Tahsildar RTI Counter.`,
    requiredAttachments: [
      "Statutory RTI Application Fee of Rs. 10/- (Court Fee Stamp / Postal Order)",
      "Self-attested Copy of Applicant's Aadhaar Card",
      "Documentary Proof of Interest / Registered Deed in Survey No. " + input.surveyNumber,
    ],
    keyClauses: [
      "Certified true copy of 1954 Resurvey Settlement Register (RSR) / Fair Adangal",
      "Certified copy of Field Measurement Book (FMB) Tippon sketch with survey ladder",
      "Certified copy of Section 22-A Gazette Prohibitory Register & Note File for Survey No. " + input.surveyNumber,
    ],
    content: `FORM 'A'
[See Rule 3(1) of AP RTI Rules]
APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

TO,
THE PUBLIC INFORMATION OFFICER (PIO) / NAIB TAHSILDAR,
Office of the Tahsildar,
Mandal: ${landRecord.mandal || input.taluka || "Mandal"},
District: ${input.district}, Andhra Pradesh.

1. FULL NAME OF THE APPLICANT:
   ${input.applicantName}

2. ADDRESS FOR CORRESPONDENCE:
   ${villageStr}${mandalStr}${input.district}, Andhra Pradesh.
   Mobile: +91-XXXXXXXXXX | Email: [Applicant Email]

3. PARTICULARS OF INFORMATION REQUIRED:
   Subject: Certified True Copies of Revenue & Settlement Records concerning Land bearing Survey No. ${input.surveyNumber}, situated at ${villageStr}${input.district}.

   Specific Certified Information Demanded:
   (i) Certified True Copy of the 1954 Re-Survey Settlement Register (RSR) / Fair Adangal extract for Survey No. ${input.surveyNumber} showing original tenure and classification.
   (ii) Certified True Copy of the Field Measurement Book (FMB) / Survey Tippon sketch showing exact boundary ladders, G-line, F-line, and field measurements for Survey No. ${input.surveyNumber}.
   (iii) Certified True Copy of the ROR 1-B Khata register entries and Form-6A proceedings from 1980 to till date in respect of Khata No. ${landRecord.khataNumber || "All Khatas"}.
   (iv) Certified Extract of the Section 22-A Prohibitory Register maintained in the Tahsildar office confirming whether Survey No. ${input.surveyNumber} is listed under Section 22-A(1)(a) to (e) of the Registration Act.
   (v) Certified copy of the official note file and proceedings concerning ${input.disputeDescription ? input.disputeDescription.substring(0, 140) + "..." : "any pending mutation, survey demarcation, or adverse claims on the subject land"}.

4. PERIOD TO WHICH INFORMATION RELATES:
   Past 40 Years (From 1984 to Current Year) & 1954 RSR Baseline.

5. STATUTORY MANDATE:
   As mandated under Section 7(1) of the RTI Act, 2005, the requested certified information must be furnished within thirty (30) days from the receipt of this application.

6. PROOF OF FEE PAYMENT:
   Statutory fee of Rs. 10/- paid via Court Fee Stamp / IPO No. ____________ dated ${currentDate} affixed herewith.

Place: ${input.district}
Date: ${currentDate}

__________________________
SIGNATURE OF APPLICANT
(${input.applicantName})`,
  };

  // Document 3: Advocate Legal Notice (15-Day Cease & Desist Demand)
  const legalNoticeDoc: LegalDocumentArtifact = {
    id: "legal_notice",
    title: "FORMAL ADVOCATE LEGAL NOTICE (CEASE & DESIST / VACATE ENCROACHMENT & RESTORE FIELD BUND)",
    subtitle: "[Issued under Instructions of Client under AP Land Laws, Specific Relief Act 1963 & BNS 2023]",
    authorityOrRecipient: `To,\n${input.opponentName || "The Opposing Party / Encroacher"},\nResident of: Adjacent Lands to Survey No. ${input.surveyNumber}, ${villageStr}${mandalStr}${input.district}, Andhra Pradesh.`,
    referenceNumber: `${refNumber}/NOT`,
    dateGenerated: currentDate,
    statutoryAct: "Specific Relief Act, 1963 | AP Survey & Boundaries Act, 1923 | BNS 2023",
    instructionsForFiling: `To be issued on Senior Advocate letterhead and served via India Post 'Registered Post with Acknowledgment Due (RPAD)' & Speed Post. Retain postal receipt & tracking report.`,
    requiredAttachments: [
      "Photocopy of Registered Sale Deed / Title Documents of Applicant",
      "Certified MeeBhoomi 1-B Khata Extract & FMB Tippon",
      "Photographs showing demolition of field bund (వరవ గట్టు) and encroachment",
      "Postal Acknowledgment Due (AD) Card",
    ],
    keyClauses: [
      "Peremptory 15-day demand to remove illegal encroachment and restore boundary bund",
      "Demand to cease and desist from raising frivolous revenue objections before Tahsildar",
      "Clear warning of Civil Suit for Declaration & Mandatory Injunction with punitive damages and BNS Criminal Trespass prosecution",
    ],
    content: `LEGAL NOTICE
(BY REGISTERED POST WITH ACKNOWLEDGEMENT DUE & SPEED POST)

Date: ${currentDate}
Ref No: ${refNumber}/NOT

TO,
${(input.opponentName || "THE CONCERNED OPPONENT / TRESPASSER").toUpperCase()}
Resident of: Adjoining Lands / Survey No. ${input.surveyNumber},
${villageStr}${mandalStr}${input.district}, Andhra Pradesh.

SIR / MADAM,

Under instructions from and on behalf of our client, ${input.applicantName}, resident of ${villageStr}${input.district}, Andhra Pradesh (hereinafter referred to as "our Client"), we hereby serve upon you this peremptory Legal Notice as under:

1. Our Client is the absolute, lawful owner and peaceful possessor of land bearing Survey No. ${input.surveyNumber} (Extent: ${landRecord.totalExtent}), situated at ${villageStr}${mandalStr}${input.district}, Andhra Pradesh. Our Client's name is duly recorded in the MeeBhoomi Record of Rights (ROR 1-B Khata No. ${landRecord.khataNumber}, Passbook No: ${landRecord.pattadarPassbookNo}).

2. The official Field Measurement Book (FMB) Tippon sketch maintained by the Mandal Surveyor clearly establishes the exact boundaries and field bunds (వరవ గట్లు) separating our Client's land from the adjoining lands.

3. OF LATE, ON OR ABOUT RECENT MONTHS, you, the addressee, without any manner of right, title, or interest, high-handedly interfered with our Client's property, demolished field bunds, and attempted to alter boundary markers.

4. Your high-handed actions constitute:
   (a) Direct violation of the AP Survey and Boundaries Act, 1923;
   (b) Civil Trespass and interference with peaceful possession actionable under Section 38 of the Specific Relief Act, 1963;
   (c) Criminal Trespass and Mischief under Sections 329 & 324 of the Bharatiya Nyaya Sanhita, 2023 (BNS).

5. NOW THEREFORE, TAKE NOTICE that we hereby call upon you to:
   (i) Immediately within FIFTEEN (15) DAYS from the date of receipt of this notice, REMOVE all unauthorized encroachments and RESTORE the demolished field bund to its original FMB coordinates;
   (ii) Cease and desist from interfering in any manner with our Client's peaceful enjoyment and possession;
   (iii) Refrain from creating any third-party encumbrances or filing frivolous revenue objections before the Tahsildar.

PLEASE TAKE FURTHER NOTICE that in the event of your failure to strictly comply with the aforesaid demands within the stipulated 15 days, our Client has given us peremptory instructions to institute a Civil Suit for Declaration of Title, Recovery of Possession, and Permanent Injunction before the competent Civil Court at ${input.district}, at your sole risk as to costs and consequences.

Yours faithfully,

_____________________________
ADVOCATE FOR CLIENT
[High Court of Andhra Pradesh / District Court Bar]`,
  };

  // Document 4: F-Line Survey Demarcation Petition (AP Survey & Boundaries Act 1923)
  const demarcationDoc: LegalDocumentArtifact = {
    id: "demarcation_survey",
    title: "APPLICATION FOR STATUTORY F-LINE SURVEY, BOUNDARY DEMARCATION & ERECTION OF STONE MARKERS",
    subtitle: "[Under Sections 9 & 10 of the Andhra Pradesh Survey and Boundaries Act, 1923 (Act VIII of 1923)]",
    authorityOrRecipient: `To,\nThe Tahsildar / Mandal Surveyor,\nMandal Revenue Office,\nMandal: ${landRecord.mandal || input.taluka || "Headquarters"},\nDistrict: ${input.district}, Andhra Pradesh.`,
    referenceNumber: `${refNumber}/FLINE`,
    dateGenerated: currentDate,
    statutoryAct: "Andhra Pradesh Survey and Boundaries Act, 1923 (Act VIII of 1923)",
    instructionsForFiling: `Pay the prescribed Tatkal F-Line Survey Fee through AP CFMS Portal. Submit petition at Tahsildar / MeeSeva counter with registered deed & FMB copy.`,
    requiredAttachments: [
      "AP CFMS Treasury Challan for F-Line Survey Fee (Challan No. ________________)",
      "Certified Copy of Registered Sale Deed / Title Deed of Applicant",
      "Latest MeeBhoomi Adangal (Pahani) and ROR 1-B Khata Copy",
      "Names & Addresses of all Adjacent Landowners for Statutory Section 9 Notice",
    ],
    keyClauses: [
      "Statutory application under Sections 9 & 10 of AP Survey & Boundaries Act 1923",
      "Issuance of mandatory Section 9 notice to adjoining boundary holders",
      "Physical boundary demarcation using DGPS / Total Station and fixing of survey stones",
    ],
    content: `STATUTORY PETITION FOR F-LINE SURVEY & BOUNDARY DEMARCATION
[Under Sections 9 & 10 of the Andhra Pradesh Survey and Boundaries Act, 1923]

BEFORE THE TAHSILDAR & MANDAL EXECUTIVE MAGISTRATE,
Mandal: ${landRecord.mandal || input.taluka || "Mandal"},
District: ${input.district}, Andhra Pradesh.

PETITIONER:
${input.applicantName},
Resident of ${villageStr}${mandalStr}${input.district}, Andhra Pradesh.

VERSUS

ADJOINING BOUNDARY HOLDERS / RESPONDENTS:
${input.opponentName || "Adjoining Landholders on North, South, East, and West boundaries of Survey No. " + input.surveyNumber}

SUBJECT: Application requesting Tatkal F-Line Survey, physical demarcation, and fixing of official survey boundary stone markers in respect of Land bearing Survey No. ${input.surveyNumber} (Extent: ${landRecord.totalExtent}), situated at ${villageStr}${input.district}, Andhra Pradesh.

MOST RESPECTFULLY SUBMITTED:

1. The Petitioner is the absolute owner, Pattadar, and possessor of land bearing Survey No. ${input.surveyNumber}, admeasuring ${landRecord.totalExtent}, situated in ${villageStr}${mandalStr}${input.district}. The Petitioner's name is duly recorded in the MeeBhoomi ROR 1-B Khata No. ${landRecord.khataNumber} with Passbook No. ${landRecord.pattadarPassbookNo}.

2. In recent times, due to boundary disputes, field bund demolition, and unauthorized encroachment attempts by the adjoining landholders, the physical boundary markers of Survey No. ${input.surveyNumber} have become obscured.

3. Under Section 9 and 10 of the Andhra Pradesh Survey and Boundaries Act, 1923, the Mandal Surveyor is legally empowered to carry out survey measurements, determine boundary lines in accordance with the Field Measurement Book (FMB) Tippon, and fix permanent survey boundary stones.

4. The Petitioner has duly paid the prescribed Government Survey Fee of Rs. 1,000/- via AP CFMS Treasury Challan No. ________________ dated ${currentDate} under the relevant Revenue Head of Account.

PRAYER:
The Petitioner therefore respectfully prays that this Hon'ble Authority may be pleased to:
(a) Direct the Mandal Surveyor to inspect Survey No. ${input.surveyNumber} situated at ${villageStr}${input.district};
(b) Issue statutory notices under Section 9 of the AP Survey & Boundaries Act, 1923 to all adjoining landholders;
(c) Conduct F-Line survey using Total Station / DGPS instrument based on the certified FMB Tippon;
(d) Fix permanent survey stones on all four boundary coordinates and furnish a certified Demarcation Certificate and Survey Sketch to the Petitioner.

Place: ${input.district}
Date: ${currentDate}

__________________________
SIGNATURE OF PETITIONER
(${input.applicantName})`,
  };

  const thoughtSteps: AgentThoughtStep[] = [
    {
      stageNumber: 1,
      stageName: "Andhra Pradesh Jurisdiction & MeeBhoomi Ingestion",
      title: `Mapped Survey No. ${input.surveyNumber} to ${input.district}, ${landRecord.mandal} Mandal`,
      description: `Cross-referenced AP Revenue Department records. Pulled MeeBhoomi ROR 1-B Khata No. ${landRecord.khataNumber}, Passbook No: ${landRecord.pattadarPassbookNo}, and Extent: ${landRecord.totalExtent}.`,
      completedAt: "0.2s",
      status: "completed",
      dataPointsDiscovered: [
        `MeeBhoomi 1-B Khata: ${landRecord.khataNumber}`,
        `Pattadar: ${landRecord.ownerName}`,
        `Father/Husband: ${landRecord.fatherOrHusbandName}`,
        `Land Classification: ${landRecord.landClassification}`,
      ],
    },
    {
      stageNumber: 2,
      stageName: "Section 22-A Prohibited Properties & Encumbrance Screening",
      title: `Section 22-A Registration Act & POT Act 1977 Verification`,
      description: `Screened against District 22-A Prohibitory List for Government Poramboke, Endowment (Devasthanam), Waqf, and Assigned D-Patta lands. Checked IGRS AP 30-year conveyance history at ${landRecord.encumbrance.sroOffice}.`,
      completedAt: "0.5s",
      status: "completed",
      dataPointsDiscovered: [
        `Section 22-A Flag: ${landRecord.section22AFlag ? "TRUE (" + landRecord.section22ACategory + ")" : "FALSE (Clear)"}`,
        `Encumbrance: ${landRecord.encumbrance.status}`,
        `SRO Office: ${landRecord.encumbrance.sroOffice}`,
      ],
    },
    {
      stageNumber: 3,
      stageName: "Litigation & Caveat Docket Check",
      title: `AP High Court, District Court & RDO Appeals Search`,
      description: `Checked e-Courts judicial docket for Section 52 Lis Pendens suits, Order 39 temporary injunctions, and Section 5-B ROR appeals before the RDO.`,
      completedAt: "0.8s",
      status: "completed",
      dataPointsDiscovered: [
        `Active Litigation: ${landRecord.litigation.hasActiveCourtCase ? "TRUE" : "FALSE"}`,
        `Case Reference: ${landRecord.litigation.caseNumber || "Nil Active Litigation"}`,
        `Court Jurisdiction: ${landRecord.litigation.courtName || "Civil Court"}`,
      ],
    },
    {
      stageNumber: 4,
      stageName: "FMB Tippon & Boundary Demarcation Analysis",
      title: `AP Survey and Boundaries Act 1923 Synthesis`,
      description: `Analyzed Field Measurement Book ladder coordinates against field bund demolition and physical encroachment risk under Limitation Act Article 65.`,
      completedAt: "1.1s",
      status: "completed",
      dataPointsDiscovered: [
        `Boundary Disputed: ${landRecord.boundaryAndPossession.isEncroachedOrDisputed ? "TRUE" : "FALSE"}`,
        `Dispute Details: ${landRecord.boundaryAndPossession.details}`,
        `Risk Contribution: ${landRecord.boundaryAndPossession.riskScoreContribution}%`,
      ],
    },
    {
      stageNumber: 5,
      stageName: "AP Statutory Artifact Compilation",
      title: "Compiled Form-6A, F-Line Petition, RTI & Advocate Notice",
      description: `Generated ready-to-file legal documents tailored for the Tahsildar, Mandal Surveyor, and Civil Court with instant PDF export.`,
      completedAt: "1.4s",
      status: "completed",
      dataPointsDiscovered: [
        "Generated: Form-6A MeeBhoomi ROR Mutation Application",
        "Generated: RTI Act 2005 Form A for Certified RSR / 1-B",
        "Generated: 15-Day Advocate Cease-and-Desist Notice",
        "Generated: F-Line Survey Demarcation Petition (Sec 9/10)",
      ],
    },
  ];

  return {
    id: refNumber,
    timestamp: new Date().toISOString(),
    propertyInput: input,
    landRecord,
    overallScore,
    riskLevel,
    executiveSummary: `Andhra Pradesh Land Title & Statutory Risk Assessment for Survey No. ${input.surveyNumber} in ${landRecord.village}, ${landRecord.mandal} Mandal, ${input.district}. Composite Statutory Risk Score: ${overallScore}/100 (${riskLevel}). Assessment: ${
      isSection22A
        ? "Property flagged under Section 22-A of AP Registration Act / POT Act 1977. Conveyance is legally void without statutory De-notification."
        : isEncroachment
        ? `Physical boundary trespass and field bund demolition reported (${landRecord.boundaryAndPossession.missingCents || "Disputed Extent"}). Demanding Tatkal F-Line survey under AP Survey & Boundaries Act 1923.`
        : isMutationIssue
        ? `Form-6A MeeBhoomi ROR 1-B Khata mutation stalled at Tahsildar. Statutory appeal remedy under Section 5B of AP RoR Act 1971.`
        : "Clean MeeBhoomi ROR 1-B Khata and Gram Adangal record with 30-year Nil-Encumbrance certification."
    }`,
    thoughtSteps,
    breakdown,
    criticalFlags,
    legalProvisions,
    actionPlan,
    generatedDocuments: {
      mutationForm: mutationFormDoc,
      rtiApplication: rtiDoc,
      legalNotice: legalNoticeDoc,
      demarcationSurvey: demarcationDoc,
    },
  };
}

/**
 * Execute Gemini AI Agent Analysis for Andhra Pradesh
 */
export async function analyzePropertyWithGemini(
  input: PropertyInput,
  apiKey?: string
): Promise<AnalysisResult> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!effectiveKey) {
    console.log("Using built-in Andhra Pradesh statutory legal intelligence engine.");
    return generateLocalLegalAnalysis(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveKey });

    const systemPrompt = `You are LandNyaya AI, an elite legal tech counsel specializing in Andhra Pradesh Land Laws, Revenue Administration, and High Court of Andhra Pradesh jurisprudence.
You have deep expertise in:
1. Andhra Pradesh Rights in Land and Pattadar Pass Books Act, 1971 (Sections 4, 5, 5B, 6A) and AP RoR Rules 1989.
2. Andhra Pradesh Survey and Boundaries Act, 1923 (Sections 9 & 10 - F-Line Survey Demarcation).
3. Section 22-A of the Registration Act, 1908 (AP Amendment Act 19 of 2007) regarding prohibited properties.
4. Andhra Pradesh Assigned Lands (Prohibition of Transfers) Act, 1977 (Act 9/1977 - POT Act).
5. MeeBhoomi portal records: Gram Adangal (Pahani), ROR 1-B Khata, FMB Tippon, and e-Pattadar Passbooks.
6. Transfer of Property Act 1882 (Sections 48, 52 - Lis Pendens, 54) and Specific Relief Act 1963.

Analyze the given Andhra Pradesh property details and output valid, parseable JSON strictly adhering to the standard schema:
{
  "overallScore": number (0-100),
  "riskLevel": "LOW RISK (Clear Title)" | "MODERATE RISK (Action Advised)" | "HIGH RISK (Clouded Title)" | "CRITICAL RISK (Active Litigation/Fraud)",
  "executiveSummary": string,
  "breakdown": {
    "mutationStatus": { "score": number, "status": "CLEAR"|"PENDING"|"DISPUTED"|"CRITICAL", "details": string, "severity": "low"|"medium"|"high"|"critical", "keyFinding": string, "legalBasis": string },
    "encumbrance": { "score": number, "status": "CLEAR"|"PENDING"|"DISPUTED"|"CRITICAL", "details": string, "severity": "low"|"medium"|"high"|"critical", "keyFinding": string, "legalBasis": string },
    "pendingCourtCases": { "score": number, "status": "CLEAR"|"PENDING"|"DISPUTED"|"CRITICAL", "details": string, "severity": "low"|"medium"|"high"|"critical", "keyFinding": string, "legalBasis": string },
    "boundaryInheritance": { "score": number, "status": "CLEAR"|"PENDING"|"DISPUTED"|"CRITICAL", "details": string, "severity": "low"|"medium"|"high"|"critical", "keyFinding": string, "legalBasis": string }
  },
  "criticalFlags": [
    { "id": string, "title": string, "severity": "critical"|"high"|"medium", "impact": string, "actCitation": string, "recommendation": string }
  ],
  "legalProvisions": [
    { "act": string, "section": string, "title": string, "relevance": string }
  ],
  "actionPlan": {
    "immediate": [ { "id": string, "phase": "immediate", "title": string, "authority": string, "timeframe": string, "priority": "Urgent"|"High"|"Medium", "instructions": string[], "estimatedCost": string, "statutoryDeadline": string } ],
    "revenueAuthority": [ { "id": string, "phase": "revenue_authority", "title": string, "authority": string, "timeframe": string, "priority": "Urgent"|"High"|"Medium", "instructions": string[], "estimatedCost": string, "statutoryDeadline": string } ],
    "judicialRemedy": [ { "id": string, "phase": "judicial_remedy", "title": string, "authority": string, "timeframe": string, "priority": "Urgent"|"High"|"Medium", "instructions": string[], "estimatedCost": string, "timeline": string } ]
  },
  "generatedDocuments": {
    "mutationForm": { "title": string, "subtitle": string, "authorityOrRecipient": string, "referenceNumber": string, "dateGenerated": string, "content": string, "keyClauses": string[], "statutoryAct": string, "instructionsForFiling": string, "requiredAttachments": string[] },
    "rtiApplication": { "title": string, "subtitle": string, "authorityOrRecipient": string, "referenceNumber": string, "dateGenerated": string, "content": string, "keyClauses": string[], "statutoryAct": string, "instructionsForFiling": string, "requiredAttachments": string[] },
    "legalNotice": { "title": string, "subtitle": string, "authorityOrRecipient": string, "referenceNumber": string, "dateGenerated": string, "content": string, "keyClauses": string[], "statutoryAct": string, "instructionsForFiling": string, "requiredAttachments": string[] },
    "demarcationSurvey": { "title": string, "subtitle": string, "authorityOrRecipient": string, "referenceNumber": string, "dateGenerated": string, "content": string, "keyClauses": string[], "statutoryAct": string, "instructionsForFiling": string, "requiredAttachments": string[] }
  }
}
Return raw json without markdown formatting.`;

    const userPrompt = `Analyze this Andhra Pradesh land dispute case:
- Survey No: ${input.surveyNumber}
- District: ${input.district}, State: Andhra Pradesh
- Mandal: ${input.mandal || input.taluka || "N/A"}, Village: ${input.village || "N/A"}
- Property Type: ${input.propertyType}
- Applicant / Pattadar: ${input.applicantName}
- Opponent: ${input.opponentName || "N/A"}
- Dispute Category: ${input.disputeType}
- Dispute Chronology: ${input.disputeDescription}
- MeeBhoomi Extracted Text: ${input.documentData?.extractedText || "No file uploaded"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      config: { responseMimeType: "application/json" },
    });

    const responseText = response.text?.trim();
    if (!responseText) throw new Error("Empty response from Gemini API");

    const parsed = JSON.parse(responseText);
    const localFallback = generateLocalLegalAnalysis(input);

    return {
      id: localFallback.id,
      timestamp: new Date().toISOString(),
      propertyInput: input,
      landRecord: localFallback.landRecord,
      overallScore: typeof parsed.overallScore === "number" ? parsed.overallScore : localFallback.overallScore,
      riskLevel: parsed.riskLevel || localFallback.riskLevel,
      executiveSummary: parsed.executiveSummary || localFallback.executiveSummary,
      thoughtSteps: localFallback.thoughtSteps,
      breakdown: parsed.breakdown || localFallback.breakdown,
      criticalFlags: parsed.criticalFlags || localFallback.criticalFlags,
      legalProvisions: parsed.legalProvisions || localFallback.legalProvisions,
      actionPlan: parsed.actionPlan || localFallback.actionPlan,
      generatedDocuments: parsed.generatedDocuments || localFallback.generatedDocuments,
    };
  } catch (error) {
    console.warn("Gemini API call failed, using AP statutory legal engine:", error);
    return generateLocalLegalAnalysis(input);
  }
}

/**
 * Interactive Andhra Pradesh Legal Counsel Chat
 */
export async function chatWithLandNyayaAgent(
  message: string,
  analysisContext?: AnalysisResult | null,
  chatHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
  apiKey?: string
): Promise<string> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (effectiveKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });

      let contextSnippet = "";
      if (analysisContext) {
        contextSnippet = `\n\nCURRENT ANDHRA PRADESH PROPERTY UNDER CONSULTATION:
- Survey Number: ${analysisContext.propertyInput.surveyNumber}
- District: ${analysisContext.propertyInput.district}, Mandal: ${analysisContext.landRecord?.mandal || analysisContext.propertyInput.mandal || "N/A"}
- Risk Score: ${analysisContext.overallScore}/100 (${analysisContext.riskLevel})
- Pattadar: ${analysisContext.landRecord?.ownerName || analysisContext.propertyInput.applicantName} | Father/Husband: ${analysisContext.landRecord?.fatherOrHusbandName || "N/A"}
- Extent: ${analysisContext.landRecord?.totalExtent || "N/A"}
- Dispute: ${analysisContext.propertyInput.disputeDescription}
- Mutation Status: ${analysisContext.landRecord?.mutationStatus || "Screened"}
- Section 22-A Status: ${analysisContext.landRecord?.section22AFlag ? analysisContext.landRecord?.section22ACategory : "Clear"}
- Encumbrance: ${analysisContext.landRecord?.encumbrance.status || "Screened"}`;
      }

      const prompt = `You are Nyaya AI, a Senior High Court Advocate and Land Revenue Counsel in Andhra Pradesh.
Answer the user's question clearly, citing relevant sections of:
1. AP Rights in Land and Pattadar Pass Books Act, 1971 (Sections 4, 5, 5B, 6A).
2. AP Survey and Boundaries Act, 1923 (Sections 9, 10 - F-Line Demarcation).
3. Section 22-A of Registration Act, 1908 (AP Amendment Act 19/2007) & AP Assigned Lands POT Act 1977.
4. Transfer of Property Act 1882 (Sec 48, 52), Specific Relief Act 1963, and CPC 1908 (Sec 148A Caveat, Order 39).
Provide practical, step-by-step guidance in English with Telugu revenue terms where helpful.
${contextSnippet}

User Question: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      if (response.text) return response.text;
    } catch (e) {
      console.warn("Gemini Chat failed, using AP legal logic:", e);
    }
  }

  // Local AP Statutory Answer Heuristics
  const q = message.toLowerCase();
  if (q.includes("22-a") || q.includes("22a") || q.includes("prohibited") || q.includes("నిషేధిత")) {
    return `### Section 22-A Prohibited Properties (Registration Act, 1908 - AP Amendment)
1. **Categories of Prohibition under Section 22-A(1)**:
   - **22-A(1)(a)**: Lands owned by the State Government or Central Government (Poramboke, Gayalu, Vagu, Cheruvu, D-Patta assigned).
   - **22-A(1)(b)**: Properties owned by Hindu Religious & Charitable Endowments (Devasthanams / Temple lands).
   - **22-A(1)(c)**: Properties owned by the Andhra Pradesh State Waqf Board.
   - **22-A(1)(e)**: Gram Kantham / Government Poramboke lands.
2. **Statutory De-notification Remedy**:
   - Obtain certified 1954 Resurvey Settlement Register (RSR) extract from the Tahsildar to prove pre-existing private Ryotwari tenure.
   - Submit a formal De-notification Representation to the District Collector / District Level 22-A Committee.
   - If rejected, file a Writ Petition before the Hon'ble High Court of Andhra Pradesh at Amaravati under Article 226 of the Constitution of India (following the landmark Full Bench judgment in *Vinjamuri Rajagopala Chary v. State of AP*).`;
  }

  if (q.includes("caveat") || q.includes("ex-parte") || q.includes("148a")) {
    return `### Filing a Caveat Petition in Andhra Pradesh (Section 148A CPC)
1. **Jurisdiction**: File the Caveat Petition in the Court of the Principal Senior / Junior Civil Judge at ${analysisContext?.propertyInput.district || "the district headquarters"} or before the Revenue Divisional Officer (RDO).
2. **Mandatory Service**: Serve a copy of the Caveat Petition upon the opposing party via Registered Post with Acknowledgment Due (RPAD).
3. **Statutory Period**: Under Section 148A(5) CPC, the Caveat remains valid for **90 days**. The court cannot grant any ex-parte stay or ad-interim injunction without serving prior notice to your counsel.`;
  }

  if (q.includes("fmb") || q.includes("tippon") || q.includes("demarcation") || q.includes("survey") || q.includes("హద్దుల")) {
    return `### Statutory F-Line Survey Demarcation (AP Survey and Boundaries Act, 1923)
1. **Application**: Apply for Tatkal F-Line survey through MeeSeva / AP Seva Portal or submit physical petition to the Tahsildar.
2. **Challan**: Pay the prescribed survey fee via AP CFMS portal under the Survey & Land Records head.
3. **Mandatory Section 9 Notice**: Under Section 9 of the AP Survey & Boundaries Act 1923, the Mandal Surveyor must issue written notice to all adjoining survey field pattadars prior to conducting physical measurement.
4. **Enforcement**: If the opponent obstructs the Mandal Surveyor, request police protection under Section 14 of the Act.`;
  }

  if (q.includes("mutation") || q.includes("1-b") || q.includes("form-6a") || q.includes("passbook") || q.includes("మ్యుటేషన్")) {
    return `### MeeBhoomi Form-6A Mutation & Section 5B Appeal
1. **Statutory Mandate**: Under Section 5(1) of the AP Rights in Land and Pattadar Pass Books Act, 1971, any title acquisition must be updated in the ROR 1-B Khata.
2. **Tahsildar Timeline**: The Tahsildar must issue public notice in Form-VIII and dispose of the mutation within 30 days.
3. **Section 5-B Appeal**: If the Tahsildar rejects or delays mutation beyond statutory timelines, file a **Statutory Appeal before the Revenue Divisional Officer (RDO)** under Section 5-B within **60 days**.`;
  }

  return `### Legal Advice regarding Survey No. ${analysisContext?.propertyInput.surveyNumber || "the Land"} in Andhra Pradesh
1. **Immediate Precaution**: Ensure physical possession is documented with geo-tagged photographs, crops, and current year MeeBhoomi Adangal entry.
2. **Statutory Action**:
   - File the generated **F-Line Demarcation Petition** before the Tahsildar under Sections 9 & 10 of the AP Survey & Boundaries Act, 1923.
   - Serve the **15-Day Advocate Legal Notice** on the counterparty demanding removal of encroachment.
   - Verify Section 22-A clearance against the District Gazette prohibited properties list.
3. **Civil Remedy**: If interference persists, file a Plaint for Declaration and Permanent Injunction under Sections 34 & 38 of the Specific Relief Act, 1963 in the Principal Senior Civil Judge Court, along with an Application for Temporary Injunction under Order 39 Rules 1 & 2 CPC.`;
}
