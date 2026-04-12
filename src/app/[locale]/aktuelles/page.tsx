import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

type NewsItem = { slug: string; title: string; excerpt: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title") };
}

export default async function AktuellesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "news" });
  const items = t.raw("items") as NewsItem[];

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
          {t("title")}
        </h1>
        <div className="w-16 h-1 bg-accent mb-10" />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0">
          {items.map((item) => (
            <li key={item.slug}>
              <article className="group h-full rounded-xl border border-grey-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300 flex flex-col">
                <h2 className="text-lg font-bold text-dark mb-3">
                  <Link
                    href={`/aktuelles/${item.slug}`}
                    className="hover:text-accent-dark transition-colors"
                  >
                    {item.title}
                  </Link>
                </h2>
                <p className="text-text-muted text-sm leading-relaxed flex-grow mb-4">
                  {item.excerpt}
                </p>
                <Link
                  href={`/aktuelles/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-dark group-hover:text-accent-dark transition-colors self-start"
                >
                  {t("readMore")}
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
