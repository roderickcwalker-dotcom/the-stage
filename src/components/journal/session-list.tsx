"use client";

import { useState } from "react";
import type { Session } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { SessionDetail } from "./session-detail";
import { formatDate, formatDuration } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

interface SessionListProps {
  sessions: Session[];
  onDelete: (id: number) => void;
}

export function SessionList({ sessions, onDelete }: SessionListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Sessions Yet"
        description="Complete a practice session or drill to see your history here."
      />
    );
  }

  // Group sessions by date
  const grouped: Record<string, Session[]> = {};
  for (const session of sessions) {
    const dateKey = formatDate(session.createdAt);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(session);
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dateLabel, dateSessions]) => (
        <div key={dateLabel}>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--color-stage-text-muted)]">
            {dateLabel}
          </h3>
          <div className="space-y-2">
            {dateSessions.map((session) => (
              <div key={session.id}>
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === session.id ? null : (session.id ?? null)
                    )
                  }
                  className="w-full card-soft card-hover rounded-xl bg-white p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <ScoreRing
                      score={session.scores.overall}
                      size={48}
                      strokeWidth={4}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-stage-text)] truncate">
                          {session.topic}
                        </span>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {session.type}
                        </Badge>
                      </div>
                      <div className="mt-1 flex gap-3 text-xs text-[var(--color-stage-text-muted)]">
                        <span>{formatDuration(session.durationSeconds)}</span>
                        <span>{session.wpm} WPM</span>
                        <span>{session.fillerCount} fillers</span>
                      </div>
                    </div>
                  </div>
                </button>

                {expandedId === session.id && (
                  <SessionDetail
                    session={session}
                    onClose={() => setExpandedId(null)}
                    onDelete={() => {
                      if (session.id) onDelete(session.id);
                      setExpandedId(null);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
