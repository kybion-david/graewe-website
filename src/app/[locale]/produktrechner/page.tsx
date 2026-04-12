import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Calculator } from "@/components/calculator/Calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculator" });
  return { title: t("title") };
}

export default async function ProduktrechnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "calculator" });

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-4">{t("title")}</h1>
        <p className="text-text-muted mb-8">{t("intro")}</p>
        <Calculator />
      </div>
    </div>
  );
}
