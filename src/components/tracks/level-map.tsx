"use client";

import { SKILL_TRACKS, LEVEL_ORDER } from "@/lib/tracks/definitions";
import { LevelCard } from "./level-card";
import type { SkillLevel, SkillProgress } from "@/types";

interface LevelMapProps {
  progressMap: Record<SkillLevel, SkillProgress | undefined>;
  currentLevel: SkillLevel;
}

export function LevelMap({ progressMap, currentLevel }: LevelMapProps) {
  return (
    <div className="relative space-y-4">
      {/* Vertical connecting line */}
      <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-[var(--border)] hidden md:block" />

      {[...LEVEL_ORDER].reverse().map((level) => {
        const track = SKILL_TRACKS[level];
        const progress = progressMap[level];
        const isLocked =
          track.unlockCriteria !== null &&
          (!progressMap[track.unlockCriteria.requiredLevel] ||
            progressMap[track.unlockCriteria.requiredLevel]?.status !== "completed");
        const status = isLocked
          ? "locked"
          : progress?.status ?? (level === "foundation" ? "active" : "locked");

        return (
          <LevelCard
            key={level}
            level={level}
            name={track.name}
            description={track.description}
            icon={track.icon}
            color={track.color}
            status={status}
            drillsCompleted={progress?.drillsCompleted ?? 0}
            drillsTotal={track.drills.length}
            isCurrent={level === currentLevel}
          />
        );
      })}
    </div>
  );
}
