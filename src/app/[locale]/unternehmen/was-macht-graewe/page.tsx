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
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-accent font-medium mb-4">{t("whatDoesGraewe.breadcrumb")}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
          {t("whatDoesGraewe.title")}
        </h1>
        <h2 className="text-xl text-text-muted mb-8">{t("whatDoesGraewe.subtitle")}</h2>
        <div className="prose prose-lg max-w-none space-y-4 text-text mb-10">
          <p>{t("whatDoesGraewe.p1")}</p>
          <p>{t("whatDoesGraewe.p2")}</p>
          <p>{t("whatDoesGraewe.p3")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] rounded-lg overflow-hidden bg-grey-100"
            >
              <Image
                src={src}
                alt={`GRAEWE ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
