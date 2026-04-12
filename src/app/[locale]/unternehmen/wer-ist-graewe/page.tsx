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
  return { title: t("whoIsGraewe.breadcrumb") };
}

export default async function WhoIsGraewePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "company" });

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">
          {t("whoIsGraewe.breadcrumb")}
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-2">
          {t("whoIsGraewe.title")}
        </h1>
        <div className="w-16 h-1 bg-accent mb-6" />
        <h2 className="text-xl text-text-muted leading-relaxed mb-10">
          {t("whoIsGraewe.subtitle")}
        </h2>

        <div className="flex flex-col md:flex-row gap-10 mb-8">
          <div className="md:w-2/3 space-y-5 text-text leading-relaxed text-[17px]">
            <p>{t("whoIsGraewe.p1")}</p>
            <p>{t("whoIsGraewe.p2")}</p>
            <p>{t("whoIsGraewe.p3")}</p>
          </div>
          <div className="md:w-1/3">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/company/geschaeftsfuehrer.jpg"
                alt="Geschäftsführer GRAEWE"
                width={350}
                height={233}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/70 to-transparent p-4">
                <p className="text-white text-sm font-medium">Geschäftsführung</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
