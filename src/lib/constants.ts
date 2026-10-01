import { CasePreset } from "@/types/landnyaya";

export const ANDHRA_PRADESH_DISTRICTS: string[] = [
  "NTR (Vijayawada)",
  "Visakhapatnam",
  "Guntur",
  "Tirupati",
  "Krishna (Machilipatnam)",
  "Kurnool",
  "Kakinada",
  "East Godavari (Rajahmundry)",
  "West Godavari (Bhimavaram)",
  "Eluru",
  "Dr. B.R. Ambedkar Konaseema",
  "SPS Nellore",
  "Prakasam (Ongole)",
  "Bapatla",
  "Palnadu (Narasaraopet)",
  "Chittoor",
  "Annamayya (Rayachoti)",
  "YSR Kadapa",
  "Ananthapuramu",
  "Sri Sathya Sai (Puttaparthi)",
  "Nandyal",
  "Anakapalli",
  "Vizianagaram",
  "Srikakulam",
  "Alluri Sitharama Raju (Paderu)",
  "Parvathipuram Manyam",
];

export const INDIAN_STATES_AND_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": ANDHRA_PRADESH_DISTRICTS,
  Telangana: [
    "Hyderabad",
    "Rangareddy",
    "Medchal-Malkajgiri",
    "Sangareddy",
    "Warangal",
    "Nalgonda",
    "Karimnagar",
    "Khammam",
    "Nizamabad",
    "Mahabubnagar",
  ],
  Karnataka: [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Belagavi",
    "Mangaluru (Dakshina Kannada)",
    "Hubballi-Dharwad",
    "Tumakuru",
    "Shivamogga",
  ],
  Maharashtra: [
    "Pune",
    "Mumbai Suburban",
    "Thane",
    "Nagpur",
    "Nashik",
    "Chhatrapati Sambhaji Nagar",
    "Kolhapur",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Kanchipuram",
    "Chengalpattu",
    "Tiruvallur",
    "Madurai",
  ],
};

