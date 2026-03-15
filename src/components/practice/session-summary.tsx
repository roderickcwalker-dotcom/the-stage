"use client";

import type { FeedbackResult, FillerInstance } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpCircle,
  CheckCircle2,
  Target,
  MessageSquare,
  BarChart3,
  Zap,
} from "lucide-react";
import { getFillerSummary } from "@/lib/analysis/filler-words";

interface SessionSummaryProps {
  feedback: FeedbackResult;
  fillerWords: FillerInstance[];
}

export function SessionSummary({
  feedback,
  fillerWords,
}: SessionSummaryProps) {
  const fillerSummary = getFillerSummary(fillerWords);

  return (
    <div className="space-y-4">
      {/* Thesis & Style */}
      <div className="card-soft rounded-2xl bg-white p-5">
        <div className="flex items-center gap-3 mb-3">
          <Target className="h-4 w-4 text-[var(--color-stage-primary)]" />
          <span className="text-sm font-medium text-[var(--color-stage-text)]">
            Thesis
          </span>
          <Badge
            variant={feedback.thesisDetected ? "default" : "secondary"}
            className={
              feedback.thesisDetected
                ? "bg-[var(--color-stage-success-soft)] text-green-700"
                : ""
            }
          >
            {feedback.thesisDetected ? "Detected" : "Not Clear"}
          </Badge>
          <Badge variant="outline">{feedback.storyVsFacts}</Badge>
        </div>
        {feedback.thesisSummary && (
          <p className="text-sm text-[var(--color-stage-text-secondary)] italic">
            &ldquo;{feedback.thesisSummary}&rdquo;
          </p>
        )}
      </div>

      {/* Structure */}
      <div className="card-soft rounded-2xl bg-white p-5">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-4 w-4 text-[var(--color-stage-accent-blue)]" />
          <span className="text-sm font-medium text-[var(--color-stage-text)]">
            Structure
          </span>
        </div>
        <p className="text-sm text-[var(--color-stage-text-secondary)] leading-relaxed">
          {feedback.structureEval}
        </p>
      </div>

      {/* Energy */}
      <div className="card-soft rounded-2xl bg-white p-5">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-[var(--color-stage-warning)]" />
          <span className="text-sm font-medium text-[var(--color-stage-text)]">
            Energy & Confidence
          </span>
        </div>
        <p className="text-sm text-[var(--color-stage-text-secondary)] leading-relaxed">
          {feedback.energyAnalysis}
        </p>
      </div>

      {/* Filler Words Breakdown */}
      {fillerWords.length > 0 && (
        <div className="card-soft rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-[var(--color-stage-text-muted)]" />
            <span className="text-sm font-medium text-[var(--color-stage-text)]">
              Filler Words
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(fillerSummary).map(([word, count]) => (
              <span
                key={word}
                className="rounded-lg bg-[var(--color-stage-danger-soft)] px-3 py-1 text-xs font-medium text-red-700"
              >
                &ldquo;{word}&rdquo; &times; {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      <div className="card-soft rounded-2xl bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUpCircle className="h-4 w-4 text-[var(--color-stage-primary)]" />
          <span className="text-sm font-medium text-[var(--color-stage-text)]">
            3 Things to Improve
          </span>
        </div>
        <ol className="space-y-2">
          {feedback.improvements.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm text-[var(--color-stage-text-secondary)]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-stage-soft)] text-xs font-bold text-[var(--color-stage-primary)]">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </div>

      {/* Strength */}
      <div className="rounded-2xl border-2 border-[var(--color-stage-success)]/20 bg-[var(--color-stage-success-soft)] p-5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-stage-success)]" />
          <span className="text-sm font-medium text-green-800">
            What You Did Well
          </span>
        </div>
        <p className="text-sm text-green-700 leading-relaxed">
          {feedback.strength}
        </p>
      </div>
    </div>
  );
}
