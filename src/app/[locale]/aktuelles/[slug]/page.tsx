import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
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
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/aktuelles"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-dark transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("title")}
        </Link>

        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
            {item.title}
          </h1>
          <div className="w-12 h-1 bg-accent mb-8" />

          <div className="rounded-xl border border-grey-200 bg-grey-100 p-8">
            <p className="text-text text-[17px] leading-relaxed mb-4">{item.excerpt}</p>
            <p className="text-sm text-text-muted">{t("articlePlaceholder")}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
