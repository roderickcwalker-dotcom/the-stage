export type PaceCategory =
  | "too-slow"
  | "slow"
  | "conversational"
  | "brisk"
  | "too-fast";

export function calculateWPM(wordCount: number, durationSeconds: number): number {
  if (durationSeconds === 0) return 0;
  return Math.round((wordCount / durationSeconds) * 60);
}

export function getPaceCategory(wpm: number): PaceCategory {
  if (wpm < 100) return "too-slow";
  if (wpm < 120) return "slow";
  if (wpm <= 150) return "conversational";
  if (wpm <= 170) return "brisk";
  return "too-fast";
}

export function getPaceLabel(category: PaceCategory): string {
  const labels: Record<PaceCategory, string> = {
    "too-slow": "Too Slow",
    slow: "Deliberate",
    conversational: "Conversational",
    brisk: "Energetic",
    "too-fast": "Too Fast",
  };
  return labels[category];
}

export function analyzePacing(
  transcript: string,
  durationSeconds: number
): {
  wpm: number;
  wordCount: number;
  avgSentenceLength: number;
  paceCategory: PaceCategory;
} {
  const words = transcript.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wpm = calculateWPM(wordCount, durationSeconds);

  const sentences = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const avgSentenceLength =
    sentences.length > 0
      ? Math.round(wordCount / sentences.length)
      : wordCount;

  return {
    wpm,
    wordCount,
    avgSentenceLength,
    paceCategory: getPaceCategory(wpm),
  };
}
