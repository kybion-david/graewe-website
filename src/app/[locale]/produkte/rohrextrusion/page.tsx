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
  return { title: t("pipeExtrusion.title") };
}

export default async function PipeExtrusionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const examplesList = t.raw("pipeExtrusion.examplesList") as string[];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductSidebar />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-dark mb-4">{t("pipeExtrusion.title")}</h1>
            <p className="text-lg text-text-muted mb-6">{t("pipeExtrusion.description")}</p>
            <div>
              <p className="font-medium text-dark mb-3">{t("pipeExtrusion.examples")}</p>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                {examplesList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
