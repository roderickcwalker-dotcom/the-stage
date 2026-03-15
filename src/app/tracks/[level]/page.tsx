"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { PageHeader } from "@/components/layout/page-header";
import { DrillList } from "@/components/tracks/drill-list";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { SKILL_TRACKS } from "@/lib/tracks/definitions";
import type { SkillLevel } from "@/types";

export default function TrackLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = use(params);
  const track = SKILL_TRACKS[level as SkillLevel];
  const skillProgress = useLiveQuery(() =>
    db.skillProgress.where("level").equals(level).first()
  );

  if (!track) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Level not found</p>
      </div>
    );
  }

  const drillsCompleted = skillProgress?.drillsCompleted ?? 0;
  const progressPercent = (drillsCompleted / track.drills.length) * 100;

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-6 md:pb-6 md:pl-52">
        <div className="mx-auto max-w-2xl">
          <Link href="/tracks">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 gap-1 text-[var(--color-stage-text-secondary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Tracks
            </Button>
          </Link>

          <PageHeader title={track.name} subtitle={track.description} />

          {/* Progress Summary */}
          <div className="card-soft rounded-2xl bg-white p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-stage-text-secondary)]">
                {drillsCompleted}/{track.drills.length} drills completed
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: track.color }}
              >
                {Math.round(progressPercent)}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="mt-3 text-xs text-[var(--color-stage-text-muted)]">
              Level up: Complete {track.levelUpCriteria.minDrillsCompleted}{" "}
              drills with avg score {track.levelUpCriteria.minAvgScore}+
            </p>
          </div>

          {/* Drills */}
          <h3
            className="text-lg mb-4 text-[var(--color-stage-text)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Drills
          </h3>
          <DrillList
            drills={track.drills}
            bestScores={skillProgress?.bestScores ?? {}}
            color={track.color}
          />
        </div>
      </main>
    </div>
  );
}
