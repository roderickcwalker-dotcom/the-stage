"use client";

import { useRef, useEffect } from "react";

interface WaveformVisualizerProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
}

export function WaveformVisualizer({
  analyserNode,
  isActive,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!ctx || !canvas || !analyserNode) return;
      animFrameRef.current = requestAnimationFrame(draw);

      analyserNode.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#FFF0EB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#E85D3A";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [analyserNode, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={64}
      className="w-full rounded-xl"
      style={{ backgroundColor: "#FFF0EB" }}
    />
  );
}
