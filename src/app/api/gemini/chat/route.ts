import { NextRequest, NextResponse } from "next/server";
import { chatWithLandNyayaAgent } from "@/lib/gemini";
import { AnalysisResult } from "@/types/landnyaya";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, analysisContext, chatHistory, customApiKey } = body as {
      message: string;
      analysisContext?: AnalysisResult | null;
      chatHistory?: Array<{ role: "user" | "assistant"; content: string }>;
      customApiKey?: string;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const reply = await chatWithLandNyayaAgent(message, analysisContext, chatHistory, customApiKey);

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error("API /api/gemini/chat error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process chat message" },
      { status: 500 }
    );
  }
}
