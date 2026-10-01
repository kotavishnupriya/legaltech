import { NextRequest, NextResponse } from "next/server";
import { fetchAPLandRecord } from "@/lib/mockLandRecords";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const surveyNumber = searchParams.get("surveyNumber") || searchParams.get("survey") || "142/3A";
    const district = searchParams.get("district") || "NTR (Vijayawada)";
    const mandal = searchParams.get("mandal") || searchParams.get("taluka") || undefined;
    const village = searchParams.get("village") || undefined;

    const record = fetchAPLandRecord(surveyNumber, district);
    if (mandal) record.mandal = mandal;
    if (village) record.village = village;

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error("Error in /api/records/lookup:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to lookup AP MeeBhoomi land record" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { surveyNumber, district, mandal, taluka, village } = body;

    if (!surveyNumber) {
      return NextResponse.json(
        { error: "Survey Number is required." },
        { status: 400 }
      );
    }

    const record = fetchAPLandRecord(surveyNumber, district || "NTR (Vijayawada)");
    if (mandal || taluka) record.mandal = mandal || taluka;
    if (village) record.village = village;

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error("Error in /api/records/lookup POST:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch AP land record" },
      { status: 500 }
    );
  }
}
