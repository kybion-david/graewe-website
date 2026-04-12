import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  return { title: t("title") };
}

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "jobs" });

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-8">
        {t("title")}
      </h1>
      <div className="rounded-lg border border-grey-300 bg-grey-100 p-8 text-text-muted">
        {t("noJobs")}
      </div>
    </div>
  );
}
