"use client";

import { useRef, useEffect } from "react";

interface LiveTranscriptProps {
  transcript: string;
  interimTranscript: string;
  wordCount: number;
}

export function LiveTranscript({
  transcript,
  interimTranscript,
  wordCount,
}: LiveTranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-40 overflow-y-auto rounded-xl border border-[var(--border)] bg-white p-4 text-sm leading-relaxed text-[var(--color-stage-text)]"
      >
        {transcript || interimTranscript ? (
          <>
            <span>{transcript}</span>
            {interimTranscript && (
              <span className="text-[var(--color-stage-text-muted)]">
                {interimTranscript}
              </span>
            )}
          </>
        ) : (
          <span className="text-[var(--color-stage-text-muted)]">
            Start speaking and your words will appear here...
          </span>
        )}
      </div>
      <div className="absolute bottom-2 right-3">
        <span className="rounded-md bg-[var(--color-stage-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-stage-primary)]">
          {wordCount} words
        </span>
      </div>
    </div>
  );
}
