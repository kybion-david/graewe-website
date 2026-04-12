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
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-10">
        {t("title")}
      </h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0">
        {items.map((item) => (
          <li key={item.slug}>
            <article className="h-full rounded-lg border border-grey-300 bg-grey-100 p-6 shadow-sm flex flex-col">
              <h2 className="text-lg font-semibold text-dark mb-3">
                <Link
                  href={`/aktuelles/${item.slug}`}
                  className="hover:text-accent transition-colors"
                >
                  {item.title}
                </Link>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed flex-grow mb-4">
                {item.excerpt}
              </p>
              <Link
                href={`/aktuelles/${item.slug}`}
                className="text-accent text-sm font-medium hover:text-accent-dark self-start"
              >
                {t("readMore")} →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
