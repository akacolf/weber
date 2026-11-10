import crypto from "crypto";

const CAPTCHA_SECRET =
  process.env.CAPTCHA_SECRET ||
  process.env.RESEND_API_KEY ||
  "portfolio-secure-captcha-salt-2026";

// In-memory set of used signatures to prevent replay attacks
const usedSignatures = new Set<string>();

// Keep memory clean by removing older signatures periodically
const MAX_USED_SIGNATURES = 5000;

export interface CaptchaChallenge {
  token: string;
  svg: string;
  expiresAt: number;
}

export interface VerificationResult {
  valid: boolean;
  error?: string;
}

/**
 * Generates an arithmetic security challenge and SVG visualization
 */
export function generateCaptchaChallenge(): CaptchaChallenge {
  // Generate random math problem: addition, subtraction, or single-digit multiplication
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  if (op === "+") {
    num1 = Math.floor(Math.random() * 15) + 3; // 3 to 17
    num2 = Math.floor(Math.random() * 12) + 2; // 2 to 13
    answer = num1 + num2;
  } else if (op === "-") {
    num1 = Math.floor(Math.random() * 15) + 12; // 12 to 26
    num2 = Math.floor(Math.random() * 10) + 2;  // 2 to 11
    answer = num1 - num2;
  } else {
    // Multiplication with intuitive numbers
    num1 = Math.floor(Math.random() * 6) + 2; // 2 to 7
    num2 = Math.floor(Math.random() * 5) + 2; // 2 to 6
    answer = num1 * num2;
  }

  const question = `${num1} ${op} ${num2} = ?`;
  const timestamp = Date.now();
  const expiresAt = timestamp + 10 * 60 * 1000; // 10 minutes
  const nonce = crypto.randomBytes(8).toString("hex");

  const dataToSign = `${answer}:${timestamp}:${expiresAt}:${nonce}`;
  const signature = crypto
    .createHmac("sha256", CAPTCHA_SECRET)
    .update(dataToSign)
    .digest("hex");

  const token = Buffer.from(`${dataToSign}:${signature}`).toString("base64");
  const svg = renderCaptchaSvg(question);

  return { token, svg, expiresAt };
}

/**
 * Creates an SVG image with noise, curves, and rotated characters
 */
function renderCaptchaSvg(question: string): string {
  const width = 160;
  const height = 44;
  const chars = question.split("");
  const colors = ["#38bdf8", "#818cf8", "#a855f7", "#34d399", "#f59e0b", "#60a5fa"];

  // Generate random decorative bezier lines
  let linesSvg = "";
  for (let i = 0; i < 4; i++) {
    const x1 = Math.floor(Math.random() * 20);
    const y1 = Math.floor(Math.random() * height);
    const cx1 = Math.floor(Math.random() * (width / 2));
    const cy1 = Math.floor(Math.random() * height);
    const cx2 = Math.floor(Math.random() * (width / 2) + width / 2);
    const cy2 = Math.floor(Math.random() * height);
    const x2 = Math.floor(Math.random() * 20 + width - 20);
    const y2 = Math.floor(Math.random() * height);
    const strokeColor = colors[i % colors.length];
    linesSvg += `<path d="M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}" fill="none" stroke="${strokeColor}" stroke-width="1.2" stroke-opacity="0.35" />`;
  }

  // Generate noise dots
  let dotsSvg = "";
  for (let i = 0; i < 24; i++) {
    const cx = Math.floor(Math.random() * width);
    const cy = Math.floor(Math.random() * height);
    const r = (Math.random() * 1.2 + 0.6).toFixed(1);
    const dotColor = colors[Math.floor(Math.random() * colors.length)];
    dotsSvg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${dotColor}" opacity="0.3" />`;
  }

  // Render individual characters with slight rotation and displacement
  const charSpacing = (width - 24) / chars.length;
  let textSvg = "";

  chars.forEach((ch, idx) => {
    const x = 16 + idx * charSpacing;
    const y = 28 + (Math.sin(idx * 1.5) * 3);
    const rot = Math.floor(Math.random() * 16) - 8; // -8 to +8 degrees
    const color = colors[(idx * 2) % colors.length];
    textSvg += `<text x="${x}" y="${y}" fill="${color}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="19" font-weight="700" transform="rotate(${rot} ${x} ${y})" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.2))">${ch}</text>`;
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="select-none pointer-events-none w-full h-full block">
      <rect width="100%" height="100%" fill="currentColor" fill-opacity="0.04" rx="6" />
      ${linesSvg}
      ${dotsSvg}
      ${textSvg}
    </svg>
  `.trim();
}

/**
 * Validates the CAPTCHA token and answer
 */
export function verifyCaptcha(
  token: string | undefined | null,
  answer: string | undefined | null,
  options?: { allowTestBypass?: boolean }
): VerificationResult {
  // Support optional test bypass in development/testing
  if (
    options?.allowTestBypass &&
    token === "test-captcha-token" &&
    answer === "12345"
  ) {
    return { valid: true };
  }

  if (!token || typeof token !== "string" || !token.trim()) {
    return {
      valid: false,
      error: "Please complete the security verification challenge.",
    };
  }

  if (!answer || typeof answer !== "string" || !answer.trim()) {
    return {
      valid: false,
      error: "Please enter the security verification answer.",
    };
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");

    // Expected format: answer:timestamp:expiresAt:nonce:signature
    if (parts.length !== 5) {
      return {
        valid: false,
        error: "Invalid security verification token format.",
      };
    }

    const [expectedAnswer, timestampStr, expiresAtStr, nonce, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    const expiresAt = parseInt(expiresAtStr, 10);

    if (isNaN(timestamp) || isNaN(expiresAt)) {
      return {
        valid: false,
        error: "Corrupted security verification token.",
      };
    }

    // Check expiration
    if (Date.now() > expiresAt) {
      return {
        valid: false,
        error: "Security challenge expired. Please refresh the challenge.",
      };
    }

    // Verify cryptographic signature
    const dataToVerify = `${expectedAnswer}:${timestamp}:${expiresAt}:${nonce}`;
    const expectedSignature = crypto
      .createHmac("sha256", CAPTCHA_SECRET)
      .update(dataToVerify)
      .digest("hex");

    if (signature !== expectedSignature) {
      return {
        valid: false,
        error: "Security verification signature mismatch.",
      };
    }

    // Check replay prevention
    if (usedSignatures.has(signature)) {
      return {
        valid: false,
        error: "This security verification has already been used. Please refresh.",
      };
    }

    // Check answer (allow numbers or spaces trimmed)
    const normalizedUserAnswer = answer.trim().toLowerCase();
    const normalizedExpected = expectedAnswer.trim().toLowerCase();

    if (normalizedUserAnswer !== normalizedExpected) {
      return {
        valid: false,
        error: "Incorrect security verification answer. Please try again.",
      };
    }

    // Record signature to prevent replay
    usedSignatures.add(signature);
    if (usedSignatures.size > MAX_USED_SIGNATURES) {
      usedSignatures.clear();
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      error: "Unable to verify security challenge. Please refresh and try again.",
    };
  }
}
