"use client";

import { useState, useCallback, useRef } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { PageHeader } from "@/components/layout/page-header";
import { DrillPicker } from "@/components/drills/drill-picker";
import { TopicCard } from "@/components/drills/topic-card";
import { CountdownTimer } from "@/components/drills/countdown-timer";
import { QaChat } from "@/components/drills/qa-chat";
import { Button } from "@/components/ui/button";
import { useMediaRecorder } from "@/hooks/use-media-recorder";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useCountdown } from "@/hooks/use-countdown";
import { useSessions } from "@/hooks/use-sessions";
import { getRandomTopic, getDrillDuration } from "@/lib/drills/topics";
import { analyzeFillerWords, calculateFillerRate } from "@/lib/analysis/filler-words";
import { analyzePacing } from "@/lib/analysis/pacing";
import { ScoreRing } from "@/components/shared/score-ring";
import { WaveformVisualizer } from "@/components/practice/waveform-visualizer";
import type { DrillType } from "@/types";

type DrillState =
  | "select"
  | "topic"
  | "recording"
  | "analyzing"
  | "feedback"
  | "qa";

export default function DrillsPage() {
  const [drillState, setDrillState] = useState<DrillState>("select");
  const [selectedType, setSelectedType] = useState<DrillType | null>(null);
  const [topic, setTopic] = useState("");
  const [topicContext, setTopicContext] = useState("");
  const [drillScore, setDrillScore] = useState(0);
  const [drillFeedback, setDrillFeedback] = useState("");
  const usedTopicsRef = useRef<string[]>([]);
  const transcriptRef = useRef("");

  const { saveDrillAttempt, saveSession } = useSessions();
  const { startRecording, stopRecording, isRecording, duration, analyserNode } =
    useMediaRecorder();
  const {
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupported,
    mounted,
  } = useSpeechRecognition();

  const drillDuration = selectedType ? getDrillDuration(selectedType) : 60;

  const handleTimerComplete = useCallback(() => {
    stopRecording();
    stopListening();
    transcriptRef.current = transcript;
    setDrillState("analyzing");
    analyzeDrill(transcript, drillDuration);
  }, [stopRecording, stopListening, transcript, drillDuration]);

  const countdown = useCountdown(drillDuration, handleTimerComplete);

  function handleSelectDrill(type: DrillType) {
    setSelectedType(type);
    if (type === "qa") {
      const t = getRandomTopic(type, "foundation", usedTopicsRef.current);
      setTopic(t);
      setDrillState("qa");
    } else {
      generateTopic(type);
    }
  }

  function generateTopic(type?: DrillType) {
    const t = getRandomTopic(
      type || selectedType!,
      "foundation",
      usedTopicsRef.current
    );
    usedTopicsRef.current.push(t);
    setTopic(t);
    setTopicContext("");
    setDrillState("topic");
  }

  async function handleStartDrill() {
    resetTranscript();
    await startRecording();
    startListening();
    countdown.reset();
    countdown.start();
    setDrillState("recording");
  }

  async function handleStopEarly() {
    countdown.pause();
    stopRecording();
    stopListening();
    transcriptRef.current = transcript;
    setDrillState("analyzing");
    analyzeDrill(transcript, drillDuration - countdown.secondsLeft);
  }

  async function analyzeDrill(text: string, actualDuration: number) {
    if (!text.trim()) {
      setDrillScore(0);
      setDrillFeedback("No speech detected. Try again!");
      setDrillState("feedback");
      return;
    }

    try {
      const { fillerCount } = analyzeFillerWords(text);
      const fillerRate = calculateFillerRate(fillerCount, actualDuration);
      const { wpm, wordCount } = analyzePacing(text, actualDuration);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: text,
          topic,
          durationSeconds: actualDuration,
          wordCount,
          wpm,
          fillerCount,
          fillerRate,
        }),
      });

      if (response.ok) {
        const { scores, feedback } = await response.json();
        setDrillScore(scores.overall);
        setDrillFeedback(feedback.strength + " " + feedback.improvements[0]);

        await saveDrillAttempt({
          drillType: selectedType!,
          prompt: topic,
          createdAt: new Date().toISOString(),
          durationSeconds: actualDuration,
          transcript: text,
          wpm,
          fillerCount,
          score: scores.overall,
          feedback: feedback.strength,
        });

        await saveSession({
          createdAt: new Date().toISOString(),
          type: "drill",
          topic,
          transcript: text,
          durationSeconds: actualDuration,
          wordCount,
          wpm,
          fillerCount,
          fillerWords: analyzeFillerWords(text).fillerWords,
          fillerRate,
          scores,
          feedback,
          tags: [selectedType!],
        });
      } else {
        setDrillScore(5);
        setDrillFeedback("Couldn't get AI feedback, but great effort!");
      }
    } catch {
      setDrillScore(5);
      setDrillFeedback("Couldn't get AI feedback, but great effort!");
    }

    setDrillState("feedback");
  }

  function handleReset() {
    setDrillState("select");
    setSelectedType(null);
    setTopic("");
    setDrillScore(0);
    setDrillFeedback("");
    countdown.reset();
  }

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-6 md:pb-6 md:pl-52">
        <div className="mx-auto max-w-2xl">
          <PageHeader
            title="Drill Mode"
            subtitle="Timed exercises to sharpen your skills"
          />

          {drillState !== "select" && drillState !== "qa" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="mb-4 gap-1 text-[var(--color-stage-text-secondary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          )}

          {drillState === "select" && (
            <DrillPicker onSelect={handleSelectDrill} />
          )}

          {drillState === "topic" && (
            <div className="space-y-6">
              <TopicCard
                topic={topic}
                context={topicContext}
                onNewTopic={() => generateTopic()}
              />
              <div className="text-center">
                <Button
                  onClick={handleStartDrill}
                  size="lg"
                  className="gap-2 rounded-xl bg-[var(--color-stage-primary)] px-10 py-6 text-base hover:bg-[var(--color-stage-dim)]"
                  disabled={mounted && !browserSupported}
                >
                  Go!
                </Button>
                {mounted && !browserSupported && (
                  <p className="mt-2 text-xs text-red-500">
                    Speech recognition requires Chrome or Edge
                  </p>
                )}
              </div>
            </div>
          )}

          {drillState === "recording" && (
            <div className="space-y-6">
              <TopicCard
                topic={topic}
                context={topicContext}
                onNewTopic={() => {}}
                disabled
              />

              <div className="flex flex-col items-center gap-4">
                <CountdownTimer
                  secondsLeft={countdown.secondsLeft}
                  totalSeconds={drillDuration}
                  progress={countdown.progress}
                />

                <WaveformVisualizer
                  analyserNode={analyserNode}
                  isActive={isRecording}
                />

                <div className="rounded-xl border border-[var(--border)] bg-white p-4 w-full max-h-32 overflow-y-auto">
                  <p className="text-sm text-[var(--color-stage-text)]">
                    {transcript || (
                      <span className="text-[var(--color-stage-text-muted)]">
                        Start speaking...
                      </span>
                    )}
                  </p>
                </div>

                <Button
                  onClick={handleStopEarly}
                  variant="outline"
                  className="gap-2 border-red-200 text-red-600"
                >
                  Stop Early
                </Button>
              </div>
            </div>
          )}

          {drillState === "analyzing" && (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-stage-primary)]" />
              <p className="text-sm text-[var(--color-stage-text-secondary)]">
                Analyzing your performance...
              </p>
            </div>
          )}

          {drillState === "feedback" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <ScoreRing score={drillScore} size={128} strokeWidth={8} />
                <p className="text-sm text-[var(--color-stage-text-secondary)] max-w-md text-center leading-relaxed">
                  {drillFeedback}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    generateTopic();
                  }}
                  className="flex-1 rounded-xl bg-[var(--color-stage-primary)] hover:bg-[var(--color-stage-dim)]"
                >
                  Next Drill
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  Change Drill Type
                </Button>
              </div>
            </div>
          )}

          {drillState === "qa" && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1 text-[var(--color-stage-text-secondary)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
              <QaChat
                topic={topic}
                onComplete={() => {
                  setDrillState("feedback");
                  setDrillScore(7);
                  setDrillFeedback(
                    "Great Q&A session! Check the chat above for your detailed assessment."
                  );
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
