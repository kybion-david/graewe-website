import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const DEFAULT_SITE_URL = "https://www.graewe.com";

/** Production fallback; prefer `NEXT_PUBLIC_SITE_URL` in preview/prod. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

/**
 * Locale-prefixed path for metadata / sitemaps.
 * `path` is the shared slug without locale (`""` / `"/"` for home, `"/kontakt"` etc.).
 */
export function localizedPath(locale: string, path: string = ""): string {
  const normalized =
    !path || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;
  return `/${locale}${normalized}`;
}

/** Strip a leading `/{locale}` segment from a pathname. */
export function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(
    new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`),
  );
  if (!match) return pathname === "/" ? "" : pathname;
  const rest = pathname.slice(match[0].length);
  return rest || "";
}

/**
 * Canonical + hreflang alternates for a page.
 * Relative paths resolve against `metadataBase` in the locale layout.
 */
export function buildLocaleAlternates(
  locale: string,
  path: string = "",
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = localizedPath(loc, path);
  }
  languages["x-default"] = localizedPath(routing.defaultLocale, path);

  return {
    canonical: localizedPath(locale, path),
    languages,
  };
}
