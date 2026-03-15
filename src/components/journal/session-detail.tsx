"use client";

import type { Session } from "@/types";
import { Scorecard } from "@/components/practice/scorecard";
import { SessionSummary } from "@/components/practice/session-summary";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";

interface SessionDetailProps {
  session: Session;
  onClose: () => void;
  onDelete: () => void;
}

export function SessionDetail({
  session,
  onClose,
  onDelete,
}: SessionDetailProps) {
  return (
    <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--color-stage-bg)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-stage-text)]">
          Session Details
        </span>
        <button
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-white"
        >
          <X className="h-4 w-4 text-[var(--color-stage-text-muted)]" />
        </button>
      </div>

      <Scorecard
        scores={session.scores}
        wpm={session.wpm}
        fillerCount={session.fillerCount}
        fillerRate={session.fillerRate}
        durationSeconds={session.durationSeconds}
      />

      <SessionSummary
        feedback={session.feedback}
        fillerWords={session.fillerWords}
      />

      {/* Transcript */}
      <div className="card-soft rounded-2xl bg-white p-5">
        <h3 className="text-sm font-medium text-[var(--color-stage-text)] mb-2">
          Full Transcript
        </h3>
        <p className="text-sm text-[var(--color-stage-text-secondary)] leading-relaxed whitespace-pre-wrap">
          {session.transcript}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete Session
        </Button>
      </div>
    </div>
  );
}
