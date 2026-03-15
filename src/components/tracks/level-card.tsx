"use client";

import Link from "next/link";
import {
  Target,
  LayoutList,
  BookOpen,
  Sparkles,
  Crown,
  Lock,
  Check,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SkillLevel } from "@/types";

const ICON_MAP: Record<string, typeof Target> = {
  Target,
  LayoutList,
  BookOpen,
  Sparkles,
  Crown,
};

interface LevelCardProps {
  level: SkillLevel;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: "locked" | "active" | "completed";
  drillsCompleted: number;
  drillsTotal: number;
  isCurrent: boolean;
}

export function LevelCard({
  level,
  name,
  description,
  icon,
  color,
  status,
  drillsCompleted,
  drillsTotal,
  isCurrent,
}: LevelCardProps) {
  const Icon = ICON_MAP[icon] || Target;
  const progressPercent =
    drillsTotal > 0 ? (drillsCompleted / drillsTotal) * 100 : 0;

  const content = (
    <div
      className={cn(
        "card-soft rounded-2xl bg-white p-5 relative",
        status === "locked" && "opacity-60",
        status !== "locked" && "card-hover",
        isCurrent && "ring-2 ring-[var(--color-stage-primary)]/30"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: status === "locked" ? "#F5F0ED" : `${color}14`,
          }}
        >
          {status === "locked" ? (
            <Lock className="h-5 w-5 text-[var(--color-stage-text-muted)]" />
          ) : status === "completed" ? (
            <Check className="h-5 w-5" style={{ color }} />
          ) : (
            <Icon className="h-5 w-5" style={{ color }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="text-base text-[var(--color-stage-text)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {name}
            </h3>
            {status === "completed" && (
              <Badge className="bg-[var(--color-stage-success-soft)] text-green-700 text-[10px]">
                Complete
              </Badge>
            )}
            {isCurrent && status === "active" && (
              <Badge
                className="text-[10px]"
                style={{
                  backgroundColor: `${color}14`,
                  color,
                }}
              >
                Current
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-[var(--color-stage-text-secondary)]">
            {description}
          </p>

          {status !== "locked" && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[var(--color-stage-text-muted)]">
                  {drillsCompleted}/{drillsTotal} drills
                </span>
                <span className="text-xs font-medium" style={{ color }}>
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <Progress
                value={progressPercent}
                className="h-1.5"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (status === "locked") return content;

  return <Link href={`/tracks/${level}`}>{content}</Link>;
}
