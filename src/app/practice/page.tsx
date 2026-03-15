"use client";

import { useState, useCallback } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { PageHeader } from "@/components/layout/page-header";
import { TopicInput } from "@/components/practice/topic-input";
import {
  SpeechRecorder,
  type RecordingState,
} from "@/components/practice/speech-recorder";
import { Scorecard } from "@/components/practice/scorecard";
import { SessionSummary } from "@/components/practice/session-summary";
import { Button } from "@/components/ui/button";
import { useSessions } from "@/hooks/use-sessions";
import type { SpeechScores, FeedbackResult, FillerInstance } from "@/types";

interface AnalysisResult {
  scores: SpeechScores;
  feedback: FeedbackResult;
  transcript: string;
  wpm: number;
  wordCount: number;
  fillerCount: number;
  fillerRate: number;
  fillerWords: FillerInstance[];
  durationSeconds: number;
  audioBlob: Blob | null;
}

export default function PracticePage() {
  const [topic, setTopic] = useState("");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [saved, setSaved] = useState(false);
  const { saveSession } = useSessions();

  const handleAnalysisComplete = useCallback((analysis: AnalysisResult) => {
    setResult(analysis);
  }, []);

  const handleSave = useCallback(async () => {
    if (!result) return;
    await saveSession({
      createdAt: new Date().toISOString(),
      type: "practice",
      topic: topic || "Free Practice",
      transcript: result.transcript,
      audioBlob: result.audioBlob ?? undefined,
      durationSeconds: result.durationSeconds,
      wordCount: result.wordCount,
      wpm: result.wpm,
      fillerCount: result.fillerCount,
      fillerWords: result.fillerWords,
      fillerRate: result.fillerRate,
      scores: result.scores,
      feedback: result.feedback,
      tags: [],
    });
    setSaved(true);
  }, [result, topic, saveSession]);

  const handleReset = useCallback(() => {
    setRecordingState("idle");
    setResult(null);
    setSaved(false);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-6 md:pb-6 md:pl-52">
        <div className="mx-auto max-w-2xl">
          <PageHeader
            title="Practice Arena"
            subtitle="Record yourself speaking and get detailed AI feedback"
          />

          {recordingState !== "results" && (
            <div className="mb-6">
              <TopicInput
                value={topic}
                onChange={setTopic}
                disabled={recordingState !== "idle"}
              />
            </div>
          )}

          <SpeechRecorder
            topic={topic}
            onAnalysisComplete={handleAnalysisComplete}
            state={recordingState}
            onStateChange={setRecordingState}
          />

          {recordingState === "results" && result && (
            <div className="mt-8 space-y-6">
              <Scorecard
                scores={result.scores}
                wpm={result.wpm}
                fillerCount={result.fillerCount}
                fillerRate={result.fillerRate}
                durationSeconds={result.durationSeconds}
              />

              <SessionSummary
                feedback={result.feedback}
                fillerWords={result.fillerWords}
              />

              {/* Transcript */}
              <div className="card-soft rounded-2xl bg-white p-5">
                <h3 className="text-sm font-medium text-[var(--color-stage-text)] mb-2">
                  Full Transcript
                </h3>
                <p className="text-sm text-[var(--color-stage-text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {result.transcript}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saved}
                  className="flex-1 gap-2 rounded-xl bg-[var(--color-stage-primary)] hover:bg-[var(--color-stage-dim)]"
                >
                  <Save className="h-4 w-4" />
                  {saved ? "Saved to Journal" : "Save to Journal"}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 gap-2 rounded-xl"
                >
                  <RotateCcw className="h-4 w-4" />
                  Practice Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
