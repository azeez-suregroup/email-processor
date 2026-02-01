import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import juice from "juice";
import { emailRateLimiter } from "@/lib/rate-limiter";

// Validate API key at module initialization
if (!process.env.SENDGRID_API_KEY) {
  console.error("CRITICAL: SENDGRID_API_KEY environment variable is not set");
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, htmlContent, honeypot } = await request.json();

    console.log("Email request received:", { to, subject, hasHtmlContent: !!htmlContent });

    // Anti-bot check: honeypot field should be empty
    if (honeypot) {
      console.warn("Bot detected: honeypot field was filled");
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    if (!to || !subject || !htmlContent) {
      return NextResponse.json({ error: "Missing required fields: to, subject, or htmlContent" }, { status: 400 });
    }

    // Rate limiting check
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = emailRateLimiter.check(clientIp);

    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Too many emails sent.",
          resetTime: resetDate.toISOString(),
          message: `Please wait until ${resetDate.toLocaleTimeString()} before sending more emails.`,
        },
        { status: 429 },
      );
    }

    console.log(`Rate limit check passed. Remaining: ${rateLimitResult.remaining}`);

    if (!process.env.SENDGRID_API_KEY) {
      console.error("SendGrid API key is missing");
      return NextResponse.json(
        { error: "SendGrid API key is not configured. Please set SENDGRID_API_KEY in your .env.local file" },
        { status: 500 },
      );
    }

    if (!process.env.SENDGRID_FROM_EMAIL) {
      console.error("SendGrid from email is missing");
      return NextResponse.json(
        { error: "SendGrid sender email is not configured. Please set SENDGRID_FROM_EMAIL in your .env.local file" },
        { status: 500 },
      );
    }

    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    console.log("Sending email:", { to, from: fromEmail, subject });

    const inlinedHtml = juice(htmlContent);

    const msg = {
      to,
      from: {
        email: fromEmail,
        name: "Suregifts",
      },
      subject,
      html: inlinedHtml,
      trackingSettings: {
        clickTracking: {
          enable: false,
        },
        openTracking: {
          enable: false,
        },
      },
    };

    const result = await sgMail.send(msg);
    console.log("SendGrid response:", result);

    return NextResponse.json({ success: true, message: "Email sent successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: "Failed to send email", details: errorMessage }, { status: 500 });
  }
}
