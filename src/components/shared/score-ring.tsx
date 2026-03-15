"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ScoreRing({
  score,
  size = 96,
  strokeWidth = 6,
  label,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const strokeColor =
    score >= 8
      ? "var(--color-stage-success)"
      : score >= 5
        ? "var(--color-stage-warning)"
        : "var(--color-stage-danger)";

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-stage-bg)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-2xl font-bold"
            style={{ color: strokeColor }}
          >
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-[var(--color-stage-text-muted)]">
          {label}
        </span>
      )}
    </div>
  );
}
