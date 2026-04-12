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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductSidebar />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-dark mb-4">
              {t("sheetExtrusion.title")}
            </h1>
            <p className="text-lg text-text-muted mb-4">
              {t("sheetExtrusion.description")}
            </p>
            <p className="text-lg text-text-muted">
              {t("sheetExtrusion.p2")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
