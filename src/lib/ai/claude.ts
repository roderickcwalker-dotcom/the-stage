import Anthropic from "@anthropic-ai/sdk";
import type { SpeechScores, FeedbackResult } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnalysisInput {
  transcript: string;
  topic?: string;
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
}

interface AnalysisResponse {
  scores: SpeechScores;
  thesisDetected: boolean;
  thesisSummary: string;
  storyVsFacts: "story-heavy" | "fact-heavy" | "balanced";
  structureEval: string;
  energyAnalysis: string;
  improvements: string[];
  strength: string;
}

function extractJSON(text: string): string {
  // Strip ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return text;
}

function buildAnalysisPrompt(input: AnalysisInput): string {
  return `You are a world-class speaking coach analyzing a speech transcript. Be specific, actionable, and honest.

TRANSCRIPT:
${input.transcript}

${input.topic ? `TOPIC/THESIS: ${input.topic}` : ""}

METRICS (computed from audio):
- Duration: ${input.durationSeconds}s
- Word count: ${input.wordCount}
- Words per minute: ${input.wpm}
- Filler words: ${input.fillerCount} (${input.fillerRate.toFixed(1)}/min)

Analyze this speech and return ONLY valid JSON in this exact format:
{
  "scores": {
    "clarity": <1-10>,
    "structure": <1-10>,
    "confidence": <1-10>,
    "engagement": <1-10>,
    "fillerControl": <1-10>,
    "overall": <1-10>
  },
  "thesisDetected": <boolean>,
  "thesisSummary": "<one sentence summarizing the main point, or empty string if none>",
  "storyVsFacts": "<story-heavy|fact-heavy|balanced>",
  "structureEval": "<2-3 sentences evaluating the structure: opening, body, close>",
  "energyAnalysis": "<2-3 sentences evaluating confidence, energy, and language power>",
  "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"],
  "strength": "<one specific thing they did well>"
}`;
}

export async function analyzeSpeech(
  input: AnalysisInput
): Promise<{ scores: SpeechScores; feedback: FeedbackResult }> {
  const prompt = buildAnalysisPrompt(input);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed: AnalysisResponse = JSON.parse(extractJSON(text));
    return {
      scores: parsed.scores,
      feedback: {
        thesisDetected: parsed.thesisDetected,
        thesisSummary: parsed.thesisSummary,
        storyVsFacts: parsed.storyVsFacts,
        structureEval: parsed.structureEval,
        energyAnalysis: parsed.energyAnalysis,
        improvements: parsed.improvements.slice(0, 3),
        strength: parsed.strength,
        rawResponse: text,
      },
    };
  } catch {
    return {
      scores: {
        clarity: 5,
        structure: 5,
        confidence: 5,
        engagement: 5,
        fillerControl: 5,
        overall: 5,
      },
      feedback: {
        thesisDetected: false,
        thesisSummary: "",
        storyVsFacts: "balanced",
        structureEval: "Unable to analyze structure at this time.",
        energyAnalysis: "Unable to analyze energy at this time.",
        improvements: [
          "Try speaking more slowly and clearly",
          "Add a clear opening and closing",
          "Reduce filler words",
        ],
        strength: "You showed up and practiced — that's the most important step.",
        rawResponse: text,
      },
    };
  }
}

export async function generateDrillTopic(
  drillType: string,
  level: string,
  previousTopics: string[]
): Promise<{ topic: string; context: string }> {
  const avoidList =
    previousTopics.length > 0
      ? `\nAvoid these previously used topics: ${previousTopics.join(", ")}`
      : "";

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 150,
    messages: [
      {
        role: "user",
        content: `Generate a speaking drill topic for a ${drillType} exercise at the ${level} skill level.${avoidList}

Return ONLY valid JSON: {"topic": "<the topic>", "context": "<brief context or scenario>"}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  try {
    return JSON.parse(extractJSON(text));
  } catch {
    return {
      topic: "The most important lesson you've learned this year",
      context: "Share a personal insight with conviction.",
    };
  }
}

export async function streamQAResponse(
  originalTopic: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[]
) {
  return anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: `You are a tough but fair audience member at a presentation about "${originalTopic}". Ask challenging follow-up questions that test the speaker's knowledge, push them to be more specific, or challenge their assumptions. Be concise — ask ONE focused question at a time. After 3-4 rounds, provide a brief overall assessment of how well they handled the Q&A.`,
    messages: conversationHistory,
  });
}

export async function streamDetailedFeedback(
  transcript: string,
  scores: SpeechScores,
  focusArea?: string
) {
  const focusInstruction = focusArea
    ? `Focus especially on their ${focusArea} skills.`
    : "";

  return anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a world-class speaking coach giving detailed, conversational feedback. ${focusInstruction}

TRANSCRIPT:
${transcript}

SCORES: clarity=${scores.clarity}, structure=${scores.structure}, confidence=${scores.confidence}, engagement=${scores.engagement}, fillerControl=${scores.fillerControl}, overall=${scores.overall}

Give warm but honest coaching feedback. Reference specific parts of their speech. Suggest concrete exercises they can do right now to improve. Keep it conversational, like a coach talking to their student after a session.`,
      },
    ],
  });
}

export async function scoreDrillAttempt(
  drillType: string,
  prompt: string,
  transcript: string,
  durationSeconds: number
): Promise<{ score: number; feedback: string }> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Score this ${drillType} speaking drill (1-10) and give one sentence of feedback.

PROMPT: ${prompt}
TRANSCRIPT: ${transcript}
DURATION: ${durationSeconds}s

Return ONLY valid JSON: {"score": <1-10>, "feedback": "<one sentence>"}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  try {
    return JSON.parse(extractJSON(text));
  } catch {
    return { score: 5, feedback: "Keep practicing — consistency is key." };
  }
}
