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
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <ProductSidebar />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
              {t("profileExtrusion.title")}
            </h1>
            <div className="w-12 h-1 bg-accent mb-8" />
            <div className="space-y-8">
              <div className="bg-grey-100 rounded-xl p-6">
                <p className="font-semibold text-dark mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent rounded-full" />
                  {t("profileExtrusion.usedAs")}
                </p>
                <ul className="space-y-2.5">
                  {usedAsList.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-text-muted">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-grey-100 rounded-xl p-6">
                <p className="font-semibold text-dark mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent rounded-full" />
                  {t("profileExtrusion.applications")}
                </p>
                <ul className="space-y-2.5">
                  {applicationsList.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-text-muted">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                      {item}
                    </li>
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
