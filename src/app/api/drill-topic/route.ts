import { NextResponse } from "next/server";
import { generateDrillTopic } from "@/lib/ai/claude";
import { getRandomTopic } from "@/lib/drills/topics";
import type { DrillType, SkillLevel } from "@/types";

export async function POST(request: Request) {
  try {
    const body: {
      drillType: DrillType;
      level: SkillLevel;
      previousTopics: string[];
      useAI?: boolean;
    } = await request.json();

    if (body.useAI) {
      const result = await generateDrillTopic(
        body.drillType,
        body.level,
        body.previousTopics
      );
      return NextResponse.json(result);
    }

    // Use static topic pool first
    const topic = getRandomTopic(
      body.drillType,
      body.level,
      body.previousTopics
    );
    return NextResponse.json({ topic, context: "" });
  } catch (error) {
    console.error("Topic generation error:", error);
    return NextResponse.json(
      { topic: "Tell us about something you're passionate about", context: "" },
      { status: 200 }
    );
  }
}
