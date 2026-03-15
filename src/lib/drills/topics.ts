import type { DrillType, SkillLevel } from "@/types";

const IMPROMPTU_TOPICS = [
  "Should everyone learn to code?",
  "The most underrated skill in business",
  "What makes a great leader?",
  "Explain blockchain to a 10-year-old",
  "Why failure is more valuable than success",
  "The future of remote work",
  "What would you change about education?",
  "Tell a story about a time you changed your mind",
  "The most important decision you've ever made",
  "Why first impressions matter — or don't",
  "What AI will never replace",
  "The best advice you've ever ignored",
  "Why simplicity beats complexity",
  "How to build trust in 60 seconds",
  "The difference between hearing and listening",
  "Your biggest professional lesson from this year",
  "Why storytelling is a superpower",
  "What the world needs more of right now",
  "The hardest conversation you've had to have",
  "How to stay motivated when progress is invisible",
];

const ELEVATOR_TOPICS = [
  "Pitch a coffee shop that only serves one drink",
  "Sell your favorite book to someone who hates reading",
  "Pitch a startup that teaches people to cook in 30 days",
  "Convince someone to take a sabbatical",
  "Pitch a new social media app for professionals",
  "Sell an investor on renewable energy in your city",
  "Pitch yourself for a job you're not qualified for",
  "Convince a CEO to invest in employee mental health",
  "Pitch a subscription box for personal development",
  "Sell your hometown as the best place to live",
];

const OPENING_TOPICS = [
  "You're giving a keynote on the future of AI in education",
  "You're speaking at a startup conference about resilience",
  "You're opening a TED talk about the power of vulnerability",
  "You're addressing your team after a major company failure",
  "You're giving a commencement speech at your old school",
  "You're pitching to 500 potential investors at Demo Day",
  "You're opening a workshop on creative thinking",
  "You're starting a podcast episode about overcoming fear",
  "You're speaking to high schoolers about career choices",
  "You're giving the opening remarks at an industry awards ceremony",
];

const TOPIC_POOLS: Record<DrillType, string[]> = {
  impromptu: IMPROMPTU_TOPICS,
  elevator: ELEVATOR_TOPICS,
  opening: OPENING_TOPICS,
  qa: IMPROMPTU_TOPICS, // Q&A uses impromptu topics as base
};

export function getRandomTopic(
  type: DrillType,
  _level: SkillLevel,
  exclude: string[] = []
): string {
  const pool = TOPIC_POOLS[type].filter((t) => !exclude.includes(t));
  if (pool.length === 0) return TOPIC_POOLS[type][0];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getDrillDuration(type: DrillType): number {
  const durations: Record<DrillType, number> = {
    impromptu: 60,
    elevator: 90,
    opening: 30,
    qa: 0, // open-ended
  };
  return durations[type];
}

export function getDrillLabel(type: DrillType): string {
  const labels: Record<DrillType, string> = {
    impromptu: "60-Second Impromptu",
    elevator: "Elevator Pitch",
    opening: "Opening Line",
    qa: "Q&A Simulation",
  };
  return labels[type];
}

export function getDrillDescription(type: DrillType): string {
  const descriptions: Record<DrillType, string> = {
    impromptu: "Speak for 60 seconds on a random topic. No prep, no notes.",
    elevator: "Deliver a compelling 90-second pitch on a given scenario.",
    opening: "Nail the first 30 seconds of a presentation. Hook your audience.",
    qa: "Face tough follow-up questions from an AI audience member.",
  };
  return descriptions[type];
}
