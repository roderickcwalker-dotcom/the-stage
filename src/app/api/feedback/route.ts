import { streamDetailedFeedback } from "@/lib/ai/claude";
import type { SpeechScores } from "@/types";

export async function POST(request: Request) {
  try {
    const body: {
      transcript: string;
      scores: SpeechScores;
      focusArea?: string;
    } = await request.json();

    const stream = await streamDetailedFeedback(
      body.transcript,
      body.scores,
      body.focusArea
    );

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return new Response("Failed to generate feedback", { status: 500 });
  }
}
