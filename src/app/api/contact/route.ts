import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const CONTACT_EMAIL = process.env.CONTACT_EMAIL_TO || "info@graewe.com";
const FROM_EMAIL = process.env.CONTACT_EMAIL_FROM || "website@graewe.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, firstName, email, phone, message } = body;

    if (!name || !firstName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const subject = `Kontaktanfrage von ${firstName} ${name}`;
    const htmlBody = `
      <h2>Neue Kontaktanfrage über graewe.com</h2>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;">
        <tr><td style="padding:6px 12px;font-weight:bold;">Name:</td><td style="padding:6px 12px;">${firstName} ${name}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">E-Mail:</td><td style="padding:6px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Telefon:</td><td style="padding:6px 12px;">${phone || "–"}</td></tr>
      </table>
      <h3>Nachricht:</h3>
      <p style="white-space:pre-wrap;font-family:Arial,sans-serif;">${message}</p>
      <hr style="margin-top:24px;border:none;border-top:1px solid #ddd;">
      <p style="font-size:12px;color:#999;">Gesendet über das Kontaktformular auf graewe.com am ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</p>
    `;

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject,
        html: htmlBody,
      });
    } else {
      console.log("[Contact Form] RESEND_API_KEY not configured — logging submission:");
      console.log({ name: `${firstName} ${name}`, email, phone: phone || "–", message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact Form] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
