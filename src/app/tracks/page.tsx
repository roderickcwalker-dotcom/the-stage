"use client";

import { Nav } from "@/components/layout/nav";
import { PageHeader } from "@/components/layout/page-header";
import { LevelMap } from "@/components/tracks/level-map";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { SkillLevel, SkillProgress } from "@/types";
import { LEVEL_ORDER } from "@/lib/tracks/definitions";

export default function TracksPage() {
  const skillProgress = useLiveQuery(() => db.skillProgress.toArray());
  const userProfile = useLiveQuery(() => db.userProfile.toCollection().first());

  const progressMap: Record<SkillLevel, SkillProgress | undefined> = {} as Record<SkillLevel, SkillProgress | undefined>;
  for (const level of LEVEL_ORDER) {
    progressMap[level] = skillProgress?.find((sp) => sp.level === level);
  }

  const currentLevel: SkillLevel = userProfile?.currentLevel ?? "foundation";

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-6 md:pb-6 md:pl-52">
        <div className="mx-auto max-w-2xl">
          <PageHeader
            title="Skill Tracks"
            subtitle="Progress from Foundation to World Class"
          />
          <LevelMap progressMap={progressMap} currentLevel={currentLevel} />
        </div>
      </main>
    </div>
  );
}
