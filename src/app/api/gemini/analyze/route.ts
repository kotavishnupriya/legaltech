import { NextRequest, NextResponse } from "next/server";
import { analyzePropertyWithGemini } from "@/lib/gemini";
import { PropertyInput } from "@/types/landnyaya";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyInput, customApiKey } = body as {
      propertyInput: PropertyInput;
      customApiKey?: string;
    };

    if (!propertyInput || !propertyInput.surveyNumber || !propertyInput.state || !propertyInput.district) {
      return NextResponse.json(
        { error: "Survey number, District, and State are mandatory fields." },
        { status: 400 }
      );
    }

    const result = await analyzePropertyWithGemini(propertyInput, customApiKey);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("API /api/gemini/analyze error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during property analysis" },
      { status: 500 }
    );
  }
}
