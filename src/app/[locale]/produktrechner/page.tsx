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
    <div className="py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-dark">{t("title")}</h1>
        </div>
        <div className="w-12 h-1 bg-accent mb-4" />
        <p className="text-text-muted mb-8 text-lg">{t("intro")}</p>
        <div className="bg-white rounded-xl border border-grey-200 shadow-sm p-6 md:p-8">
          <Calculator />
        </div>
      </div>
    </div>
  );
}