export const CASE_PRESETS: CasePreset[] = [
  {
    id: "ap_vijayawada_encroachment",
    badge: "NTR • Encroachment (ఆక్రమణ)",
    title: "Vijayawada (Encroachment) • విజయవాడ",
    location: "Nunna, Vijayawada Rural, NTR",
    shortSummary:
      "Survey No. 142/3A: Adjacent owner demolished field bund (Gattu) and encroached 15 cents. FMB Tippon discrepancy.",
    input: {
      surveyNumber: "142/3A",
      state: "Andhra Pradesh",
      district: "NTR (Vijayawada)",
      mandal: "Vijayawada Rural",
      taluka: "Vijayawada Rural",
      village: "Nunna",
      propertyType: "Agricultural (మెట్ట / మాగాణి వ్యవసాయ భూమి)",
      disputeType: "boundary_encroachment",
      applicantName: "Venkata Satyanarayana Rao",
      opponentName: "Adjacent Landowner (Encroacher)",
      disputeDescription:
        "Owner of 2.50 Acres in Survey No. 142/3A, Nunna village, Vijayawada Rural. Adjacent owner demolished the common field bund (Gattu) and encroached 15 cents. FMB tippon coordinates mismatch. Demanding Tatkal F-Line Survey Demarcation under AP Survey & Boundaries Act 1923 and 15-Day Advocate Legal Notice.",
      documentData: {
        fileName: "MeeBhoomi_Adangal_Sy142_3A_Nunna.pdf",
        fileType: "application/pdf",
        fileSize: 1840000,
        documentType: "7_12_extract",
        extractedText:
          "AP MeeBhoomi ROR 1-B & Gram Adangal: Dist: NTR (Vijayawada), Mandal: Vijayawada Rural, Village: Nunna. Survey No: 142/3A, Khata No: 412. Extent: 2.50 Acres. Pattadar: Venkata Satyanarayana Rao. Father: Late Subba Rao. Passbook: AP-NTR-2021-99812. Status: Mutation Active. Encumbrance: Nil (Gunadala SRO). Boundary: 15 Cents encroached.",
      },
    },
  },
  {
    id: "ap_vizag_section22a",
    badge: "Vizag • Section 22-A Risk (నిషేధిత భూమి)",
    title: "Vizag (Section 22-A Fraud) • విశాఖపట్నం",
    location: "Vemulavalasa, Anandapuram, Visakhapatnam",
    shortSummary:
      "Survey No. 89/2: Classified as Section 22-A(1)(a) Assigned D-Patta Government Land. Conveyance void under POT Act 1977.",
    input: {
      surveyNumber: "89/2",
      state: "Andhra Pradesh",
      district: "Visakhapatnam",
      mandal: "Anandapuram",
      taluka: "Anandapuram",
      village: "Vemulavalasa",
      propertyType: "Assigned / D-Form Patta (అసైన్డ్ / డి-పట్టా)",
      disputeType: "section_22a_prohibited",
      applicantName: "G. Appalaraju",
      opponentName: "Tahsildar Anandapuram / O/o RDO Visakhapatnam",
      disputeDescription:
        "Tahsildar rejected mutation on Survey No. 89/2 (3.10 Acres in Vemulavalasa) citing Section 22-A(1)(a) Assigned D-Patta classification. Resumption notice issued under AP Assigned Lands (POT) Act 1977 (POT Appeal No. 18/2025 before RDO Visakhapatnam). Seeking RTI 1954 RSR verification and statutory de-notification representation.",
      documentData: {
        fileName: "MeeBhoomi_Sec22A_Sy89_2_Vemulavalasa.pdf",
        fileType: "application/pdf",
        fileSize: 1950000,
        documentType: "encumbrance_certificate",
        extractedText:
          "MeeBhoomi 1-B & SRO Anandapuram: Survey No: 89/2, Khata: 109, Vemulavalasa, Anandapuram, Visakhapatnam. Extent: 3.10 Acres. Classification: Assigned / D-Patta. Passbook: AP-VZG-D-8821. Section 22-A Flag: TRUE [Section 22-A(1)(a) Assigned D-Patta]. Litigation: POT Appeal No. 18/2025 O/o RDO Visakhapatnam.",
      },
    },
  },
  {
    id: "ap_guntur_mutation_delay",
    badge: "Guntur • Mutation Delay (మ్యుటేషన్ ఆలస్యం)",
    title: "Guntur (Stalled Mutation) • గుంటూరు",
    location: "Nowlur, Mangalagiri, Guntur",
    shortSummary:
      "Survey No. 204/C: Form-6A mutation stalled at Tahsildar for 14 months. Section 5B appeal pending before RDO Guntur.",
    input: {
      surveyNumber: "204/C",
      state: "Andhra Pradesh",
      district: "Guntur",
      mandal: "Mangalagiri",
      taluka: "Mangalagiri",
      village: "Nowlur",
      propertyType: "Agricultural (మెట్ట / మాగాణి వ్యవసాయ భూమి)",
      disputeType: "mutation_delay",
      applicantName: "Koteswara Rao & Brothers",
      opponentName: "Office of the Tahsildar, Mangalagiri",
      disputeDescription:
        "Sale deed executed 14 months ago for 1.75 Acres in Survey No. 204/C, Nowlur village. Form-6A mutation stalled at Tahsildar due to unregistered coparcener objection. Statutory appeal filed before Revenue Divisional Officer (RDO) Guntur under Section 5B of AP RoR Act 1971 (Appeal Sec 5B/2025).",
      documentData: {
        fileName: "Form6A_Mutation_Sy204_C_Nowlur.pdf",
        fileType: "application/pdf",
        fileSize: 1320000,
        documentType: "7_12_extract",
        extractedText:
          "AP MeeBhoomi Form-6A Token: MB-GNT-ROR-6632. Survey No: 204/C, Khata: 584, Nowlur, Mangalagiri, Guntur. Extent: 1.75 Acres. Pattadar: Koteswara Rao & Brothers. Status: Pending in Form-6A. Litigation: Appeal Sec 5B/2025 before RDO Guntur. Encumbrance: Nil at Mangalagiri SRO.",
      },
    },
  },
  {
    id: "ap_tirupati_cleantitle",
    badge: "Tirupati • Clean Title (స్పష్టమైన టైటిల్)",
    title: "Tirupati (100% Clean Title) • తిరుపతి",
    location: "A.Rangampeta, Chandragiri, Tirupati",
    shortSummary:
      "Survey No. 58/1: 100% Safe Title. Active e-Passbook, 35-year undisputed title, 30-year Nil Encumbrance at Chandragiri SRO.",
    input: {
      surveyNumber: "58/1",
      state: "Andhra Pradesh",
      district: "Tirupati",
      mandal: "Chandragiri",
      taluka: "Chandragiri",
      village: "A.Rangampeta",
      propertyType: "Agricultural (మెట్ట / మాగాణి వ్యవసాయ భూమి)",
      disputeType: "title_cloud_general",
      applicantName: "Smt. Padmavathamma",
      opponentName: "None (Pre-Purchase Legal Audit)",
      disputeDescription:
        "Statutory pre-purchase title audit for 1.20 Acres in Survey No. 58/1, A.Rangampeta, Chandragiri Mandal, Tirupati. Title undisputed for 35 years. Certified e-Pattadar Passbook (AP-TPT-E-PASS-44102), Nil Encumbrance for 30 years at Chandragiri SRO, and FMB boundary stones intact.",
      documentData: {
        fileName: "MeeBhoomi_1B_EC_Sy58_1_Chandragiri.pdf",
        fileType: "application/pdf",
        fileSize: 1450000,
        documentType: "general",
        extractedText:
          "AP MeeBhoomi Certified 1-B & Adangal: Survey No: 58/1, Khata: 219, A.Rangampeta, Chandragiri, Tirupati. Extent: 1.20 Acres. Pattadar: Smt. Padmavathamma. Passbook: AP-TPT-E-PASS-44102. Mutation: Sanctioned / Active (MB-TPT-CLEAR-110). 22-A Flag: FALSE. Encumbrance: Clean 30-Yrs. Litigation: None.",
      },
    },
  },
];

