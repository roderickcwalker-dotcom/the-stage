import type { FillerInstance } from "@/types";

const FILLER_PATTERNS: { pattern: RegExp; word: string }[] = [
  { pattern: /\bum\b/gi, word: "um" },
  { pattern: /\buh\b/gi, word: "uh" },
  { pattern: /\byou know\b/gi, word: "you know" },
  { pattern: /\bi mean\b/gi, word: "I mean" },
  { pattern: /\bbasically\b/gi, word: "basically" },
  { pattern: /\bactually\b/gi, word: "actually" },
  { pattern: /\bliterally\b/gi, word: "literally" },
  { pattern: /\bright\b(?=\s*[,?.!]|\s+so\b|\s+and\b|\s*$)/gi, word: "right" },
  { pattern: /(?:^|[.!?]\s+)so\b/gi, word: "so" },
  { pattern: /(?:^|[.!?]\s+)like\b/gi, word: "like" },
  { pattern: /\blike,\s/gi, word: "like" },
  { pattern: /\bkind of\b/gi, word: "kind of" },
  { pattern: /\bsort of\b/gi, word: "sort of" },
];

export function analyzeFillerWords(transcript: string): {
  fillerCount: number;
  fillerWords: FillerInstance[];
} {
  const fillerWords: FillerInstance[] = [];
  const words = transcript.split(/\s+/);

  for (const { pattern, word } of FILLER_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(transcript)) !== null) {
      // Calculate word position by counting spaces before match
      const beforeMatch = transcript.slice(0, match.index);
      const position = beforeMatch.split(/\s+/).filter(Boolean).length;
      fillerWords.push({ word, position });
    }
  }

  // Sort by position
  fillerWords.sort((a, b) => a.position - b.position);

  return {
    fillerCount: fillerWords.length,
    fillerWords,
  };
}

export function calculateFillerRate(
  fillerCount: number,
  durationSeconds: number
): number {
  if (durationSeconds === 0) return 0;
  return (fillerCount / durationSeconds) * 60;
}

export function getFillerSummary(
  fillerWords: FillerInstance[]
): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const f of fillerWords) {
    summary[f.word] = (summary[f.word] || 0) + 1;
  }
  return summary;
}
