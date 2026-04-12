import { defineRouting } from "next-intl/routing";

export const locales = ["de", "en", "fr", "ru", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localeDetection: false,
});