export const AP_LEGAL_TERMS_GLOSSARY = [
  {
    term: "MeeBhoomi (మీభూమి)",
    meaning:
      "The official Andhra Pradesh Revenue Department web portal for digital land records, Adangal (Pahani), ROR 1-B Khata extracts, FMB sketches, and e-Pattadar Passbooks.",
    context: "Government of Andhra Pradesh / CCLA",
  },
  {
    term: "Adangal / Pahani (అడంగల్ / పహాణీ)",
    meaning:
      "Village Account No. 3 maintained by the Village Revenue Officer (VRO). It records the Survey Number, Total Extent, Land Nature (Metta/Magani), Water Source, Crops grown, Pattadar Name, and the Anubhavadarudu (actual enjoyer/occupant in possession).",
    context: "AP Revenue Board Standing Orders (BSO 34)",
  },
  {
    term: "ROR 1-B Khata (1-B హక్కుల పత్రం)",
    meaning:
      "Village Account No. 4 created under Section 3 of the AP Rights in Land and Pattadar Pass Books Act, 1971. It serves as the definitive legal title ledger showing the total land holdings of a Khatedar in a revenue village.",
    context: "AP Rights in Land and Pattadar Pass Books Act, 1971 (Sec 3, 5)",
  },
  {
    term: "Section 22-A Prohibited List (సెక్షన్ 22-A నిషేధిత భూముల జాబితా)",
    meaning:
      "Section 22-A of the Registration Act, 1908 (AP Amendment). Prohibits the Sub-Registrar from registering conveyances for: (a) Government/Poramboke lands, (b) Endowment/Temple Devasthanam properties, (c) Waqf Board properties, and (d) Assigned Lands (POT Act 1977).",
    context: "Registration Act 1908 (AP Sec 22-A) & POT Act 1977",
  },
  {
    term: "FMB Tippon Sketch (ఎఫ్.ఎం.బి. ఫీల్డ్ మెజర్మెంట్ బుక్)",
    meaning:
      "The Field Measurement Book contains the official survey ladder, G-line, F-line, and offset measurements of each survey field. Used by the Mandal Surveyor under the AP Survey and Boundaries Act 1923 for boundary demarcation.",
    context: "AP Survey and Boundaries Act, 1923 (Sec 9 & 10)",
  },
  {
    term: "Form-6A Mutation (ఫారం-6A మ్యుటేషన్ దరఖాస్తు)",
    meaning:
      "Statutory application submitted to the Tahsildar under Section 5(1) of the AP Rights in Land and Pattadar Pass Books Act, 1971 for entering title acquisition (Sale Deed, Succession, Partition) into the ROR 1-B Khata.",
    context: "AP RoR Rules, 1989 (Rule 18)",
  },
  {
    term: "Pattadar vs Anubhavadarudu (పట్టాదారు vs అనుభవదారుడు)",
    meaning:
      "Pattadar is the legal title holder recorded in Column 12 of Adangal & 1-B Khata. Anubhavadarudu is the actual person in physical possession recorded in Column 13. Discrepancy between Pattadar and Anubhavadar triggers high title risk.",
    context: "MeeBhoomi Adangal Record Verification",
  },
  {
    term: "AP Assigned Lands POT Act, 1977 (అసైన్డ్ భూముల బదలాయింపు నిషేధ చట్టం)",
    meaning:
      "AP Assigned Lands (Prohibition of Transfers) Act, 1977 (Act 9/1977). Prohibits sale, mortgage, or lease of D-Form patta lands assigned to landless poor. Any transfer is void ab initio under Section 3.",
    context: "AP Act 9 of 1977 (Sec 3, 4)",
  },
  {
    term: "Gram Kantham (గ్రామ కంఠం / ఆబాదీ)",
    meaning:
      "Village site/habitation land traditionally earmarked for villagers' residences, exempt from land revenue. Not covered under standard agricultural ROR 1-B; requires Special Panchayat / Revenue NOC for transfer registration.",
    context: "AP High Court Rulings & Revenue Standing Orders",
  },
  {
    term: "RDO Appeal - Section 5-B (ఆర్.డి.ఓ. అప్పీలు)",
    meaning:
      "Any person aggrieved by an order of the Tahsildar amending or refusing to amend the ROR 1-B record may appeal within sixty (60) days to the Revenue Divisional Officer (RDO) under Section 5-B.",
    context: "AP RoR Act 1971 (Sec 5-B)",
  },
];
