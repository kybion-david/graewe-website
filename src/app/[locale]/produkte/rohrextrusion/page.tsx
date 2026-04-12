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
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <ProductSidebar />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
              {t("pipeExtrusion.title")}
            </h1>
            <div className="w-12 h-1 bg-accent mb-6" />
            <p className="text-lg text-text-muted leading-relaxed mb-8">
              {t("pipeExtrusion.description")}
            </p>
            <div className="bg-grey-100 rounded-xl p-6">
              <p className="font-semibold text-dark mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                {t("pipeExtrusion.examples")}
              </p>
              <ul className="space-y-2.5">
                {examplesList.map((item) => (
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
  );
}
