/**
 * Web Speech Recognition helper for LandNyaya
 * Supports both Hindi (hi-IN) and English (en-IN / en-US)
 */

import { ANDHRA_PRADESH_DISTRICTS } from "./constants";

// District name aliases in Hindi, Telugu, and English
const DISTRICT_ALIASES: Record<string, string> = {
  // NTR / Vijayawada
  "vijayawada": "NTR (Vijayawada)",
  "ntr": "NTR (Vijayawada)",
  "विजयवाड़ा": "NTR (Vijayawada)",
  "एनटीआर": "NTR (Vijayawada)",
  "ఎన్టీఆర్": "NTR (Vijayawada)",
  "విజయవాడ": "NTR (Vijayawada)",

  // Visakhapatnam / Vizag
  "visakhapatnam": "Visakhapatnam",
  "vizag": "Visakhapatnam",
  "विशाखापत्तनम": "Visakhapatnam",
  "विजाग": "Visakhapatnam",
  "విశాఖపట్నం": "Visakhapatnam",

  // Guntur
  "guntur": "Guntur",
  "गुंटूर": "Guntur",
  "గుంటూరు": "Guntur",

  // Tirupati
  "tirupati": "Tirupati",
  "तिरुपति": "Tirupati",
  "తిరుపతి": "Tirupati",

  // Krishna / Machilipatnam
  "krishna": "Krishna",
  "machilipatnam": "Krishna",
  "कृष्णा": "Krishna",
  "मछलीपट्टनम": "Krishna",
  "కృష్ణా": "Krishna",

  // Kurnool
  "kurnool": "Kurnool",
  "कुरनूल": "Kurnool",
  "కర్నూలు": "Kurnool",

  // Kakinada
  "kakinada": "Kakinada",
  "काकीनाडा": "Kakinada",
  "కాకినాడ": "Kakinada",

  // Chittoor
  "chittoor": "Chittoor",
  "चित्तूर": "Chittoor",
  "చిత్తూరు": "Chittoor",

  // Ananthapuramu
  "anantapur": "Ananthapuramu",
  "ananthapuramu": "Ananthapuramu",
  "अनंतपुर": "Ananthapuramu",
  "అనంతపురం": "Ananthapuramu",

  // YSR Kadapa
  "kadapa": "YSR Kadapa",
  "ysr": "YSR Kadapa",
  "कडपा": "YSR Kadapa",
  "కడప": "YSR Kadapa",

  // Nellore
  "nellore": "Nellore",
  "नेल्लोर": "Nellore",
  "నెల్లూరు": "Nellore",

  // Prakasam / Ongole
  "prakasam": "Prakasam",
  "ongole": "Prakasam",
  "प्रकाशम": "Prakasam",
  "ఒంగోలు": "Prakasam",

  // West Godavari
  "west godavari": "West Godavari",
  "पश्चिम गोदावरी": "West Godavari",
  "పశ్చిమ గోదావరి": "West Godavari",

  // East Godavari
  "east godavari": "East Godavari",
  "पूर्वी गोदावरी": "East Godavari",
  "తూర్పు గోదావరి": "East Godavari",

  // Srikakulam
  "srikakulam": "Srikakulam",
  "श्रीकाकुलम": "Srikakulam",
  "శ్రీకాకుళం": "Srikakulam",

  // Vizianagaram
  "vizianagaram": "Vizianagaram",
  "विजयनगरम": "Vizianagaram",
  "విజయనగరం": "Vizianagaram",
};

// Map spoken numbers in Hindi/English to digits
const NUMBER_WORDS: Record<string, string> = {
  // English
  "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
  "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
  "ten": "10", "eleven": "11", "twelve": "12", "thirteen": "13",
  "fourteen": "14", "fifteen": "15", "twenty": "20", "thirty": "30",
  "forty": "40", "fifty": "50", "sixty": "60", "seventy": "70",
  "eighty": "80", "ninety": "90", "hundred": "00",

  // Hindi
  "शून्य": "0", "एक": "1", "दो": "2", "तीन": "3", "चार": "4",
  "पांच": "5", "छह": "6", "सात": "7", "आठ": "8", "नौ": "9",
  "दस": "10", "ग्यारह": "11", "बारह": "12", "तेरह": "13", "चौदह": "14",
  "पंद्रह": "15", "सोलह": "16", "सत्रह": "17", "अठारह": "18", "उन्नीस": "19",
  "बीस": "20", "इक्कीस": "21", "बाईस": "22", "तेईस": "23", "चौबीस": "24",
  "पच्चीस": "25", "छब्बीस": "26", "सत्ताईस": "27", "अट्ठाईस": "28", "उनतीस": "29",
  "तीस": "30", "इकतीस": "31", "बत्तीस": "32", "पैंतीस": "35", "चालीस": "40",
  "पैंतालीस": "45", "पचास": "50", "साठ": "60", "सत्तर": "70", "अस्सी": "80",
  "अठासी": "88", "नब्बे": "90", "सौ": "100",
};

