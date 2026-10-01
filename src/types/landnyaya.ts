export type PropertyType =
  | "Agricultural (మెట్ట / మాగాణి వ్యవసాయ భూమి)"
  | "Residential Plot / Layout (నివాస స్థలం)"
  | "Commercial / Industrial (వాణిజ్య / పారిశ్రామిక)"
  | "Ancestral / Coparcenary (పూర్వీకుల ఆస్తి)"
  | "Assigned / D-Form Patta (అసైన్డ్ / డి-పట్టా)"
  | "Gram Kantham / Abadi (గ్రామ కంఠం)"
  | "Endowment / Temple / Inam (దేవాదాయ / ఇనామ్ భూమి)";

export type DisputeType =
  | "boundary_encroachment"
  | "mutation_delay"
  | "section_22a_prohibited"
  | "double_sale_fraud"
  | "inheritance_partition"
  | "gram_kantham_conversion"
  | "unauthorized_possession"
  | "illegal_mortgage_lien"
  | "title_cloud_general";

export interface Section22ADetails {
  isProhibited: boolean;
  status:
    | "Clear (No 22-A Prohibition)"
    | "Prohibited - 22-A(1)(a) Govt / Poramboke"
    | "Prohibited - 22-A(1)(b) Endowment / Devasthanam"
    | "Prohibited - 22-A(1)(c) Waqf Board"
    | "Prohibited - 22-A(1)(d) Assigned Land (POT Act 1977)"
    | "Flagged - Gram Kantham (Abadi / Settlement)"
    | "Flagged - Inam Abolition Dispute";
  categoryCode?: string; // "22-A(1)(a)", "22-A(1)(b)", "22-A(1)(c)", "22-A(1)(d)"
  prohibitionReason?: string;
  notifyingAuthority?: string; // "Collector & District Magistrate", "Commissioner of Endowments", "Tahsildar"
  gazetteNotificationRef?: string;
}

export interface LandRecord {
  surveyNumber: string;
  state: 'Andhra Pradesh';
  district: string;
  mandal: string;
  village: string;
  ownerName: string;
  fatherOrHusbandName: string;
  totalExtent: string; // e.g., "2.40 Acres" or "1.15 Cents"
  landClassification: 'Agricultural (Dry/Wet)' | 'Gram Kantham / Abadi' | 'Assigned / D-Patta' | 'Endowments / Temple Land';
  portalSource: 'AP MeeBhoomi ROR 1-B & Gram Adangal';
  khataNumber: string;
  pattadarPassbookNo: string;
  
  // 4 Core Statutory Pillars
  mutationStatus: 'Sanctioned / Active' | 'Pending in Form-6A' | 'Rejected / Stalled';
  mutationDetails: {
    status: 'Sanctioned / Active' | 'Pending in Form-6A' | 'Rejected / Stalled';
    tokenNo?: string;
    remarks: string;
    riskScoreContribution: number; // 0-100
  };
  
  encumbrance: {
    isEncumbered: boolean;
    status: 'Clean (Nil Encumbrance 30-Yrs)' | 'Active Primary Agricultural Co-op Mortgage' | 'Lis Pendens / SRO Charge';
    details: string;
    sroOffice: string;
    riskScoreContribution: number; // 0-100
  };

  litigation: {
    hasActiveCourtCase: boolean;
    caseNumber?: string;
    courtName?: string;
    suitType?: string;
    details: string;
    riskScoreContribution: number; // 0-100
  };

  boundaryAndPossession: {
    isEncroachedOrDisputed: boolean;
    details: string;
    missingCents?: string;
    riskScoreContribution: number; // 0-100
  };

  // AP Section 22-A Check
  section22AFlag: boolean;
  section22ACategory?: 'Section 22-A(1)(a) Assigned D-Patta' | 'Section 22-A(1)(c) Endowments / Waqf' | 'Section 22-A(1)(e) Gram Kantham / Govt Poramboke';
  
  compositeRiskScore: number; // 0 - 100
  riskCategory: 'Safe Title (Marketable)' | 'Medium Risk (Caution Advised)' | 'High Risk (Clouded Title)' | 'Critical Risk (Void Under Law)';
}

export interface PropertyInput {
  surveyNumber: string;
  state: string; // "Andhra Pradesh"
  district: string;
  mandal?: string;
  taluka?: string; // Alias for mandal
  village?: string;
  propertyType: PropertyType;
  applicantName: string;
  opponentName?: string;
  disputeType: DisputeType;
  disputeDescription?: string;
  landRecord?: LandRecord;
  documentData?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    extractedText?: string;
    documentType?: "7_12_extract" | "khatiyan" | "sale_deed" | "encumbrance_certificate" | "patta_rtc" | "general";
  };
}

export interface FactorBreakdownItem {
  score: number; // 0-100 risk contribution for this factor
  status: "CLEAR" | "PENDING" | "DISPUTED" | "CRITICAL";
  details: string;
  severity: "low" | "medium" | "high" | "critical";
  keyFinding: string;
  legalBasis: string;
}

export interface RiskAssessmentBreakdown {
  mutationStatus: FactorBreakdownItem;
  encumbrance: FactorBreakdownItem;
  pendingCourtCases: FactorBreakdownItem;
  boundaryInheritance: FactorBreakdownItem;
}

export interface CriticalFlag {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium";
  impact: string;
  actCitation: string;
  recommendation: string;
}

export interface LegalProvision {
  act: string;
  section: string;
  title: string;
  relevance: string;
}

export interface ActionPlanStep {
  id: string;
  phase: "immediate" | "revenue_authority" | "judicial_remedy";
  title: string;
  authority: string;
  timeframe: string;
  priority: "Urgent" | "High" | "Medium";
  instructions: string[];
  estimatedCost?: string;
  statutoryDeadline?: string;
  timeline?: string;
  isCompleted?: boolean;
}

export interface LegalDocumentArtifact {
  id: "mutation_form" | "rti_application" | "legal_notice" | "demarcation_survey";
  title: string;
  subtitle: string;
  authorityOrRecipient: string;
  referenceNumber: string;
  dateGenerated: string;
  content: string;
  keyClauses: string[];
  statutoryAct: string;
  instructionsForFiling: string;
  requiredAttachments: string[];
}

export interface AgentThoughtStep {
  stageNumber: number;
  stageName: string;
  title: string;
  description: string;
  completedAt?: string;
  status: "pending" | "analyzing" | "completed";
  dataPointsDiscovered?: string[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  propertyInput: PropertyInput;
  landRecord?: LandRecord;
  overallScore: number; // 0 to 100 (0 = Clean/Safe, 100 = Critical Dispute/Risk)
  riskLevel: "LOW RISK (Clear Title)" | "MODERATE RISK (Action Advised)" | "HIGH RISK (Clouded Title)" | "CRITICAL RISK (Active Litigation/Fraud)";
  executiveSummary: string;
  thoughtSteps: AgentThoughtStep[];
  breakdown: RiskAssessmentBreakdown;
  criticalFlags: CriticalFlag[];
  legalProvisions: LegalProvision[];
  actionPlan: {
    immediate: ActionPlanStep[];
    revenueAuthority: ActionPlanStep[];
    judicialRemedy: ActionPlanStep[];
  };
  generatedDocuments: {
    mutationForm: LegalDocumentArtifact;
    rtiApplication: LegalDocumentArtifact;
    legalNotice: LegalDocumentArtifact;
    demarcationSurvey: LegalDocumentArtifact;
  };
}

export interface CasePreset {
  id: string;
  badge: string;
  title: string;
  location: string;
  shortSummary: string;
  input: PropertyInput;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  citations?: string[];
}
