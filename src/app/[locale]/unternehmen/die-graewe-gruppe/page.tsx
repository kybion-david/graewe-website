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
  return { title: t("graeweGroup.breadcrumb") };
}

export default async function GraeweGroupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "company" });

  const galleryImages = [
    "/images/company/gallery/factory-1.jpg",
    "/images/company/gallery/factory-2.jpg",
    "/images/company/gallery/factory-3.jpg",
    "/images/company/gallery/factory-4.jpg",
    "/images/company/gallery/factory-5.jpg",
    "/images/company/gallery/factory-6.jpg",
    "/images/company/gallery/factory-7.jpg",
    "/images/company/gallery/factory-8.jpg",
  ];

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">
          {t("graeweGroup.breadcrumb")}
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-2">
          {t("graeweGroup.title")}
        </h1>
        <div className="w-16 h-1 bg-accent mb-10" />

        {/* GRAEWE GmbH */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="md:w-1/3">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/company/graewe-building.jpg"
                alt="GRAEWE GmbH"
                width={300}
                height={200}
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-text leading-relaxed text-[17px]">
              {t("graeweGroup.p1")}
            </p>
          </div>
        </div>

        {/* next GmbH */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/3">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/company/next-logo.jpg"
                alt="next GmbH"
                width={300}
                height={200}
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-text leading-relaxed text-[17px]">
              {t("graeweGroup.p2")}
            </p>
          </div>
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
