import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/routing";

type NewsItem = { slug: string; title: string; excerpt: string };

const NEWS_SLUGS = [
  "kalibriertische-profilextrusion",
  "portfolio-erweiterung",
  "bauboom-nachfrage",
  "produktionshallen-erweitert",
  "jubilaeum",
] as const;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    NEWS_SLUGS.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const items = t.raw("items") as NewsItem[];
  const item = items.find((i) => i.slug === slug);
  return { title: item?.title ?? t("title") };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "news" });
  const items = t.raw("items") as NewsItem[];
  const item = items.find((i) => i.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <article>
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-6">
          {item.title}
        </h1>
        <div className="rounded-lg border border-dashed border-grey-300 bg-grey-100 p-8 text-text-muted">
          <p className="mb-4">{item.excerpt}</p>
          <p className="text-sm">{t("articlePlaceholder")}</p>
        </div>
      </article>
    </div>
  );
}
