import { describe, expect, it, afterEach } from "vitest";
import {
  DEFAULT_SITE_URL,
  buildLocaleAlternates,
  getSiteUrl,
  localizedPath,
  stripLocalePrefix,
} from "@/lib/seo";

describe("seo", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("getSiteUrl falls back to production and strips trailing slash", () => {
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
    process.env.NEXT_PUBLIC_SITE_URL = "https://preview.example.com/";
    expect(getSiteUrl()).toBe("https://preview.example.com");
  });

  it("localizedPath prefixes locale and normalizes home", () => {
    expect(localizedPath("de")).toBe("/de");
    expect(localizedPath("en", "/")).toBe("/en");
    expect(localizedPath("fr", "/kontakt")).toBe("/fr/kontakt");
    expect(localizedPath("ru", "produkte/extruder")).toBe(
      "/ru/produkte/extruder",
    );
  });

  it("stripLocalePrefix removes the leading locale segment", () => {
    expect(stripLocalePrefix("/de")).toBe("");
    expect(stripLocalePrefix("/en/kontakt")).toBe("/kontakt");
    expect(stripLocalePrefix("/produkte")).toBe("/produkte");
  });

  it("buildLocaleAlternates sets canonical, five locales, and x-default→de", () => {
    const alternates = buildLocaleAlternates("en", "/kontakt");
    expect(alternates.canonical).toBe("/en/kontakt");
    expect(alternates.languages).toEqual({
      de: "/de/kontakt",
      en: "/en/kontakt",
      fr: "/fr/kontakt",
      ru: "/ru/kontakt",
      es: "/es/kontakt",
      "x-default": "/de/kontakt",
    });
  });

  it("buildLocaleAlternates handles the homepage", () => {
    const alternates = buildLocaleAlternates("de");
    expect(alternates.canonical).toBe("/de");
    expect(alternates.languages?.["x-default"]).toBe("/de");
    expect(alternates.languages?.en).toBe("/en");
  });
});
