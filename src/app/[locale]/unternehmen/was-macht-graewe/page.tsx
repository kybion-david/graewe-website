import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "company" });
  return { title: t("whatDoesGraewe.breadcrumb") };
}

export default async function WhatDoesGraewePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "company" });

  const galleryImages = [
    "/images/company/gallery/factory-4.jpg",
    "/images/company/gallery/production-1.jpg",
    "/images/company/gallery/factory-1.jpg",
    "/images/company/gallery/factory-8.jpg",
    "/images/company/gallery/production-2.jpg",
    "/images/company/gallery/factory-2.jpg",
    "/images/company/gallery/production-3.jpg",
  ];

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">
          {t("whatDoesGraewe.breadcrumb")}
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-2">
          {t("whatDoesGraewe.title")}
        </h1>
        <div className="w-16 h-1 bg-accent mb-6" />
        <h2 className="text-xl text-text-muted leading-relaxed mb-10">
          {t("whatDoesGraewe.subtitle")}
        </h2>

        <div className="space-y-5 text-text leading-relaxed text-[17px] mb-12">
          <p>{t("whatDoesGraewe.p1")}</p>
          <p>{t("whatDoesGraewe.p2")}</p>
          <p>{t("whatDoesGraewe.p3")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-grey-100"
            >
              <Image
                src={src}
                alt={`GRAEWE ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
