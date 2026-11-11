import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT =
  "You are Weber, a specialized AI model trained for general purpose chatting and conversation. " +
  "You are helpful, thoughtful, concise, and engaging. " +
  "Answer directly, naturally, and accurately. Say when you are unsure rather than guessing.";

/**
 * Fallback knowledge responder when local PyTorch/FastAPI backend is offline
 */
function generateFallbackResponse(userPrompt: string): string {
  const p = userPrompt.toLowerCase();

  if (p.includes("weber") || p.includes("model") || p.includes("architecture")) {
    return `**Weber** is a specialized AI model trained for general purpose chatting, natural conversation, and reasoning.

### Architecture Highlights:
- **Decoder-Only Transformer** with rotary position embeddings (RoPE) and byte-level deterministic tokenization.
- **Supervised Fine-Tuning**: Trained on curated conversational datasets and multi-turn instruction-following corpora.
- **Continuous Training**: Active training loop with gradient accumulation, response masking, quality gates, and checkpoint evaluations.
- **FastAPI / vLLM Serving**: Exposes standard OpenAI-compatible \`/v1/chat/completions\` streaming endpoints.
- **Open Source**: Full model code and training pipelines are published at [github.com/akacolf/anaxonic-model](https://github.com/akacolf/anaxonic-model).`;
  }

  return `I am **Weber**, a specialized AI model trained for general purpose chatting.

You asked: "${userPrompt}"

I can help you with:
- **Open-Ended Conversation & Brainstorming**
- **Answering Questions & Explaining Concepts**
- **Writing, Creative Thinking & Drafting**
- **Problem Solving & Step-by-Step Reasoning**`;
}

/**
 * GET: Check connection health to Weber model server
 */
export async function GET() {
  const baseURL =
    process.env.WEBER_MODEL_URL ||
    process.env.ANAXONIC_MODEL_URL ||
    process.env.OPENAI_BASE_URL ||
    "http://localhost:8000/v1";
  const model = process.env.MODEL_NAME || "weber";

  let isConnected = false;
  let responseTime = 0;

  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const healthUrl = baseURL.endsWith("/v1")
      ? baseURL.replace(/\/v1$/, "/")
      : `${baseURL}/`;

    const res = await fetch(healthUrl, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    if (res.ok) {
      isConnected = true;
      responseTime = Date.now() - start;
    }
  } catch {
    isConnected = false;
  }

  return NextResponse.json({
    status: isConnected ? "connected" : "fallback-ready",
    endpoint: baseURL,
    model,
    mode: isConnected ? "live-inference" : "edge-preview",
    responseTimeMs: responseTime,
  });
}

/**
 * POST: Stream chat completions (OpenAI-compatible)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    const userText = lastUserMessage?.content || "";

    const baseURL =
      process.env.WEBER_MODEL_URL ||
      process.env.ANAXONIC_MODEL_URL ||
      process.env.OPENAI_BASE_URL ||
      "http://localhost:8000/v1";
    const apiKey =
      process.env.WEBER_MODEL_API_KEY ||
      process.env.ANAXONIC_MODEL_API_KEY ||
      process.env.OPENAI_API_KEY ||
      "none";
    const model = process.env.MODEL_NAME || "weber";

    // Attempt to query the backend server
    let backendStream: ReadableStream<Uint8Array> | null = null;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok && res.body) {
        backendStream = res.body;
      }
    } catch {
      // Backend is unreachable; will use fallback stream below
      backendStream = null;
    }

    // If backend stream is live, pipe it directly
    if (backendStream) {
      return new Response(backendStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Otherwise, simulate SSE stream from fallback response
    const fallbackText = generateFallbackResponse(userText);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const words = fallbackText.split(" ");
        for (let i = 0; i < words.length; i++) {
          const chunk = i === 0 ? words[i] : ` ${words[i]}`;
          const sseData = {
            id: `chatcmpl-${Math.random().toString(36).slice(2, 10)}`,
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            model,
            choices: [
              {
                index: 0,
                delta: { content: chunk },
                finish_reason: null,
              },
            ],
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`)
          );

          // Natural stream cadence
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        // Final finish chunk & DONE
        const stopData = {
          id: `chatcmpl-${Math.random().toString(36).slice(2, 10)}`,
          object: "chat.completion.chunk",
          created: Math.floor(Date.now() / 1000),
          model,
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: "stop",
            },
          ],
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(stopData)}\n\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
