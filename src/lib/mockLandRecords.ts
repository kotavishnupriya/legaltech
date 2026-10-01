import { LandRecord } from "@/types/landnyaya";

export const AP_LAND_DATABASE: Record<string, LandRecord> = {
  // Scenario 1: NTR / Vijayawada Rural - Encroachment & Bund Destruction
  '142/3A': {
    surveyNumber: '142/3A',
    state: 'Andhra Pradesh',
    district: 'NTR (Vijayawada)',
    mandal: 'Vijayawada Rural',
    village: 'Nunna',
    ownerName: 'Venkata Satyanarayana Rao',
    fatherOrHusbandName: 'Late Subba Rao',
    totalExtent: '2.50 Acres',
    landClassification: 'Agricultural (Dry/Wet)',
    portalSource: 'AP MeeBhoomi ROR 1-B & Gram Adangal',
    khataNumber: '412',
    pattadarPassbookNo: 'AP-NTR-2021-99812',
    mutationStatus: 'Sanctioned / Active',
    mutationDetails: {
      status: 'Sanctioned / Active',
      tokenNo: 'MB-NTR-2022-771',
      remarks: 'Title mutated in 1-B Khata. No objections on revenue entry.',
      riskScoreContribution: 15,
    },
    encumbrance: {
      isEncumbered: false,
      status: 'Clean (Nil Encumbrance 30-Yrs)',
      details: 'Nil Encumbrance certificate verified at Gunadala SRO for 30 years.',
      sroOffice: 'Sub-Registrar Office, Gunadala',
      riskScoreContribution: 15,
    },
    litigation: {
      hasActiveCourtCase: false,
      details: 'No pending civil suits in Vijayawada Senior Civil Judge Court.',
      riskScoreContribution: 10,
    },
    boundaryAndPossession: {
      isEncroachedOrDisputed: true,
      details: 'Adjacent owner demolished the field bund (Gattu) and encroached 15 cents. Discrepancy with FMB tippon.',
      missingCents: '15 Cents',
      riskScoreContribution: 88,
    },
    section22AFlag: false,
    compositeRiskScore: 74,
    riskCategory: 'High Risk (Clouded Title)',
  },

  // Scenario 2: Visakhapatnam - Section 22-A Prohibited Land Fraud
  '89/2': {
    surveyNumber: '89/2',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    mandal: 'Anandapuram',
    village: 'Vemulavalasa',
    ownerName: 'G. Appalaraju',
    fatherOrHusbandName: 'Chinna Ramaswamy',
    totalExtent: '3.10 Acres',
    landClassification: 'Assigned / D-Patta',
    portalSource: 'AP MeeBhoomi ROR 1-B & Gram Adangal',
    khataNumber: '109',
    pattadarPassbookNo: 'AP-VZG-D-8821',
    mutationStatus: 'Rejected / Stalled',
    mutationDetails: {
      status: 'Rejected / Stalled',
      tokenNo: 'MB-VZG-22A-401',
      remarks: 'Tahsildar rejected mutation. Land classified as D-Patta assigned government land.',
      riskScoreContribution: 95,
    },
    encumbrance: {
      isEncumbered: true,
      status: 'Lis Pendens / SRO Charge',
      details: 'Prohibited property under Section 22-A(1)(a) of AP Registration Act. Conveyance legally void.',
      sroOffice: 'Sub-Registrar Office, Anandapuram',
      riskScoreContribution: 100,
    },
    litigation: {
      hasActiveCourtCase: true,
      caseNumber: 'POT Appeal No. 18/2025',
      courtName: 'O/o Revenue Divisional Officer (RDO), Visakhapatnam',
      suitType: 'AP Assigned Lands (Prohibition of Transfers) Act 1977',
      details: 'Resumption notice issued by Tahsildar to restore land back to the Government.',
      riskScoreContribution: 95,
    },
    boundaryAndPossession: {
      isEncroachedOrDisputed: true,
      details: 'Revenue Inspector marked boundary with Government Poramboke caution board.',
      riskScoreContribution: 90,
    },
    section22AFlag: true,
    section22ACategory: 'Section 22-A(1)(a) Assigned D-Patta',
    compositeRiskScore: 95,
    riskCategory: 'Critical Risk (Void Under Law)',
  },

  // Scenario 3: Guntur - Stalled Mutation under AP RoR Act Sec 5
  '204/C': {
    surveyNumber: '204/C',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    mandal: 'Mangalagiri',
    village: 'Nowlur',
    ownerName: 'Koteswara Rao & Brothers',
    fatherOrHusbandName: 'Late Sambasiva Rao',
    totalExtent: '1.75 Acres',
    landClassification: 'Agricultural (Dry/Wet)',
    portalSource: 'AP MeeBhoomi ROR 1-B & Gram Adangal',
    khataNumber: '584',
    pattadarPassbookNo: 'Pending Passbook Issuance',
    mutationStatus: 'Pending in Form-6A',
    mutationDetails: {
      status: 'Pending in Form-6A',
      tokenNo: 'MB-GNT-ROR-6632',
      remarks: 'Sale deed executed 14 months ago. Mutation stalled at Tahsildar due to unregistered coparcener objection.',
      riskScoreContribution: 72,
    },
    encumbrance: {
      isEncumbered: false,
      status: 'Clean (Nil Encumbrance 30-Yrs)',
      details: 'Nil Encumbrance recorded in Mangalagiri SRO.',
      sroOffice: 'Sub-Registrar Office, Mangalagiri',
      riskScoreContribution: 30,
    },
    litigation: {
      hasActiveCourtCase: true,
      caseNumber: 'Appeal Sec 5B/2025',
      courtName: 'Revenue Divisional Officer (RDO) Guntur',
      suitType: 'AP RoR Act 1971 Section 5B Statutory Appeal',
      details: 'Appeal filed against Tahsildars inaction on Form-6A application.',
      riskScoreContribution: 65,
    },
    boundaryAndPossession: {
      isEncroachedOrDisputed: false,
      details: 'Physical possession clear. Cultivation recorded in Adangal.',
      riskScoreContribution: 20,
    },
    section22AFlag: false,
    compositeRiskScore: 62,
    riskCategory: 'High Risk (Clouded Title)',
  },

  // Scenario 4: Tirupati - 100% Clean Title
  '58/1': {
    surveyNumber: '58/1',
    state: 'Andhra Pradesh',
    district: 'Tirupati',
    mandal: 'Chandragiri',
    village: 'A.Rangampeta',
    ownerName: 'Smt. Padmavathamma',
    fatherOrHusbandName: 'R. Krishna Murthy',
    totalExtent: '1.20 Acres',
    landClassification: 'Agricultural (Dry/Wet)',
    portalSource: 'AP MeeBhoomi ROR 1-B & Gram Adangal',
    khataNumber: '219',
    pattadarPassbookNo: 'AP-TPT-E-PASS-44102',
    mutationStatus: 'Sanctioned / Active',
    mutationDetails: {
      status: 'Sanctioned / Active',
      tokenNo: 'MB-TPT-CLEAR-110',
      remarks: 'Clean e-Pattadar Passbook active in MeeBhoomi. Title undisputed for 35 years.',
      riskScoreContribution: 5,
    },
    encumbrance: {
      isEncumbered: false,
      status: 'Clean (Nil Encumbrance 30-Yrs)',
      details: '30-year search shows Nil Encumbrance at Chandragiri SRO.',
      sroOffice: 'Sub-Registrar Office, Chandragiri',
      riskScoreContribution: 5,
    },
    litigation: {
      hasActiveCourtCase: false,
      details: 'Zero pending civil or revenue suits.',
      riskScoreContribution: 5,
    },
    boundaryAndPossession: {
      isEncroachedOrDisputed: false,
      details: 'FMB boundary stones intact and verified with Mandal Surveyor tippon.',
      riskScoreContribution: 5,
    },
    section22AFlag: false,
    compositeRiskScore: 10,
    riskCategory: 'Safe Title (Marketable)',
  }
};

