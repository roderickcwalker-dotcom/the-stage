"use client";

import Link from "next/link";
import type { DrillDefinition } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, Play } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface DrillListProps {
  drills: DrillDefinition[];
  bestScores: Record<string, number>;
  color: string;
}

export function DrillList({ drills, bestScores, color }: DrillListProps) {
  return (
    <div className="space-y-2">
      {drills.map((drill) => {
        const bestScore = bestScores[drill.id];
        const passed = bestScore !== undefined && bestScore >= 7;

        return (
          <Link
            key={drill.id}
            href="/drills"
            className="card-soft card-hover flex items-center gap-4 rounded-xl bg-white p-4"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: passed ? "#DCFCE714" : `${color}14` }}
            >
              {passed ? (
                <span className="text-sm font-bold text-green-600">
                  {bestScore}
                </span>
              ) : (
                <Play className="h-4 w-4" style={{ color }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-stage-text)]">
                  {drill.name}
                </span>
                {passed && (
                  <Badge className="bg-[var(--color-stage-success-soft)] text-green-700 text-[10px]">
                    Passed
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[var(--color-stage-text-muted)] mt-0.5">
                {drill.description}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs text-[var(--color-stage-text-muted)]">
              <Clock className="h-3 w-3" />
              {drill.durationSeconds > 0
                ? formatDuration(drill.durationSeconds)
                : "Open"}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
