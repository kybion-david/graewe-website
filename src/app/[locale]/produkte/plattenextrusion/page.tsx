import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ProductSidebar } from "@/components/layout/ProductSidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("sheetExtrusion.title") };
}

export default async function SheetExtrusionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <ProductSidebar />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
              {t("sheetExtrusion.title")}
            </h1>
            <div className="w-12 h-1 bg-accent mb-6" />
            <p className="text-lg text-text-muted leading-relaxed mb-4">
              {t("sheetExtrusion.description")}
            </p>
            <p className="text-lg text-text-muted leading-relaxed">
              {t("sheetExtrusion.p2")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