// Fallback generator for ANY custom survey number entered in AP
export function fetchAPLandRecord(surveyNo: string, district?: string): LandRecord {
  const cleanSurvey = (surveyNo || '142/3A').trim().toUpperCase();

  if (AP_LAND_DATABASE[cleanSurvey]) {
    return AP_LAND_DATABASE[cleanSurvey];
  }

  // Deterministic fallback generator for custom survey numbers
  const hash = cleanSurvey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isRisky = hash % 3 === 0;

  return {
    surveyNumber: cleanSurvey,
    state: 'Andhra Pradesh',
    district: district || 'Krishna',
    mandal: 'Mandal Revenue Circle 1',
    village: 'Kankipadu',
    ownerName: isRisky ? 'R. Sambasiva Rao & Heirs' : 'Smt. Lakshmi Devi',
    fatherOrHusbandName: 'Late Venkateswarlu',
    totalExtent: `${(hash % 3 + 1)}.${(hash % 80 + 10)} Acres`,
    landClassification: 'Agricultural (Dry/Wet)',
    portalSource: 'AP MeeBhoomi ROR 1-B & Gram Adangal',
    khataNumber: `${hash % 500 + 100}`,
    pattadarPassbookNo: `AP-ROR-2024-${hash % 90000 + 10000}`,
    mutationStatus: isRisky ? 'Pending in Form-6A' : 'Sanctioned / Active',
    mutationDetails: {
      status: isRisky ? 'Pending in Form-6A' : 'Sanctioned / Active',
      remarks: isRisky
        ? 'Mutation entry awaiting 15-day objection clearance from Village Revenue Officer (VRO).'
        : 'Active Pattadar Passbook with clear MeeBhoomi 1-B entry.',
      riskScoreContribution: isRisky ? 60 : 10,
    },
    encumbrance: {
      isEncumbered: false,
      status: 'Clean (Nil Encumbrance 30-Yrs)',
      details: 'Nil Encumbrance recorded for 30 years in jurisdictional SRO.',
      sroOffice: 'Sub-Registrar Office',
      riskScoreContribution: 10,
    },
    litigation: {
      hasActiveCourtCase: isRisky,
      details: isRisky ? 'Adversarial representation before Tahsildar.' : 'No pending court records.',
      riskScoreContribution: isRisky ? 55 : 5,
    },
    boundaryAndPossession: {
      isEncroachedOrDisputed: isRisky,
      details: isRisky ? 'Boundary bund alteration reported by neighbor.' : 'Peaceful continuous possession verified in Adangal.',
      riskScoreContribution: isRisky ? 75 : 10,
    },
    section22AFlag: false,
    compositeRiskScore: isRisky ? 68 : 12,
    riskCategory: isRisky ? 'High Risk (Clouded Title)' : 'Safe Title (Marketable)',
  };
}

