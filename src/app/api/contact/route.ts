import { NextResponse } from "next/server";
import {
  CONTACT_HONEYPOT_FIELD,
  consumeRateLimit,
  getClientIp,
  isHoneypotFilled,
  verifyTurnstileToken,
} from "@/lib/contactSpam";
import { getContactEmailAddresses, sendContactEmail } from "@/lib/contactEmail";
import { parseContactFormBody } from "@/lib/contactSchema";

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

    if (isHoneypotFilled(body[CONTACT_HONEYPOT_FIELD])) {
      // Pretend success so bots do not retry / adapt.
      return NextResponse.json({ success: true });
    }

    const turnstile = await verifyTurnstileToken(body.turnstileToken, TURNSTILE_SECRET);
    if (!turnstile.ok) {
      return NextResponse.json(
        { error: "Captcha verification failed", code: "captcha_failed" },
        { status: 400 },
      );
    }

    const parsed = parseContactFormBody(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", code: "validation_failed" },
        { status: 400 },
      );
    }

    const { name, firstName, email, phone, message } = parsed.data;

    const safeName = escapeHtml(name);
    const safeFirstName = escapeHtml(firstName);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : "–";
    const safeMessage = escapeHtml(message);

    const subject = `Kontaktanfrage von ${firstName} ${name}`;
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

    const { to, from } = getContactEmailAddresses();
    const sendResult = await sendContactEmail({
      to,
      from,
      replyTo: email,
      subject,
      html: htmlBody,
    });

    if (!sendResult.ok) {
      const status = sendResult.code === "email_unavailable" ? 503 : 502;
      return NextResponse.json(
        { error: sendResult.message, code: sendResult.code },
        { status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact Form] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
