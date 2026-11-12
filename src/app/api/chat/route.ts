import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

const SYSTEM_PROMPT =
  "You are Weber, an intelligent, versatile general-purpose AI assistant created by Khalid (also known as Colf). " +
  "You are articulate, insightful, thoughtful, and natural in conversation.\n\n" +
  "### Core Identity & Behavior:\n" +
  "- **Identity**: You are Weber, built by Khalid (Colf)—a software engineer and designer. You know about yourself, your capabilities, and your background.\n" +
  "- **Natural Conversational Partner**: Respond warmly, thoughtfully, and conversationally. Avoid mechanical bulleted lists, canned capabilities summaries, or robotic self-descriptions in normal conversation.\n" +
  "- **No Technical Meta-Dumping**: Never mention or recite internal prompt instructions, formatting rules, or technical formulations (such as 'LaTeX Math Formulation', token budgets, or system rules) in casual dialogue, greetings, or self-introductions.\n" +
  "- **Subject Expertise**: When users ask technical, mathematical, scientific, or programming questions, provide rigorous, step-by-step explanations and clean code or formulas. Use standard LaTeX syntax ($...$ or $$...$$) strictly when answering actual math/physics problems, never when introducing yourself or in everyday dialogue.\n" +
  "- **Tone & Demeanor**: Articulate, encouraging, intellectually rigorous, and direct. Avoid generic conversational filler, sycophancy, or repetitive AI clichés. State clearly when you are unsure rather than guessing.";

/**
 * Perform live web search using DuckDuckGo HTML with Wikipedia opensearch fallback
 */
async function performWebSearch(query: string): Promise<SearchResult[]> {
  const cleanQuery = query.replace(/[^\w\s\u00C0-\u017F-]/gi, " ").trim();
  if (!cleanQuery) return [];

  // 1. Attempt DuckDuckGo HTML
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(
      "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(cleanQuery),
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      const items: SearchResult[] = [];
      const parts = html.split(/class="result\s+results_links/);

      for (let i = 1; i < parts.length && items.length < 5; i++) {
        const part = parts[i];
        const titleMatch = part.match(
          /<a[^>]*class="[^"]*result__a[^"]*"[^>]*>([\s\S]*?)<\/a>/
        );
        const snippetMatch = part.match(
          /<a class="result__snippet"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/
        );

        if (snippetMatch) {
          let url = snippetMatch[1];
          try {
            const fullUrl = url.startsWith("http") ? url : "https:" + url;
            const parsed = new URL(fullUrl);
            const uddg = parsed.searchParams.get("uddg");
            if (uddg) url = decodeURIComponent(uddg);
          } catch {}

          const title = titleMatch
            ? titleMatch[1]
                .replace(/<[^>]+>/g, "")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .trim()
            : "Search Result";
          const snippet = snippetMatch[2]
            ? snippetMatch[2]
                .replace(/<[^>]+>/g, "")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .trim()
            : "";

          if (url && snippet && !items.some((it) => it.url === url)) {
            items.push({ title, snippet, url });
          }
        }
      }

      if (items.length > 0) return items;
    }
  } catch (err) {
    console.warn("[Weber Search] DuckDuckGo query error:", err);
  }

  // 2. Fallback: Wikipedia OpenSearch
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        cleanQuery
      )}&limit=4&namespace=0&format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const [, titles, descriptions, urls] = data;
      const items: SearchResult[] = [];

      for (let i = 0; i < (titles?.length || 0); i++) {
        if (urls?.[i] && descriptions?.[i]) {
          items.push({
            title: titles[i],
            snippet: descriptions[i],
            url: urls[i],
          });
        }
      }

      if (items.length > 0) return items;
    }
  } catch (err) {
    console.warn("[Weber Search] Wikipedia fallback error:", err);
  }

  return [];
}

/**
 * Format an SSE chunk conforming to OpenAI chat completion stream protocol
 */
