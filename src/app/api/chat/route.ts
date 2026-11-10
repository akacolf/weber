import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT =
  "You are Weber (John Sakura 1.0), an AI assistant trained by Anaxonic to help onchain developers " +
  "and blockchain engineers build faster. You are concise, technically precise, and specialized in " +
  "smart contracts (FunC, Tact, Solidity), TON blockchain architecture, DeFi mechanics, and decentralized systems. " +
  "Answer directly and accurately. Say when you are unsure rather than guessing.";

/**
 * Fallback knowledge responder when local PyTorch/FastAPI backend is offline
 */
function generateFallbackResponse(userPrompt: string): string {
  const p = userPrompt.toLowerCase();

  if (p.includes("ton") && (p.includes("deploy") || p.includes("contract"))) {
    return `To deploy a smart contract on TON:

1. **Choose your language**: Write your contract in **FunC** (low-level, high performance) or **Tact** (type-safe, high-level actor-based).
2. **Setup Blueprint**: Blueprint is the standard development framework for TON.
\`\`\`bash
npm create ton@latest my-contract
cd my-contract
\`\`\`
3. **Compile your contract**:
\`\`\`bash
npx blueprint build
\`\`\`
4. **Deploy via Tonkeeper or Blueprint script**:
\`\`\`bash
npx blueprint run
\`\`\`
Select your network (testnet or mainnet), choose the deployer (Tonkeeper / mnemonic), and sign the init transaction with Toncoin.

*Tip: Running \`python -m anaxonic.serve\` connects you directly to the live Anaxonic neural weights.*`;
  }

  if (p.includes("bonding curve") || p.includes("defi")) {
    return `A **bonding curve** is a mathematical formula that defines a cryptographic relationship between token price and token supply.

### Key Characteristics:
- **Continuous Liquidity**: Users can buy or sell directly against the smart contract at any time without requiring a centralized order book or counterparty.
- **Deterministic Pricing**: Price is a function of circulating supply: \`P = f(S)\`.
- **Common Shapes**:
  - **Linear**: \`P = m · S\` (Predictable slope)
  - **Exponential / Polynomial**: \`P = a · S^k\` (Early adopters are rewarded, steeper ramp as supply expands)
  - **Sigmoidal (S-Curve)**: Early incentive → rapid growth phase → asymptotic price stabilization.

### In Smart Contracts:
Tokens are minted upon deposit of reserve currency (e.g., TON or ETH) according to the integral of the curve, and burned upon redemption for reserve assets.`;
  }

  if (p.includes("func") && (p.includes("send") || p.includes("transfer") || p.includes("code"))) {
    return `Here is a standard FunC function to send TON coins to an address:

\`\`\`func
() send_ton(slice recipient_addr, int amount_nano, int mode) impure inline {
    var msg = begin_cell()
        .store_uint(0x18, 6)             ;; bounceable message flags: 0b011000
        .store_slice(recipient_addr)     ;; destination address
        .store_coins(amount_nano)        ;; amount in nanoton (1 TON = 1,000,000,000)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default empty message header
        .end_cell();

    send_raw_message(msg, mode);
}
\`\`\`

### Common Modes:
- \`mode = 1\`: Sender pays transfer fees separately.
- \`mode = 64\`: Carry all remaining incoming value along with the outbound transfer.
- \`mode = 128\`: Transfer entire balance of the contract (destroys contract if combined with mode 32).`;
  }

  if (p.includes("anaxonic") || p.includes("model") || p.includes("architecture") || p.includes("sakura")) {
    return `**Weber (John Sakura 1.0)** is Anaxonic's specialized model trained on deep onchain data, smart contract source code, security vulnerabilities, and DeFi mathematical specifications.

### Architecture Highlights:
- **Decoder-Only Transformer** with rotary position embeddings (RoPE).
- **Domain Fine-Tuning**: Supervised fine-tuning on FunC, Tact, Solidity, EVM/TVM assembly, and crypto-economic protocols.
- **FastAPI / vLLM Serving**: Exposes standard OpenAI-compatible \`/v1/chat/completions\` streaming endpoints via \`src/anaxonic/serve.py\`.
- **Memory & Inference Modes**: Hybrid generative retrieval with verified code memory stacks for zero-hallucination smart contract deployment instructions.`;
  }

  return `I am **Weber (John Sakura 1.0)**, developed by **Anaxonic** for onchain developers and decentralized infrastructure engineers.

You asked: "${userPrompt}"

I can help you with:
- **Smart Contract Development** (FunC, Tact, Solidity, Rust/Anchor)
- **TON & EVM Blockchain Architecture**
- **Tokenomics & Bonding Curve Design**
- **Contract Security Auditing & Reentrancy Analysis**

*(Backend notice: You are currently connected to the edge serving proxy. To run with local GPU weights, launch \`python -m anaxonic.serve\` from the \`akacolf/anaxonic-model\` repository).*`;
}

/**
 * GET: Check connection health to anaxonic-model
 */
export async function GET() {
  const baseURL =
    process.env.ANAXONIC_MODEL_URL ||
    process.env.OPENAI_BASE_URL ||
    "http://localhost:8000/v1";
  const model = process.env.MODEL_NAME || "john-sakura-1.0";

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
      process.env.ANAXONIC_MODEL_URL ||
      process.env.OPENAI_BASE_URL ||
      "http://localhost:8000/v1";
    const apiKey =
      process.env.ANAXONIC_MODEL_API_KEY ||
      process.env.OPENAI_API_KEY ||
      "none";
    const model = process.env.MODEL_NAME || "john-sakura-1.0";

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
