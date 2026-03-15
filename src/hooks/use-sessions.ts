"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { Session, DrillAttempt, UserProfile, SkillLevel } from "@/types";

export function useSessions() {
  const sessions = useLiveQuery(() =>
    db.sessions.orderBy("createdAt").reverse().toArray()
  );

  const userProfile = useLiveQuery(() => db.userProfile.toCollection().first());

  const drillAttempts = useLiveQuery(() =>
    db.drillAttempts.orderBy("createdAt").reverse().toArray()
  );

  async function saveSession(session: Omit<Session, "id">) {
    const id = await db.sessions.add(session as Session);
    await updateUserProfile(session.durationSeconds);
    return id;
  }

  async function saveDrillAttempt(attempt: Omit<DrillAttempt, "id">) {
    return db.drillAttempts.add(attempt as DrillAttempt);
  }

  async function deleteSession(id: number) {
    await db.sessions.delete(id);
  }

  async function getSessionById(id: number) {
    return db.sessions.get(id);
  }

  async function updateUserProfile(sessionDurationSeconds: number) {
    const profile = await db.userProfile.toCollection().first();
    const today = new Date().toISOString().split("T")[0];

    if (!profile) {
      await db.userProfile.add({
        currentLevel: "foundation" as SkillLevel,
        totalSessions: 1,
        totalMinutes: Math.round(sessionDurationSeconds / 60),
        currentStreak: 1,
        longestStreak: 1,
        lastSessionDate: today,
      });
      return;
    }

    const lastDate = profile.lastSessionDate;
    let newStreak = profile.currentStreak;

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    await db.userProfile.update(profile.id!, {
      totalSessions: profile.totalSessions + 1,
      totalMinutes:
        profile.totalMinutes + Math.round(sessionDurationSeconds / 60),
      currentStreak: newStreak,
      longestStreak: Math.max(profile.longestStreak, newStreak),
      lastSessionDate: today,
    });
  }

  return {
    sessions: sessions ?? [],
    userProfile: userProfile ?? null,
    drillAttempts: drillAttempts ?? [],
    saveSession,
    saveDrillAttempt,
    deleteSession,
    getSessionById,
  };
}
