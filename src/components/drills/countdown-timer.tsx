"use client";

interface CountdownTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  progress: number;
}

export function CountdownTimer({
  secondsLeft,
  totalSeconds,
  progress,
}: CountdownTimerProps) {
  const size = 120;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const strokeColor =
    secondsLeft > totalSeconds * 0.3
      ? "#16A34A"
      : secondsLeft > totalSeconds * 0.1
        ? "#F59E0B"
        : "#EF4444";

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F5F0ED"
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
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: strokeColor }}
        >
          {mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : secs}
        </span>
      </div>
      {secondsLeft <= 5 && secondsLeft > 0 && (
        <div
          className="absolute inset-0 rounded-full recording-pulse"
          style={{
            border: `2px solid ${strokeColor}30`,
          }}
        />
      )}
    </div>
  );
}
