import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "usedMachines" });
  return { title: t("title") };
}

export default async function UsedMachinesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "usedMachines" });
  const reasons = t.raw("reasons") as string[];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="relative mb-8">
        <Image
          src="/images/company/gebrauchtmaschinen.jpg"
          alt="Gebrauchtmaschinen"
          width={800}
          height={400}
          className="w-full h-auto"
        />
        <div className="absolute bottom-0 left-0 bg-accent px-4 py-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <span className="font-bold text-dark text-sm">{t("title")}</span>
          </div>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
        {t("title")}
      </h1>
      <p className="text-lg text-accent font-medium mb-6">{t("subtitle")}</p>
      <p className="text-text leading-relaxed mb-10">{t("intro")}</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-dark mb-4">
          {t("reasonsTitle")}
        </h2>
        <ul className="list-disc list-inside space-y-2 text-text">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10 rounded-lg bg-grey-100 border border-grey-300 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-dark mb-3">
          {t("overhaulsTitle")}
        </h2>
        <p className="text-text leading-relaxed">{t("overhaulsText")}</p>
      </section>

      <p className="mb-6">
        <a
          href="http://www.next-machines.com/startseite/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent font-semibold underline underline-offset-2 hover:text-accent-dark"
        >
          {t("catalogLink")}
        </a>
      </p>

      <address className="not-italic text-text-muted whitespace-pre-line border-t border-grey-300 pt-6">
        {t("nextAddress")}
      </address>
    </div>
  );
}
