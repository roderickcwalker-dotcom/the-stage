import { streamQAResponse } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const body: {
      originalTopic: string;
      conversationHistory: { role: "user" | "assistant"; content: string }[];
    } = await request.json();

    const stream = await streamQAResponse(
      body.originalTopic,
      body.conversationHistory
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
    console.error("QA response error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