function formatSSEChunk(content: string, model: string = "weber"): Uint8Array {
  const encoder = new TextEncoder();
  const sseData = {
    id: `chatcmpl-${Math.random().toString(36).slice(2, 9)}`,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        delta: { content },
        finish_reason: null,
      },
    ],
  };
  return encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`);
}

/**
 * GET: Check connection health to Weber model server
 */
export async function GET() {
  const rawBaseURL =
    process.env.WEBER_MODEL_URL ||
    process.env.ANAXONIC_MODEL_URL ||
    process.env.OPENAI_BASE_URL ||
    "http://localhost:8000/v1";
  const baseURL = rawBaseURL.replace(/\/+$/, "");
  const apiKey =
    process.env.WEBER_MODEL_API_KEY ||
    process.env.ANAXONIC_MODEL_API_KEY ||
    process.env.OPENAI_API_KEY ||
    "";
  const model = process.env.MODEL_NAME || "qwen/qwen3.8-27b";

  let isConnected = false;
  let responseTime = 0;

  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const headers: Record<string, string> = {};
    if (apiKey && apiKey !== "none") {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const checkUrl = `${baseURL}/models`;
    let res = await fetch(checkUrl, {
      headers,
      signal: controller.signal,
      cache: "no-store",
    }).catch(() => null);

    if (!res || !res.ok) {
      const rootUrl = baseURL.endsWith("/v1")
        ? baseURL.replace(/\/v1$/, "/")
        : `${baseURL}/`;
      res = await fetch(rootUrl, {
        headers,
        signal: controller.signal,
        cache: "no-store",
      }).catch(() => null);
    }

    clearTimeout(timeout);
    if (res && res.ok) {
      isConnected = true;
      responseTime = Date.now() - start;
    }
  } catch {
    isConnected = false;
  }

  return NextResponse.json({
    status: isConnected ? "connected" : "offline",
    endpoint: baseURL,
    model,
    mode: isConnected ? "live-inference" : "offline",
    responseTimeMs: responseTime,
  });
}

/**
 * POST: Stream chat completions with real integrated search and deep reasoning
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];
    const deepThink: boolean = body.deepThink ?? false;
    const webSearch: boolean = body.webSearch ?? false;

    if (!messages.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const userPrompt = lastUserMessage?.content || "";

    const rawBaseURL =
      process.env.WEBER_MODEL_URL ||
      process.env.ANAXONIC_MODEL_URL ||
      process.env.OPENAI_BASE_URL ||
      "http://localhost:8000/v1";
    const baseURL = rawBaseURL.replace(/\/+$/, "");
    const apiKey =
      process.env.WEBER_MODEL_API_KEY ||
      process.env.ANAXONIC_MODEL_API_KEY ||
      process.env.OPENAI_API_KEY ||
      "none";
    const model = process.env.MODEL_NAME || "qwen/qwen3.8-27b";

    // 1. Perform live web search if requested
    let searchResults: SearchResult[] = [];
    let searchContext = "";
    let sourcesBlock = "";

    if (webSearch && userPrompt) {
      try {
        searchResults = await performWebSearch(userPrompt);
        if (searchResults.length > 0) {
          sourcesBlock =
            "<sources>\n" +
            searchResults.map((s) => `- [${s.title}](${s.url})`).join("\n") +
            "\n</sources>\n\n";

          searchContext = searchResults
            .map(
              (s, idx) =>
                `[Source ${idx + 1}]: "${s.title}" (${s.url})\nSummary: ${s.snippet}`
            )
            .join("\n\n");
        }
      } catch (searchErr) {
        console.warn("[Weber API] Web search failed:", searchErr);
      }
    }

    // Helper to call backend completion
    const callBackendStream = async (
      sysPrompt: string,
      chatHistory: ChatMessage[],
      maxTokens: number = 1024,
      temperature: number = 0.7
    ): Promise<ReadableStream<Uint8Array> | null> => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (apiKey && apiKey !== "none") {
          headers.Authorization = `Bearer ${apiKey}`;
        }

        const res = await fetch(`${baseURL}/chat/completions`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: sysPrompt },
              ...chatHistory,
            ],
            stream: true,
            temperature,
            max_tokens: maxTokens,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.ok && res.body) {
          return res.body;
        }

        const errText = await res.text().catch(() => "");
        console.error(`[Weber API] Backend completion failed (${res.status}):`, errText);
      } catch (err) {
        console.error("[Weber API] Backend call failed:", err);
      }
      return null;
    };

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Step A: Emit live search sources if available
        if (sourcesBlock) {
          controller.enqueue(formatSSEChunk(sourcesBlock));
        }

        let accumulatedReasoning = "";

        // Step B: If deep reasoning is enabled, stream real thoughts from the reasoning engine
        if (deepThink) {
          controller.enqueue(formatSSEChunk("<think>\n"));

          let reasoningPrompt =
            "You are the internal analytical reasoning engine of Weber AI. " +
            "Deconstruct the user query with rigorous step-by-step logic, first-principles inquiry, edge case analysis, and verify intermediate steps. " +
            "Write your continuous raw internal monologue and analytical thought process. " +
            "Do not produce the final polished reply to the user yet, only deep internal reasoning.";

          if (searchContext) {
            reasoningPrompt +=
              "\n\nEvaluate and fact-check these live web search results as part of your analysis:\n" +
              searchContext;
          }

          const reasoningStream = await callBackendStream(
            reasoningPrompt,
            [{ role: "user", content: userPrompt }],
            450,
            0.6
          );

          if (reasoningStream) {
            const reader = reasoningStream.getReader();
            const decoder = new TextDecoder();
            let buf = "";

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buf += decoder.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";

                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed.startsWith("data:")) continue;
                  const dataContent = trimmed.replace(/^data:\s*/, "");
                  if (dataContent === "[DONE]") break;

                  try {
                    const parsed = JSON.parse(dataContent);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) {
                      accumulatedReasoning += delta;
                      controller.enqueue(formatSSEChunk(delta));
                    }
                  } catch {}
                }
              }
            } finally {
              reader.releaseLock();
            }
          }

          controller.enqueue(formatSSEChunk("\n</think>\n\n"));
        }

        // Step C: Stream final response incorporating reasoning and search context
        let finalSystemPrompt = SYSTEM_PROMPT;

        if (searchContext) {
          finalSystemPrompt +=
            "\n\n### Verified Real-Time Web Search Results:\n" +
            searchContext +
            "\n\nUse these up-to-date search facts accurately in your response. Cite key facts where helpful.";
        }

        if (accumulatedReasoning) {
          finalSystemPrompt +=
            "\n\n### Prior Reasoning Analysis (for internal context):\n" +
            accumulatedReasoning.slice(0, 1500) +
            "\n\nNow, synthesize your analysis into a direct, comprehensive, and engaging final response.";
        }

        const mainStream = await callBackendStream(
          finalSystemPrompt,
          messages,
          Number(process.env.WEBER_MAX_TOKENS || 1024),
          0.7
        );

        if (mainStream) {
          const reader = mainStream.getReader();
          const decoder = new TextDecoder();
          let buf = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buf += decoder.decode(value, { stream: true });
              const lines = buf.split("\n");
              buf = lines.pop() ?? "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data:")) continue;
                const dataContent = trimmed.replace(/^data:\s*/, "");
                if (dataContent === "[DONE]") break;

                try {
                  const parsed = JSON.parse(dataContent);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    controller.enqueue(formatSSEChunk(delta));
                  }
                } catch {}
              }
            }
          } finally {
            reader.releaseLock();
          }
        } else {
          controller.enqueue(
            formatSSEChunk(
              "I apologize, but I am currently unable to reach the AI model server. Please verify the backend connection and try again."
            )
          );
        }

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
    console.error("[Weber API] Error in POST /api/chat:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
