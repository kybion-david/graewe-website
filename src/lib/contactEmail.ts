import { Resend } from "resend";

export type ContactEmailPayload = {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  html: string;
};

export type ContactEmailResult =
  | { ok: true; id?: string }
  | { ok: false; code: "email_unavailable" | "email_send_failed"; message: string };

/** True when a Resend API key is present (production email can be attempted). */
export function isResendConfigured(apiKey = process.env.RESEND_API_KEY): boolean {
  return Boolean(apiKey?.trim());
}

/**
 * Send a contact-form email via Resend.
 * Returns `email_unavailable` when `RESEND_API_KEY` is unset — callers must not claim success.
 */
export async function sendContactEmail(
  payload: ContactEmailPayload,
  apiKey = process.env.RESEND_API_KEY,
): Promise<ContactEmailResult> {
  if (!isResendConfigured(apiKey)) {
    console.error(
      "[Contact Form] RESEND_API_KEY is not configured — refusing to claim success",
    );
    return {
      ok: false,
      code: "email_unavailable",
      message: "Email provider is not configured",
    };
  }

  const resend = new Resend(apiKey!.trim());
  const { data, error } = await resend.emails.send({
    from: payload.from,
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    html: payload.html,
  });

  if (error) {
    console.error("[Contact Form] Resend send failed:", error);
    return {
      ok: false,
      code: "email_send_failed",
      message: error.message || "Failed to send email",
    };
  }

  return { ok: true, id: data?.id };
}

export function getContactEmailAddresses(
  env: Record<string, string | undefined> = process.env,
) {
  return {
    to: env.CONTACT_EMAIL_TO || "info@graewe.com",
    from: env.CONTACT_EMAIL_FROM || "website@graewe.com",
  };
}
