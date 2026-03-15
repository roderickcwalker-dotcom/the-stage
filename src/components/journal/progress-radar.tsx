"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { Session } from "@/types";

interface ProgressRadarProps {
  sessions: Session[];
}

export function ProgressRadar({ sessions }: ProgressRadarProps) {
  if (sessions.length === 0) return null;

  const avgScores = {
    clarity: 0,
    structure: 0,
    confidence: 0,
    engagement: 0,
    fillerControl: 0,
    overall: 0,
  };

  for (const session of sessions) {
    avgScores.clarity += session.scores.clarity;
    avgScores.structure += session.scores.structure;
    avgScores.confidence += session.scores.confidence;
    avgScores.engagement += session.scores.engagement;
    avgScores.fillerControl += session.scores.fillerControl;
    avgScores.overall += session.scores.overall;
  }

  const count = sessions.length;
  const data = [
    { dimension: "Clarity", value: +(avgScores.clarity / count).toFixed(1) },
    { dimension: "Structure", value: +(avgScores.structure / count).toFixed(1) },
    { dimension: "Confidence", value: +(avgScores.confidence / count).toFixed(1) },
    { dimension: "Engagement", value: +(avgScores.engagement / count).toFixed(1) },
    { dimension: "Filler Ctrl", value: +(avgScores.fillerControl / count).toFixed(1) },
  ];

  return (
    <div className="card-soft rounded-2xl bg-white p-6">
      <h3
        className="text-lg mb-4 text-[var(--color-stage-text)]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Skill Dimensions
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#E7E0D9" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 12, fill: "#78716C" }}
          />
          <Radar
            dataKey="value"
            stroke="#E85D3A"
            fill="#E85D3A"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ r: 4, fill: "#E85D3A" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
