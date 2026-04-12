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
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-accent font-medium mb-4">{t("whoIsGraewe.breadcrumb")}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
          {t("whoIsGraewe.title")}
        </h1>
        <h2 className="text-xl text-text-muted mb-8">{t("whoIsGraewe.subtitle")}</h2>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-2/3 prose prose-lg max-w-none space-y-4 text-text">
            <p>{t("whoIsGraewe.p1")}</p>
            <p>{t("whoIsGraewe.p2")}</p>
            <p>{t("whoIsGraewe.p3")}</p>
          </div>
          <div className="md:w-1/3">
            <Image
              src="/images/company/geschaeftsfuehrer.jpg"
              alt="Geschäftsführer GRAEWE"
              width={350}
              height={233}
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
