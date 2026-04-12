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
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
          {t("title")}
        </h1>
        <div className="w-16 h-1 bg-accent mb-10" />

        <div className="space-y-8">
          {keys.map((key) => (
            <article
              key={key}
              className="rounded-xl bg-white border border-grey-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                {t(`testimonials.${key}.company`)}
              </h2>
              <blockquote className="text-text border-l-4 border-accent pl-5 italic leading-relaxed text-[17px]">
                {t(`testimonials.${key}.text`)}
              </blockquote>
              <footer className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
                <span className="font-semibold text-dark">
                  {t(`testimonials.${key}.author`)}
                </span>
                <span className="text-text-muted">{t(`testimonials.${key}.location`)}</span>
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-5 gap-3">
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-grey-100"
            >
              <Image
                src={src}
                alt={`GRAEWE factory ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
