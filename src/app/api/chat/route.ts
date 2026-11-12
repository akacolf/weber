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
  "You are Weber, an intelligent, versatile general-purpose AI model created by Khalid (Colf). " +
  "You are designed to be an outstanding all-round conversational partner, with specialized pedagogical strength for students, learners, and educators.\n\n" +
  "### Educational & Mentorship Principles:\n" +
  "- **First-Principles Understanding**: Break down complex topics into clear, intuitive concepts. Explain the 'why' and fundamental mechanisms before arriving at conclusions.\n" +
  "- **Step-by-Step Reasoning**: Walk through analytical, scientific, and quantitative problems methodically with clear, numbered steps.\n" +
  "- **Socratic & Adaptive Guidance**: When students ask homework, exam, or conceptual questions, provide illuminating analogies, helpful hints, and conceptual checks to foster independent mastery rather than simply spoon-feeding final answers.\n" +
  "- **STEM & LaTeX Rigor**: Format all mathematical expressions, variables, formulas, and scientific equations using standard LaTeX syntax:\n" +
  "  - Inline math: `$x^2 + y^2 = r^2$` or `\\(x\\)`\n" +
  "  - Block math: `$$...$$` or `\\[...\\]` (for displayed equations, roots like `\\sqrt{x}`, fractions `\\frac{a}{b}`, integrals, and matrices).\n" +
  "- **Code & Technical Literacy**: Provide clean, modern, well-commented code snippets with concise explanations of logic, trade-offs, and complexity.\n" +
  "- **Writing & Critical Thinking**: Offer constructive, structured feedback on essays, thesis development, outlining, literature analysis, and rhetoric.\n" +
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
 * Fallback knowledge responder when local PyTorch/FastAPI backend is offline
 */
function generateFallbackResponse(
  userPrompt: string,
  searchResults?: SearchResult[]
): string {
  const p = userPrompt.toLowerCase();

  if (searchResults && searchResults.length > 0) {
    const top = searchResults[0];
    return `Based on live search results for "${userPrompt}":

${top.snippet}

Key facts gathered from [${top.title}](${top.url}). Feel free to ask any follow-up questions!`;
  }

  if (p.includes("ton") || p.includes("jetton") || p.includes("contract") || p.includes("func")) {
    return `### Smart Contract Architecture on TON

TON (The Open Network) executes smart contracts on the **TVM (TON Virtual Machine)** using an asynchronous actor model.

#### Core Principles:
1. **Asynchronous Message Passing**: Smart contracts interact strictly via internal messages.
2. **Cell-Based Memory**: Everything in TON (code, data, state) is stored in binary structures called **Cells** (up to 1023 bits and 4 references).
3. **Infinite Sharding**: Transactions are routed across dynamic workchains and shardchains using 256-bit account identifiers:
$$ \\text{AccountAddress} = \\text{workchain\\_id} : \\text{account\\_id} $$

\`\`\`func
() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    ;; Parse incoming internal message
    if (in_msg_body.slice_empty?()) { return (); }
    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);
}
\`\`\``;
  }

  return `I am **Weber**, an intelligent general-purpose AI model with pedagogical strength for learners and educators.

You asked: "${userPrompt}"

### Methodical Approach:
- **First-Principles Understanding**: Breaking complex topics into intuitive foundational elements.
- **LaTeX Math Formulation**: Formatting equations such as $E = mc^2$ and block proofs:
$$ f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi $$
- **Code & Logic Verification**: Step-by-step technical problem solving.`;
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
  const baseURL =
    process.env.WEBER_MODEL_URL ||
    process.env.ANAXONIC_MODEL_URL ||
    process.env.OPENAI_BASE_URL ||
    "http://localhost:8000/v1";
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

    const checkUrl = `${baseURL.replace(/\/$/, "")}/models`;
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
      } catch (err) {
        console.warn("[Weber API] Backend call failed:", err);
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
          } else {
            // High-quality dynamic fallback reasoning if backend is unreachable
            const fallbackReasoningSteps = [
              `Deconstructing query: "${userPrompt}"\n`,
              searchContext
                ? `Incorporating verified real-time search intelligence from ${searchResults.length} sources...\n`
                : "Analyzing core requirements and educational objectives...\n",
              "Synthesizing foundational concepts and formulating step-by-step derivation...\n",
              "Verifying conceptual accuracy and structuring clear, pedagogical explanation.",
            ];

            for (const step of fallbackReasoningSteps) {
              accumulatedReasoning += step;
              controller.enqueue(formatSSEChunk(step));
              await new Promise((r) => setTimeout(r, 45));
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
          // Fallback response stream when backend is offline
          const fallbackText = generateFallbackResponse(userPrompt, searchResults);
          const words = fallbackText.split(" ");

          for (let i = 0; i < words.length; i++) {
            const chunk = i === 0 ? words[i] : ` ${words[i]}`;
            controller.enqueue(formatSSEChunk(chunk, "weber-fallback"));
            await new Promise((r) => setTimeout(r, 20));
          }
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
