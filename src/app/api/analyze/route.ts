import { NextResponse } from "next/server";
import { analyzeSpeech, type AnalysisInput } from "@/lib/ai/claude";

export async function POST(request: Request) {
  console.log("[/api/analyze] POST request received");
  try {
    const body: AnalysisInput = await request.json();
    console.log("[/api/analyze] Transcript length:", body.transcript?.length, "WPM:", body.wpm);

    if (!body.transcript || body.transcript.trim().length === 0) {
      console.log("[/api/analyze] Empty transcript, returning 400");
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    console.log("[/api/analyze] Calling Claude...");
    const result = await analyzeSpeech(body);
    console.log("[/api/analyze] Claude response received, overall score:", result.scores.overall);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/analyze] Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze speech" },
      { status: 500 }
    );
  }
}
