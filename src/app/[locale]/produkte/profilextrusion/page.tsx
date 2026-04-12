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
  return { title: t("profileExtrusion.title") };
}

export default async function ProfileExtrusionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const usedAsList = t.raw("profileExtrusion.usedAsList") as string[];
  const applicationsList = t.raw("profileExtrusion.applicationsList") as string[];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductSidebar />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-dark mb-6">
              {t("profileExtrusion.title")}
            </h1>
            <div className="space-y-6">
              <div>
                <p className="font-medium text-dark mb-3">
                  {t("profileExtrusion.usedAs")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-muted">
                  {usedAsList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-dark mb-3">
                  {t("profileExtrusion.applications")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-muted">
                  {applicationsList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
