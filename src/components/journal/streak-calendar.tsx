"use client";

import type { Session } from "@/types";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface StreakCalendarProps {
  sessions: Session[];
  currentStreak: number;
  longestStreak: number;
}

export function StreakCalendar({
  sessions,
  currentStreak,
  longestStreak,
}: StreakCalendarProps) {
  // Build a map of dates to session counts (last 90 days)
  const sessionDates = new Map<string, number>();
  for (const session of sessions) {
    const date = session.createdAt.split("T")[0];
    sessionDates.set(date, (sessionDates.get(date) || 0) + 1);
  }

  // Generate last 90 days
  const days: { date: string; count: number; dayOfWeek: number }[] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    days.push({
      date: dateStr,
      count: sessionDates.get(dateStr) || 0,
      dayOfWeek: date.getDay(),
    });
  }

  // Group into weeks
  const weeks: typeof days[] = [];
  let currentWeek: typeof days = [];
  for (const day of days) {
    if (day.dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="card-soft rounded-2xl bg-white p-6">
      {/* Streak stats */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-stage-soft)]">
            <Flame className="h-5 w-5 text-[var(--color-stage-primary)]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--color-stage-text)]">
              {currentStreak}
            </div>
            <div className="text-xs text-[var(--color-stage-text-muted)]">
              Current streak
            </div>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[var(--color-stage-text)]">
            {longestStreak}
          </div>
          <div className="text-xs text-[var(--color-stage-text-muted)]">
            Best streak
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
                className={cn(
                  "h-3 w-3 rounded-sm",
                  day.count === 0
                    ? "bg-[var(--color-stage-bg)]"
                    : day.count === 1
                      ? "bg-[var(--color-stage-primary)]/40"
                      : day.count === 2
                        ? "bg-[var(--color-stage-primary)]/70"
                        : "bg-[var(--color-stage-primary)]"
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-stage-text-muted)]">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-[var(--color-stage-bg)]" />
          <div className="h-3 w-3 rounded-sm bg-[var(--color-stage-primary)]/40" />
          <div className="h-3 w-3 rounded-sm bg-[var(--color-stage-primary)]/70" />
          <div className="h-3 w-3 rounded-sm bg-[var(--color-stage-primary)]" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
