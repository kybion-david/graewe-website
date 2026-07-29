import { describe, expect, it } from "vitest";
import {
  CONTACT_EMAIL_INVALID,
  CONTACT_FIELD_REQUIRED,
  parseContactFormBody,
} from "@/lib/contactSchema";
import de from "@/messages/de.json";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import ru from "@/messages/ru.json";
import es from "@/messages/es.json";

const VALID = {
  name: "Muster",
  firstName: "Max",
  email: "max.muster@example.com",
  phone: "+49 123",
  message: "Hello",
  website: "",
};

describe("contactFormSchema (ISSUE-039)", () => {
  it("accepts a complete valid payload", () => {
    const result = parseContactFormBody(VALID);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("max.muster@example.com");
    }
  });

  it("rejects missing required fields with required codes", () => {
    const result = parseContactFormBody({
      name: "",
      firstName: " ",
      email: "",
      phone: "",
      message: "",
      website: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const firstByPath = new Map<string, string>();
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!firstByPath.has(key)) firstByPath.set(key, issue.message);
      }
      expect(firstByPath.get("name")).toBe(CONTACT_FIELD_REQUIRED);
      expect(firstByPath.get("firstName")).toBe(CONTACT_FIELD_REQUIRED);
      expect(firstByPath.get("email")).toBe(CONTACT_FIELD_REQUIRED);
      expect(firstByPath.get("message")).toBe(CONTACT_FIELD_REQUIRED);
    }
  });

  it("rejects invalid email with invalidEmail code", () => {
    const result = parseContactFormBody({ ...VALID, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find((i) => i.path[0] === "email");
      expect(emailIssue?.message).toBe(CONTACT_EMAIL_INVALID);
    }
  });

  it("provides validation copy in all five locales", () => {
    const locales = { de, en, fr, ru, es } as const;
    for (const [locale, messages] of Object.entries(locales)) {
      expect(messages.contact.fieldRequired, `${locale}.fieldRequired`).toMatch(/\S/);
      expect(messages.contact.emailInvalid, `${locale}.emailInvalid`).toMatch(/\S/);
    }
  });
});
