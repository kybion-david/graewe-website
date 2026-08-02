import { defineRouting } from "next-intl/routing";

export const locales = ["de", "en", "fr", "ru", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localeDetection: false,
  // next-intl writes a NEXT_LOCALE cookie by default, but nothing here ever reads it:
  // detection is off and there is no middleware, so the active locale comes purely from
  // the URL segment. Verified — with NEXT_LOCALE=en set, /de still renders lang="de".
  // A cookie with no purpose is one we would have to justify as "technically necessary"
  // on the /cookies page, so it is cheaper to not set it at all.
  localeCookie: false,
});
