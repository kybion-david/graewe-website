/**
 * News articles — slugs, TYPO3 legacy IDs, and image paths.
 * Localized titles/bodies live in `src/messages/{locale}.json` under `news.items`.
 */

export const NEWS_SLUGS = [
  "kalibriertische-profilextrusion",
  "portfolio-erweiterung",
  "bauboom-nachfrage",
  "produktionshallen-erweitert",
  "jubilaeum",
] as const;

export type NewsSlug = (typeof NEWS_SLUGS)[number];

/** Old TYPO3 `tx_news_pi1[news]` IDs → new slugs */
export const NEWS_LEGACY_IDS: Record<string, NewsSlug> = {
  "22": "kalibriertische-profilextrusion",
  "24": "portfolio-erweiterung",
  "27": "bauboom-nachfrage",
  "28": "produktionshallen-erweitert",
  "40": "jubilaeum",
};

export const NEWS_TEASER_COUNT = 3;

export type NewsBodyBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] };

export type NewsItem = {
  slug: NewsSlug;
  title: string;
  excerpt: string;
  body: NewsBodyBlock[];
  /** When true, body is German; show `news.germanOriginalNotice` on non-DE locales */
  germanOriginal?: boolean;
  source?: string;
};

export type NewsImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const NEWS_IMAGES: Record<NewsSlug, NewsImage[]> = {
  "kalibriertische-profilextrusion": [
    {
      src: "/images/news/kalibriertische-1.jpg",
      alt: "Kalibriertisch Profilextrusion",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/news/kalibriertische-2.jpg",
      alt: "Kalibriertisch Detail",
      width: 1200,
      height: 800,
    },
  ],
  "portfolio-erweiterung": [
    {
      src: "/images/news/portfolio-neuhardt.jpg",
      alt: "Thomas Neuhardt",
      width: 800,
      height: 1100,
    },
    {
      src: "/images/news/portfolio-forsch.jpg",
      alt: "Karl-Heinz Forsch",
      width: 800,
      height: 1054,
    },
  ],
  "bauboom-nachfrage": [
    {
      src: "/images/news/bauboom.jpg",
      alt: "GRAEWE Standort Neuenburg",
      width: 1200,
      height: 826,
    },
  ],
  "produktionshallen-erweitert": [
    {
      src: "/images/news/produktionshallen.jpg",
      alt: "Extrusion 2/2014 — Produktionshallen erweitert",
      width: 1200,
      height: 555,
    },
  ],
  jubilaeum: [
    {
      src: "/images/news/jubilaeum.jpg",
      alt: "GRAEWE — Celebrating 40 Years of X-tras",
      width: 1200,
      height: 804,
    },
  ],
};

export function isNewsSlug(value: string): value is NewsSlug {
  return (NEWS_SLUGS as readonly string[]).includes(value);
}

export function getNewsSlugFromLegacyId(
  newsId: string | undefined,
): NewsSlug | undefined {
  if (!newsId) return undefined;
  return NEWS_LEGACY_IDS[newsId];
}

export function findNewsItem(
  items: NewsItem[],
  slug: string,
): NewsItem | undefined {
  return items.find((item) => item.slug === slug);
}

export function getNewsImages(slug: NewsSlug): NewsImage[] {
  return NEWS_IMAGES[slug] ?? [];
}

/** Listing/teaser order: newest first (matches live graewe.com order). */
export function getLatestNews(items: NewsItem[], count = NEWS_TEASER_COUNT): NewsItem[] {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  return NEWS_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (item): item is NewsItem => item !== undefined,
  ).slice(0, count);
}