/**
 * Backward compatibility alias for generateMockLandRecord
 */
export function generateMockLandRecord(
  surveyNumber: string,
  state: string = "Andhra Pradesh",
  district: string = "NTR (Vijayawada)",
  mandalInput?: string,
  villageInput?: string
): LandRecord {
  const record = fetchAPLandRecord(surveyNumber, district);
  if (mandalInput) record.mandal = mandalInput;
  if (villageInput) record.village = villageInput;
  return record;
}

/**
 * Quick Test Samples matching the 4 core AP scenarios
 */
export const SAMPLE_SURVEY_NUMBERS = [
  {
    state: "Andhra Pradesh" as const,
    district: "NTR (Vijayawada)",
    mandal: "Vijayawada Rural",
    village: "Nunna",
    survey: "142/3A",
    tag: "Vijayawada (Encroachment & Bund Destruction) • హద్దుల ఆక్రమణ",
  },
  {
    state: "Andhra Pradesh" as const,
    district: "Visakhapatnam",
    mandal: "Anandapuram",
    village: "Vemulavalasa",
    survey: "89/2",
    tag: "Vizag (Section 22-A Assigned Land Fraud) • సెక్షన్ 22-A",
  },
  {
    state: "Andhra Pradesh" as const,
    district: "Guntur",
    mandal: "Mangalagiri",
    village: "Nowlur",
    survey: "204/C",
    tag: "Guntur (Stalled Form-6A Mutation) • ఫారం-6A ఆలస్యం",
  },
  {
    state: "Andhra Pradesh" as const,
    district: "Tirupati",
    mandal: "Chandragiri",
    village: "A.Rangampeta",
    survey: "58/1",
    tag: "Tirupati (100% Clean Marketable Title) • స్పష్టమైన టైటిల్",
  },
];
