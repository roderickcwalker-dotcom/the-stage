"use client";

import type { SpeechScores } from "@/types";
import { ScoreRing } from "@/components/shared/score-ring";
import { MetricPill } from "@/components/shared/metric-pill";

interface ScorecardProps {
  scores: SpeechScores;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
  durationSeconds: number;
}

export function Scorecard({
  scores,
  wpm,
  fillerCount,
  fillerRate,
  durationSeconds,
}: ScorecardProps) {
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;

  return (
    <div className="card-soft rounded-2xl bg-white p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <ScoreRing score={scores.overall} size={112} label="Overall" />

        <div className="flex-1 w-full">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <MetricPill label="Clarity" value={scores.clarity} isScore />
            <MetricPill label="Structure" value={scores.structure} isScore />
            <MetricPill label="Confidence" value={scores.confidence} isScore />
            <MetricPill label="Engagement" value={scores.engagement} isScore />
            <MetricPill
              label="Filler Control"
              value={scores.fillerControl}
              isScore
            />
            <MetricPill label="WPM" value={`${wpm}`} />
          </div>

          <div className="mt-3 flex gap-3 text-xs text-[var(--color-stage-text-muted)]">
            <span>
              {mins}m {secs}s
            </span>
            <span>{fillerCount} fillers ({fillerRate.toFixed(1)}/min)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
