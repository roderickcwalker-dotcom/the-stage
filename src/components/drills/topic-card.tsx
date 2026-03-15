"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopicCardProps {
  topic: string;
  context?: string;
  onNewTopic: () => void;
  disabled?: boolean;
}

export function TopicCard({
  topic,
  context,
  onNewTopic,
  disabled,
}: TopicCardProps) {
  return (
    <div className="card-soft rounded-2xl bg-white p-6 text-center">
      <p
        className="text-xl text-[var(--color-stage-text)] leading-snug"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {topic}
      </p>
      {context && (
        <p className="mt-2 text-sm text-[var(--color-stage-text-muted)]">
          {context}
        </p>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNewTopic}
        disabled={disabled}
        className="mt-4 gap-2 text-[var(--color-stage-text-secondary)]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        New Topic
      </Button>
    </div>
  );
}
