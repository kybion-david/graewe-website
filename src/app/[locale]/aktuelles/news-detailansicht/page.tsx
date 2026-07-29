import { setRequestLocale } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { getNewsSlugFromLegacyId } from "@/lib/news";

/**
 * Legacy TYPO3 news detail URLs:
 * /aktuelles/news-detailansicht?tx_news_pi1[news]=22&...
 * /en/news/news-detail?tx_news_pi1[news]=22&... (path still German slug after cutover)
 */
export default async function LegacyNewsDetailRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const raw =
    query["tx_news_pi1[news]"] ?? query["tx_news_pi1%5Bnews%5D"];
  const newsId = Array.isArray(raw) ? raw[0] : raw;
  const slug = getNewsSlugFromLegacyId(newsId);

  if (slug) {
    permanentRedirect({ href: `/aktuelles/${slug}`, locale });
  }

  permanentRedirect({ href: "/aktuelles", locale });
}
