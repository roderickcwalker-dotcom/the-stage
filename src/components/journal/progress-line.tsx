"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Session } from "@/types";

interface ProgressLineProps {
  sessions: Session[];
}

export function ProgressLine({ sessions }: ProgressLineProps) {
  if (sessions.length < 2) return null;

  const data = [...sessions]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((session, i) => ({
      name: `#${i + 1}`,
      date: new Date(session.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      overall: session.scores.overall,
      clarity: session.scores.clarity,
      structure: session.scores.structure,
      confidence: session.scores.confidence,
    }));

  return (
    <div className="card-soft rounded-2xl bg-white p-6">
      <h3
        className="text-lg mb-4 text-[var(--color-stage-text)]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Score Trend
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E0D9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#A8A29E" }}
            axisLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: "#A8A29E" }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E7E0D9",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          />
          <Line
            type="monotone"
            dataKey="overall"
            stroke="#E85D3A"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#E85D3A" }}
            name="Overall"
          />
          <Line
            type="monotone"
            dataKey="clarity"
            stroke="#2563EB"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="Clarity"
          />
          <Line
            type="monotone"
            dataKey="confidence"
            stroke="#16A34A"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="Confidence"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
