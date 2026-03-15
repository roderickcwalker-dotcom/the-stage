// ── Session (Practice Arena output) ──
export interface Session {
  id?: number;
  createdAt: string;
  type: "practice" | "drill" | "qa";
  topic: string;
  transcript: string;
  audioBlob?: Blob;
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerWords: FillerInstance[];
  fillerRate: number;
  scores: SpeechScores;
  feedback: FeedbackResult;
  tags: string[];
}

export interface SpeechScores {
  clarity: number;
  structure: number;
  confidence: number;
  engagement: number;
  fillerControl: number;
  overall: number;
}

export interface FeedbackResult {
  thesisDetected: boolean;
  thesisSummary: string;
  storyVsFacts: "story-heavy" | "fact-heavy" | "balanced";
  structureEval: string;
  energyAnalysis: string;
  improvements: string[];
  strength: string;
  rawResponse: string;
}

export interface FillerInstance {
  word: string;
  position: number;
}

// ── Drill Attempt ──
export interface DrillAttempt {
  id?: number;
  sessionId?: number;
  drillType: DrillType;
  prompt: string;
  createdAt: string;
  durationSeconds: number;
  transcript: string;
  wpm: number;
  fillerCount: number;
  score: number;
  feedback: string;
}

// ── Skill Progress ──
export interface SkillProgress {
  id?: number;
  level: SkillLevel;
  status: "locked" | "active" | "completed";
  drillsCompleted: number;
  drillsTotal: number;
  unlockedAt?: string;
  completedAt?: string;
  bestScores: Record<string, number>;
}

export type SkillLevel = "foundation" | "structure" | "storytelling" | "presence" | "world-class";

// ── User Profile (single row) ──
export interface UserProfile {
  id?: number;
  currentLevel: SkillLevel;
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string;
}

// ── Drill definitions ──
export type DrillType = "impromptu" | "elevator" | "opening" | "qa";

export interface DrillDefinition {
  id: string;
  type: DrillType;
  name: string;
  description: string;
  durationSeconds: number;
  level: SkillLevel;
  criteria: string[];
}

export interface TrackDefinition {
  name: string;
  description: string;
  icon: string;
  color: string;
  drills: DrillDefinition[];
  unlockCriteria: { requiredLevel: SkillLevel } | null;
  levelUpCriteria: { minDrillsCompleted: number; minAvgScore: number };
}
