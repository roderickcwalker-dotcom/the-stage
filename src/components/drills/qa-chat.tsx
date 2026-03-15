"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Square, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaRecorder } from "@/hooks/use-media-recorder";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QaChatProps {
  topic: string;
  onComplete: (messages: Message[]) => void;
}

export function QaChat({ topic, onComplete }: QaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [round, setRound] = useState(0);
  const [isUserRecording, setIsUserRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    startRecording,
    stopRecording,
    isRecording,
  } = useMediaRecorder();

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Start with Claude asking the first question
  useEffect(() => {
    streamQuestion([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function streamQuestion(history: Message[]) {
    setIsStreaming(true);
    const newMessages = [...history, { role: "assistant" as const, content: "" }];
    setMessages(newMessages);

    try {
      const response = await fetch("/api/qa-respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalTopic: topic,
          conversationHistory:
            history.length === 0
              ? [
                  {
                    role: "user",
                    content: `I want to practice Q&A on the topic: "${topic}". Ask me a challenging opening question.`,
                  },
                ]
              : history,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          setMessages([
            ...history,
            { role: "assistant", content: fullText },
          ]);
        }
      }

      setMessages([...history, { role: "assistant", content: fullText }]);
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          content: "I had trouble generating a question. Let's try again.",
        },
      ]);
    }
    setIsStreaming(false);
  }

  const handleStartResponse = useCallback(async () => {
    resetTranscript();
    setIsUserRecording(true);
    await startRecording();
    startListening();
  }, [resetTranscript, startRecording, startListening]);

  const handleStopResponse = useCallback(async () => {
    stopRecording();
    stopListening();
    setIsUserRecording(false);

    await new Promise((resolve) => setTimeout(resolve, 500));
  }, [stopRecording, stopListening]);

  const handleSubmitResponse = useCallback(() => {
    if (!transcript.trim()) return;

    const newRound = round + 1;
    setRound(newRound);
    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: transcript },
    ];
    setMessages(updatedMessages);
    resetTranscript();

    if (newRound >= 4) {
      // Final round — get assessment
      const withAssessmentRequest: Message[] = [
        ...updatedMessages,
        {
          role: "user",
          content:
            "That was my final answer. Please give a brief overall assessment of how I handled this Q&A session.",
        },
      ];
      streamQuestion(withAssessmentRequest);
      setTimeout(() => onComplete(updatedMessages), 2000);
    } else {
      streamQuestion(updatedMessages);
    }
  }, [transcript, round, messages, resetTranscript, onComplete]);

  return (
    <div className="card-soft rounded-2xl bg-white overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              msg.role === "assistant"
                ? "bg-[var(--color-stage-soft)] text-[var(--color-stage-text)]"
                : "ml-auto bg-[var(--color-stage-primary)] text-white"
            )}
          >
            {msg.content}
          </div>
        ))}
        {isStreaming && (
          <div className="flex items-center gap-2 text-[var(--color-stage-text-muted)]">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs">Thinking...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[var(--border)] p-4">
        {round >= 4 ? (
          <p className="text-center text-sm text-[var(--color-stage-text-muted)]">
            Q&A complete. Check your assessment above.
          </p>
        ) : isUserRecording ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl bg-[var(--color-stage-bg)] p-3 text-sm text-[var(--color-stage-text)]">
              {transcript || (
                <span className="text-[var(--color-stage-text-muted)]">
                  Listening...
                </span>
              )}
            </div>
            {isRecording || isListening ? (
              <Button
                onClick={handleStopResponse}
                size="sm"
                variant="outline"
                className="gap-1 border-red-200 text-red-600"
              >
                <Square className="h-3 w-3" />
                Stop
              </Button>
            ) : (
              <Button
                onClick={handleSubmitResponse}
                size="sm"
                className="gap-1 bg-[var(--color-stage-primary)]"
                disabled={!transcript.trim()}
              >
                <Send className="h-3 w-3" />
                Send
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={handleStartResponse}
            disabled={isStreaming}
            className="w-full gap-2 rounded-xl bg-[var(--color-stage-primary)] hover:bg-[var(--color-stage-dim)]"
          >
            <Mic className="h-4 w-4" />
            Record Your Answer
          </Button>
        )}
        {!isUserRecording && round > 0 && round < 4 && (
          <p className="mt-2 text-center text-xs text-[var(--color-stage-text-muted)]">
            Round {round}/4
          </p>
        )}
      </div>
    </div>
  );
}
