"use client";

import { useState, useCallback, useRef } from "react";
import { Mic, Square, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaRecorder } from "@/hooks/use-media-recorder";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { WaveformVisualizer } from "./waveform-visualizer";
import { LiveTranscript } from "./live-transcript";
import { analyzeFillerWords, calculateFillerRate } from "@/lib/analysis/filler-words";
import { analyzePacing } from "@/lib/analysis/pacing";
import type { SpeechScores, FeedbackResult, FillerInstance } from "@/types";
import { formatDuration } from "@/lib/utils";

export type RecordingState = "idle" | "recording" | "analyzing" | "results";

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

interface SpeechRecorderProps {
  topic?: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
  state: RecordingState;
  onStateChange: (state: RecordingState) => void;
}

export function SpeechRecorder({
  topic,
  onAnalysisComplete,
  state,
  onStateChange,
}: SpeechRecorderProps) {
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const topicRef = useRef(topic);
  topicRef.current = topic;

  const {
    startRecording,
    stopRecording,
    audioBlob,
    duration,
    analyserNode,
    error: micError,
  } = useMediaRecorder();

  const {
    transcript,
    interimTranscript,
    browserSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Keep refs to latest values so the async analysis always reads current data
  const transcriptRef = useRef(transcript);
  transcriptRef.current = transcript;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const audioBlobRef = useRef(audioBlob);
  audioBlobRef.current = audioBlob;

  const wordCount = transcript
    ? transcript.split(/\s+/).filter(Boolean).length
    : 0;

  const runAnalysis = useCallback(
    async (finalTranscript: string, finalDuration: number, finalAudioBlob: Blob | null) => {
      console.log("[SpeechRecorder] runAnalysis called", {
        transcriptLength: finalTranscript.length,
        duration: finalDuration,
        hasBlob: !!finalAudioBlob,
      });

      if (!finalTranscript.trim()) {
        console.log("[SpeechRecorder] Empty transcript, aborting");
        setAnalysisError("No speech detected. Please try again.");
        onStateChange("idle");
        return;
      }

      try {
        const { fillerCount, fillerWords } = analyzeFillerWords(finalTranscript);
        const fillerRate = calculateFillerRate(fillerCount, finalDuration);
        const { wpm, wordCount: wc } = analyzePacing(finalTranscript, finalDuration);

        console.log("[SpeechRecorder] Sending to /api/analyze...");
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            transcript: finalTranscript,
            topic: topicRef.current,
            durationSeconds: finalDuration,
            wordCount: wc,
            wpm,
            fillerCount,
            fillerRate,
          }),
        });

        clearTimeout(timeout);
        console.log("[SpeechRecorder] API response status:", response.status);

        if (!response.ok) throw new Error(`Analysis failed with status ${response.status}`);

        const { scores, feedback } = await response.json();
        console.log("[SpeechRecorder] Analysis complete, scores:", scores);

        onAnalysisComplete({
          scores,
          feedback,
          transcript: finalTranscript,
          wpm,
          wordCount: wc,
          fillerCount,
          fillerRate,
          fillerWords,
          durationSeconds: finalDuration,
          audioBlob: finalAudioBlob,
        });
        onStateChange("results");
      } catch (err) {
        console.error("[SpeechRecorder] Analysis error:", err);
        const message = err instanceof DOMException && err.name === "AbortError"
          ? "Analysis timed out. Please try again."
          : "Failed to analyze speech. Please check your API key and try again.";
        setAnalysisError(message);
        onStateChange("idle");
      }
    },
    [onAnalysisComplete, onStateChange]
  );

  const handleStart = useCallback(async () => {
    setAnalysisError(null);
    resetTranscript();
    await startRecording();
    startListening();
    onStateChange("recording");
  }, [startRecording, startListening, resetTranscript, onStateChange]);

  const handleStop = useCallback(() => {
    console.log("[SpeechRecorder] Stop pressed, transcript so far:", transcriptRef.current?.slice(0, 50));
    stopRecording();
    stopListening();
    onStateChange("analyzing");

    // Wait for transcript to finalize, then read from refs
    setTimeout(() => {
      const finalTranscript = transcriptRef.current;
      const finalDuration = durationRef.current;
      const finalBlob = audioBlobRef.current;
      console.log("[SpeechRecorder] After 1s delay, transcript:", finalTranscript?.slice(0, 50), "duration:", finalDuration);
      runAnalysis(finalTranscript, finalDuration, finalBlob);
    }, 1000);
  }, [stopRecording, stopListening, onStateChange, runAnalysis]);

  if (!browserSupported) {
    return (
      <div className="card-soft rounded-2xl bg-white p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-[var(--color-stage-warning)]" />
        <h3
          className="text-lg text-[var(--color-stage-text)] mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Browser Not Supported
        </h3>
        <p className="text-sm text-[var(--color-stage-text-secondary)] max-w-md mx-auto">
          Speech recognition requires Chrome or Microsoft Edge. Please open The
          Stage in one of these browsers for the full experience.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Waveform */}
      <WaveformVisualizer
        analyserNode={analyserNode}
        isActive={state === "recording"}
      />

      {/* Live Transcript */}
      <LiveTranscript
        transcript={transcript}
        interimTranscript={interimTranscript}
        wordCount={wordCount}
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {state === "idle" && (
          <Button
            onClick={handleStart}
            size="lg"
            className="gap-2 rounded-xl bg-[var(--color-stage-primary)] px-8 py-6 text-base hover:bg-[var(--color-stage-dim)]"
          >
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}

        {state === "recording" && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500 recording-pulse" />
              <span className="text-sm font-medium text-red-700">
                {formatDuration(duration)}
              </span>
            </div>
            <Button
              onClick={handleStop}
              size="lg"
              variant="outline"
              className="gap-2 rounded-xl px-8 py-6 text-base border-red-200 text-red-600 hover:bg-red-50"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </div>
        )}

        {state === "analyzing" && (
          <div className="flex items-center gap-3 text-[var(--color-stage-text-secondary)]">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--color-stage-primary)]" />
            <span className="text-sm">Analyzing your speech...</span>
          </div>
        )}
      </div>

      {/* Errors */}
      {(micError || analysisError) && (
        <div className="rounded-xl bg-[var(--color-stage-danger-soft)] p-4 text-center">
          <p className="text-sm text-red-700">{micError || analysisError}</p>
        </div>
      )}
    </div>
  );
}
