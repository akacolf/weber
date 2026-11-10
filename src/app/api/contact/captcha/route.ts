import { NextResponse } from "next/server";
import { generateCaptchaChallenge } from "@/lib/captcha";

export async function GET() {
  try {
    const challenge = generateCaptchaChallenge();

    return NextResponse.json(
      {
        token: challenge.token,
        svg: challenge.svg,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("[Captcha API] Failed to generate challenge:", error);
    return NextResponse.json(
      { error: "Failed to generate security challenge" },
      { status: 500 }
    );
  }
}
