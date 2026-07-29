import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  CONTACT_HONEYPOT_FIELD,
  consumeRateLimit,
  getClientIp,
  isHoneypotFilled,
  verifyTurnstileToken,
} from "@/lib/contactSpam";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const CONTACT_EMAIL = process.env.CONTACT_EMAIL_TO || "info@graewe.com";
const FROM_EMAIL = process.env.CONTACT_EMAIL_FROM || "website@graewe.com";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    if (!consumeRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests", code: "rate_limited" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { name, firstName, email, phone, message, turnstileToken } = body;

    if (isHoneypotFilled(body[CONTACT_HONEYPOT_FIELD])) {
      // Pretend success so bots do not retry / adapt.
      return NextResponse.json({ success: true });
    }

    const turnstile = await verifyTurnstileToken(turnstileToken, TURNSTILE_SECRET);
    if (!turnstile.ok) {
      return NextResponse.json(
        { error: "Captcha verification failed", code: "captcha_failed" },
        { status: 400 },
      );
    }

    if (!name || !firstName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const safeName = escapeHtml(String(name));
    const safeFirstName = escapeHtml(String(firstName));
    const safeEmail = escapeHtml(String(email));
    const safePhone = phone ? escapeHtml(String(phone)) : "–";
    const safeMessage = escapeHtml(String(message));

    const subject = `Kontaktanfrage von ${String(firstName)} ${String(name)}`;
    const htmlBody = `
      <h2>Neue Kontaktanfrage über graewe.com</h2>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;">
        <tr><td style="padding:6px 12px;font-weight:bold;">Name:</td><td style="padding:6px 12px;">${safeFirstName} ${safeName}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">E-Mail:</td><td style="padding:6px 12px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Telefon:</td><td style="padding:6px 12px;">${safePhone}</td></tr>
      </table>
      <h3>Nachricht:</h3>
      <p style="white-space:pre-wrap;font-family:Arial,sans-serif;">${safeMessage}</p>
      <hr style="margin-top:24px;border:none;border-top:1px solid #ddd;">
      <p style="font-size:12px;color:#999;">Gesendet über das Kontaktformular auf graewe.com am ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</p>
    `;

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: CONTACT_EMAIL,
        replyTo: String(email),
        subject,
        html: htmlBody,
      });
    } else {
      console.log("[Contact Form] RESEND_API_KEY not configured — logging submission:");
      console.log({
        name: `${String(firstName)} ${String(name)}`,
        email,
        phone: phone || "–",
        message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact Form] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
