import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "successStories" });
  return { title: t("title") };
}

export default async function SuccessStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "successStories" });

  const keys = ["maplast", "asg"] as const;

  const galleryImages = [
    "/images/success-stories/factory-1.jpg",
    "/images/success-stories/factory-2.jpg",
    "/images/success-stories/factory-3.jpg",
    "/images/success-stories/factory-4.jpg",
    "/images/success-stories/factory-5.jpg",
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-10">
        {t("title")}
      </h1>
      <div className="space-y-8">
        {keys.map((key) => (
          <article
            key={key}
            className="rounded-lg border border-grey-300 bg-grey-100 p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-dark mb-4">
              {t(`testimonials.${key}.company`)}
            </h2>
            <blockquote className="text-text border-l-4 border-accent pl-4 italic leading-relaxed">
              {t(`testimonials.${key}.text`)}
            </blockquote>
            <footer className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm text-text-muted">
              <span className="font-medium text-text">
                {t(`testimonials.${key}.author`)}
              </span>
              <span>{t(`testimonials.${key}.location`)}</span>
            </footer>
          </article>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
        {galleryImages.map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-grey-100"
          >
            <Image
              src={src}
              alt={`GRAEWE factory ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
