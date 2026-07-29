import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import {
  NEWS_SLUGS,
  findNewsItem,
  getNewsImages,
  isNewsSlug,
  type NewsBodyBlock,
  type NewsItem,
} from "@/lib/news";
import { pageMetadata } from "@/lib/pageMetadata";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    NEWS_SLUGS.map((slug) => ({ locale, slug })),
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
  const item = findNewsItem(items, slug);
  return pageMetadata(
    item?.title ?? t("title"),
    item?.excerpt ?? t("metaDescription"),
  );
}

function NewsBody({ blocks }: { blocks: NewsBodyBlock[] }) {
  return (
    <div className="space-y-5 text-text text-[17px] leading-relaxed">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={index}>{block.text}</p>;
        }
        if (block.type === "h") {
          return (
            <h2 key={index} className="text-xl font-bold text-dark pt-2">
              {block.text}
            </h2>
          );
        }
        return (
          <ul key={index} className="list-disc pl-5 space-y-1.5">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isNewsSlug(slug)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "news" });
  const items = t.raw("items") as NewsItem[];
  const item = findNewsItem(items, slug);

  if (!item) {
    notFound();
  }

  const images = getNewsImages(slug);
  const showGermanNotice = Boolean(item.germanOriginal) && locale !== "de";

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
          {t("backToList")}
        </Link>

        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
            {item.title}
          </h1>
          <div className="w-12 h-1 bg-accent mb-8" />

          {showGermanNotice && (
            <p className="mb-6 text-sm text-text-muted border-l-4 border-accent pl-3">
              {t("germanOriginalNotice")}
            </p>
          )}

          {images.length > 0 && (
            <div
              className={`mb-8 grid gap-4 ${
                images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {images.map((image) => (
                <div
                  key={image.src}
                  className="relative overflow-hidden rounded-lg bg-grey-100"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          )}

          <NewsBody blocks={item.body} />

          {item.source && (
            <p className="mt-8 text-sm text-text-muted italic">{item.source}</p>
          )}
        </article>
      </div>
    </div>
  );
}
