import type { Metadata } from "next";
import type { ProductDetail } from "@/lib/productContent";
import { buildLocaleAlternates } from "@/lib/seo";

/** Trim and ellipsize for meta description length (~SERP display). */
export function truncateMetaDescription(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const slice = normalized.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut =
    lastSpace > Math.floor(maxLength * 0.5) ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

/**
 * Page title + description + locale alternates (canonical / hreflang),
 * including Open Graph override of the layout default.
 */
export function pageMetadata(
  title: string,
  description: string,
  locale: string,
  path: string = "",
): Metadata {
  const desc = truncateMetaDescription(description);
  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
    alternates: buildLocaleAlternates(locale, path),
  };
}

/** Distinct product meta text: title prefix avoids shared body copy across categories. */
export function productMetaDescription(detail: ProductDetail): string {
  const body =
    detail.sections.find((section) => section.content)?.content ??
    detail.sections
      .find((section) => section.items?.length)
      ?.items?.slice(0, 5)
      .join(", ") ??
    "";
  return truncateMetaDescription(`${detail.title}. ${body}`);
}
