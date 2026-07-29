import { describe, expect, it } from "vitest";
import {
  NEWS_SLUGS,
  findNewsItem,
  getLatestNews,
  getNewsImages,
  getNewsSlugFromLegacyId,
  isNewsSlug,
  type NewsItem,
} from "@/lib/news";

const sampleItems: NewsItem[] = NEWS_SLUGS.map((slug) => ({
  slug,
  title: slug,
  excerpt: `${slug} excerpt`,
  body: [{ type: "p", text: "Body" }],
}));

describe("news", () => {
  it("exposes the five migrated articles", () => {
    expect(NEWS_SLUGS).toEqual([
      "kalibriertische-profilextrusion",
      "portfolio-erweiterung",
      "bauboom-nachfrage",
      "produktionshallen-erweitert",
      "jubilaeum",
    ]);
  });

  it("maps TYPO3 news IDs to slugs", () => {
    expect(getNewsSlugFromLegacyId("22")).toBe(
      "kalibriertische-profilextrusion",
    );
    expect(getNewsSlugFromLegacyId("24")).toBe("portfolio-erweiterung");
    expect(getNewsSlugFromLegacyId("27")).toBe("bauboom-nachfrage");
    expect(getNewsSlugFromLegacyId("28")).toBe("produktionshallen-erweitert");
    expect(getNewsSlugFromLegacyId("40")).toBe("jubilaeum");
    expect(getNewsSlugFromLegacyId("99")).toBeUndefined();
    expect(getNewsSlugFromLegacyId(undefined)).toBeUndefined();
  });

  it("validates slugs, finds items, and returns images", () => {
    expect(isNewsSlug("jubilaeum")).toBe(true);
    expect(isNewsSlug("unknown")).toBe(false);
    expect(findNewsItem(sampleItems, "jubilaeum")?.title).toBe("jubilaeum");
    expect(findNewsItem(sampleItems, "missing")).toBeUndefined();
    expect(getNewsImages("jubilaeum")[0]?.src).toBe(
      "/images/news/jubilaeum.jpg",
    );
  });

  it("returns the latest N articles in listing order", () => {
    const latest = getLatestNews(sampleItems, 3);
    expect(latest.map((item) => item.slug)).toEqual([
      "kalibriertische-profilextrusion",
      "portfolio-erweiterung",
      "bauboom-nachfrage",
    ]);
    expect(getLatestNews([], 3)).toEqual([]);
  });
});
