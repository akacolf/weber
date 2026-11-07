import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    // Enforce rate limiting based on client IP
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(`contact:${clientIp}`);

    const rateLimitHeaders = {
      "X-RateLimit-Limit": String(rateLimitResult.limit),
      "X-RateLimit-Remaining": String(rateLimitResult.remaining),
      "X-RateLimit-Reset": String(rateLimitResult.reset),
    };

    if (!rateLimitResult.success) {
      const waitMinutes = Math.ceil((rateLimitResult.retryAfter || 60) / 60);
      const timeMessage =
        waitMinutes > 1
          ? `${waitMinutes} minutes`
          : `${rateLimitResult.retryAfter || 60} seconds`;

      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${timeMessage} before submitting another message.`,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            ...rateLimitHeaders,
            "Retry-After": String(rateLimitResult.retryAfter || 60),
          },
        }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const trimmedName = name.trim().slice(0, 100);
    const trimmedEmail = email.trim().slice(0, 200);
    const trimmedSubject =
      subject && typeof subject === "string" && subject.trim()
        ? subject.trim().slice(0, 200)
        : "Portfolio Inquiry";
    const trimmedMessage = message.trim().slice(0, 5000);

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || "khalidthenoble@gmail.com";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

    // If Resend API key is not configured (e.g. in development or before setting .env.local),
    // log message to server console and return simulation status
    if (!apiKey) {
      console.warn(
        `[Contact API] RESEND_API_KEY is not configured. Simulating delivery:\n` +
          `To: ${toEmail}\n` +
          `From: ${trimmedName} <${trimmedEmail}>\n` +
          `Subject: ${trimmedSubject}\n` +
          `Message:\n${trimmedMessage}`
      );

      return NextResponse.json(
        {
          success: true,
          simulated: true,
          message:
            "Message received in development/test mode. Configure RESEND_API_KEY in .env.local for live delivery.",
        },
        { headers: rateLimitHeaders }
      );
    }

    const resend = new Resend(apiKey);
    const emailSubject = `[Portfolio] ${trimmedSubject} - from ${trimmedName}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #111827; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #09090b; color: #ffffff; padding: 24px 32px; border-bottom: 1px solid #27272a; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.025em; }
            .header p { margin: 4px 0 0; font-size: 13px; color: #a1a1aa; }
            .content { padding: 32px; }
            .meta-box { background: #f4f4f5; padding: 16px; border-radius: 8px; border: 1px solid #e4e4e7; margin-bottom: 24px; }
            .meta-label { font-weight: 600; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .meta-value { font-size: 14px; color: #09090b; }
            .message-box { background: #ffffff; border-left: 3px solid #0284c7; padding: 16px; margin: 20px 0; font-size: 15px; line-height: 1.6; color: #18181b; white-space: pre-wrap; }
            .footer { padding: 20px 32px; background: #f4f4f5; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a; text-align: center; }
            .button { display: inline-block; background: #09090b; color: #ffffff !important; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Message from Portfolio</h1>
              <p>Received on ${new Date().toUTCString()}</p>
            </div>
            <div class="content">
              <div class="meta-box">
                <div class="meta-label">Sender</div>
                <div class="meta-value"><strong>${trimmedName}</strong> &lt;<a href="mailto:${trimmedEmail}" style="color: #0284c7; text-decoration: none;">${trimmedEmail}</a>&gt;</div>
                ${
                  trimmedSubject
                    ? `<div style="margin-top: 12px;">
                        <div class="meta-label">Subject / Category</div>
                        <div class="meta-value">${trimmedSubject}</div>
                      </div>`
                    : ""
                }
              </div>
              <div class="meta-label">Message</div>
              <div class="message-box">${trimmedMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
              <div style="text-align: center; margin-top: 24px;">
                <a href="mailto:${trimmedEmail}?subject=Re: ${encodeURIComponent(trimmedSubject)}" class="button">Reply to ${trimmedName}</a>
              </div>
            </div>
            <div class="footer">
              Sent via portfolio contact form to ${toEmail} • Khalid Al Shareef
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `New message from portfolio contact form:

From: ${trimmedName} (${trimmedEmail})
Subject: ${trimmedSubject}
Date: ${new Date().toISOString()}

Message:
${trimmedMessage}
`;

    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: trimmedEmail,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    if (result.error) {
      console.error("[Contact API] Resend error:", result.error);
      return NextResponse.json(
        { error: result.error.message || "Failed to deliver message via email provider." },
        { status: 502, headers: rateLimitHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: result.data?.id,
      },
      { headers: rateLimitHeaders }
    );
  } catch (err: unknown) {
    console.error("[Contact API] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your message." },
      { status: 500 }
    );
  }
}
