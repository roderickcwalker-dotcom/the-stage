"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseCountdownReturn {
  secondsLeft: number;
  isRunning: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useCountdown(
  totalSeconds: number,
  onComplete?: () => void
): UseCountdownReturn {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const start = useCallback(() => {
    clearTimer();
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  }, [clearTimer, totalSeconds]);

  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;

  return { secondsLeft, isRunning, progress, start, pause, reset };
}
