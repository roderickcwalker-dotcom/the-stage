"use client";

import { useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition as useReactSpeechRecognition,
} from "react-speech-recognition";

interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  browserSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const {
    transcript,
    interimTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useReactSpeechRecognition();

  const startListening = useCallback(() => {
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  }, []);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening: listening,
    browserSupported: browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    resetTranscript,
  };
}
