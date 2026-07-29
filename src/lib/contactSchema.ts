import { z } from "zod";

/** Zod message codes mapped to `contact.*` i18n keys in the form. */
export const CONTACT_FIELD_REQUIRED = "required";
export const CONTACT_EMAIL_INVALID = "invalidEmail";

/**
 * Shared contact form fields — client (RHF + zodResolver) and API use the same rules.
 * Honeypot `website` is optional; Turnstile is validated separately.
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, { error: CONTACT_FIELD_REQUIRED }),
  firstName: z.string().trim().min(1, { error: CONTACT_FIELD_REQUIRED }),
  email: z
    .string()
    .trim()
    .min(1, { error: CONTACT_FIELD_REQUIRED })
    .email({ error: CONTACT_EMAIL_INVALID }),
  phone: z.string(),
  message: z.string().trim().min(1, { error: CONTACT_FIELD_REQUIRED }),
  website: z.string(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function parseContactFormBody(body: unknown) {
  if (!body || typeof body !== "object") {
    return contactFormSchema.safeParse(body);
  }
  const raw = body as Record<string, unknown>;
  return contactFormSchema.safeParse({
    name: raw.name ?? "",
    firstName: raw.firstName ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    message: raw.message ?? "",
    website: raw.website ?? "",
  });
}