/**
 * Checks if Web Speech API is supported in the current browser
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

/**
 * Parse spoken survey number string in Hindi or English into standard AP survey notation like "142/3A"
 */
export function parseSurveyNumberFromSpeech(spokenText: string): string {
  if (!spokenText) return "";

  let cleaned = spokenText.toLowerCase().trim();

  // Remove common filler words and district indicator words
  cleaned = cleaned
    .replace(/जिला|डिस्ट्रिक्ट|district|mandal|मंडल|village|ग्राम/gi, " ")
    .replace(/सर्वे नंबर|सर्वे नम्बर|सर्वे नं|सर्वे|survey number|survey no|survey|plot number|plot no|plot/gi, " ")
    .trim();

  // Replace common spoken division words: "slash", "by", "बटा", "बाय", "ऑब्लिक", "विभाग" with "/"
  cleaned = cleaned
    .replace(/\s*(बटा|बाय|ऑब्लिक|स्लैश|slash|by|divided by|oblique|\/)\s*/gi, "/")
    .replace(/\s*डैश\s*|\s*hyphen\s*|\s*minus\s*/gi, "-");

  // Replace Hindi letters: ए -> A, बी -> B, सी -> C, डी -> D
  cleaned = cleaned
    .replace(/\s*(?:ए|alpha)\s*/gi, "A")
    .replace(/\s*(?:बी|bravo)\s*/gi, "B")
    .replace(/\s*(?:सी|charlie)\s*/gi, "C")
    .replace(/\s*(?:डी|delta)\s*/gi, "D");

  // Replace any number words
  Object.keys(NUMBER_WORDS).forEach((word) => {
    const isAscii = /^[a-z0-9]+$/i.test(word);
    const regex = isAscii ? new RegExp(`\\b${word}\\b`, "gi") : new RegExp(word, "g");
    cleaned = cleaned.replace(regex, NUMBER_WORDS[word]);
  });

  // Remove extra spaces
  cleaned = cleaned.replace(/\s+/g, "").toUpperCase();

  // If there's an alphanumeric survey pattern like 142/3A, 88/1, 204B, 45-2, extract it
  const match = cleaned.match(/([0-9]+[\/-]?[0-9]*[A-D]?)/);
  if (match && match[0]) {
    return match[0];
  }

  return cleaned;
}

/**
 * Parse spoken district from Hindi / Telugu / English
 */
export function parseDistrictFromSpeech(spokenText: string): string | null {
  if (!spokenText) return null;

  const lower = spokenText.toLowerCase().trim();

  // Check aliases dictionary
  for (const [alias, officialDistrict] of Object.entries(DISTRICT_ALIASES)) {
    if (lower.includes(alias.toLowerCase())) {
      return officialDistrict;
    }
  }

  // Check direct district names list
  for (const dist of ANDHRA_PRADESH_DISTRICTS) {
    if (lower.includes(dist.toLowerCase())) {
      return dist;
    }
  }

  return null;
}

/**
 * Smart Combined Parser: Extracts both Survey Number and District from a single spoken phrase
 * Example: "सर्वे नंबर 142 बटा 3A जिला विजयवाड़ा" -> { surveyNumber: "142/3A", district: "NTR (Vijayawada)" }
 */
export function parseCombinedVoiceInput(spokenText: string): {
  surveyNumber?: string;
  district?: string;
} {
  const result: { surveyNumber?: string; district?: string } = {};

  const detectedDistrict = parseDistrictFromSpeech(spokenText);
  if (detectedDistrict) {
    result.district = detectedDistrict;
  }

  // Strip detected district name from the text to isolate survey number cleanly
  let textForSurvey = spokenText;
  if (detectedDistrict) {
    for (const [alias] of Object.entries(DISTRICT_ALIASES)) {
      if (textForSurvey.toLowerCase().includes(alias.toLowerCase())) {
        const regex = new RegExp(`\\b${alias}\\b`, "gi");
        textForSurvey = textForSurvey.replace(regex, " ");
      }
    }
  }

  const detectedSurvey = parseSurveyNumberFromSpeech(textForSurvey);
  if (detectedSurvey) {
    result.surveyNumber = detectedSurvey;
  }

  return result;
}

/**
 * Create and start a Speech Recognition instance
 */
export function startVoiceRecognition({
  language = "hi-IN",
  onResult,
  onError,
  onEnd,
}: {
  language?: string; // "hi-IN" | "en-IN" | "en-US" | "te-IN"
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: any) => void;
  onEnd: () => void;
}) {
  if (!isSpeechRecognitionSupported()) {
    onError(new Error("Web Speech API is not supported in this browser."));
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = language;

  recognition.onresult = (event: any) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      onResult(finalTranscript, true);
    } else if (interimTranscript) {
      onResult(interimTranscript, false);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn("Speech recognition error:", event.error);
    onError(event);
  };

  recognition.onend = () => {
    onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    console.error("Failed to start speech recognition:", err);
    onError(err);
    return null;
  }
}
