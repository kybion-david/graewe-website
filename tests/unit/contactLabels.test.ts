import { describe, expect, it } from "vitest";
import de from "@/messages/de.json";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import ru from "@/messages/ru.json";
import es from "@/messages/es.json";

const LABEL_KEYS = [
  "name",
  "firstName",
  "email",
  "phone",
  "message",
  "requiredField",
  "submit",
  "captchaLabel",
] as const;

/** English strings that appear on the old live DE kontakt form — must not ship on DE. */
const OLD_DE_ENGLISH_REGRESSIONS = [
  "First Name",
  "Phone",
  "Message",
  "Required field",
  "Submit",
] as const;

describe("contact form labels (ISSUE-025)", () => {
  it("provides localized labels for all five locales", () => {
    const locales = { de, en, fr, ru, es } as const;
    for (const [locale, messages] of Object.entries(locales)) {
      for (const key of LABEL_KEYS) {
        const value = messages.contact[key];
        expect(value, `${locale}.contact.${key}`).toEqual(expect.any(String));
        expect(value.trim().length, `${locale}.contact.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps DE labels German (no old-site English mix)", () => {
    expect(de.contact.name).toBe("Nachname");
    expect(de.contact.firstName).toBe("Vorname");
    expect(de.contact.email).toBe("E-Mail");
    expect(de.contact.phone).toBe("Telefon");
    expect(de.contact.message).toBe("Nachricht");
    expect(de.contact.requiredField).toBe("Pflichtfeld");
    expect(de.contact.submit).toBe("Absenden");
    expect(de.contact.captchaLabel).toBe("Sicherheitsprüfung");

    const deLabelBlob = LABEL_KEYS.map((k) => de.contact[k]).join(" | ");
    for (const english of OLD_DE_ENGLISH_REGRESSIONS) {
      expect(deLabelBlob).not.toContain(english);
    }
  });

  it("keeps EN labels English", () => {
    expect(en.contact.name).toBe("Last Name");
    expect(en.contact.firstName).toBe("First Name");
    expect(en.contact.email).toBe("Email");
    expect(en.contact.phone).toBe("Phone");
    expect(en.contact.message).toBe("Message");
    expect(en.contact.requiredField).toBe("Required field");
    expect(en.contact.submit).toBe("Submit");
  });

  it("keeps FR / RU / ES field labels distinct from DE and EN where expected", () => {
    expect(fr.contact.firstName).toBe("Prénom");
    expect(fr.contact.phone).toBe("Téléphone");
    expect(fr.contact.requiredField).toBe("Champ obligatoire");

    expect(ru.contact.name).toBe("Фамилия");
    expect(ru.contact.firstName).toBe("Имя");
    expect(ru.contact.phone).toBe("Телефон");
    expect(ru.contact.message).toBe("Сообщение");

    expect(es.contact.name).toBe("Apellidos");
    expect(es.contact.firstName).toBe("Nombre");
    expect(es.contact.phone).toBe("Teléfono");
    expect(es.contact.message).toBe("Mensaje");
    expect(es.contact.requiredField).toBe("Campo obligatorio");
  });
});
