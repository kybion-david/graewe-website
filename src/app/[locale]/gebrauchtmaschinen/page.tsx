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
    <div>
      {/* Hero banner */}
      <div className="relative">
        <Image
          src="/images/company/gebrauchtmaschinen.jpg"
          alt="Gebrauchtmaschinen"
          width={1200}
          height={400}
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-accent inline-flex items-center gap-2 px-4 py-2 mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-bold text-dark text-sm">{t("title")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {t("title")}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="text-lg text-accent-dark font-semibold mb-4">{t("subtitle")}</p>
        <p className="text-text leading-relaxed text-[17px] mb-10">{t("intro")}</p>

        <section className="mb-10 bg-grey-100 rounded-xl p-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {t("reasonsTitle")}
          </h2>
          <ul className="space-y-2.5">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-text">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl bg-white border border-grey-200 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            {t("overhaulsTitle")}
          </h2>
          <p className="text-text leading-relaxed">{t("overhaulsText")}</p>
        </section>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <a
            href="http://www.next-machines.com/startseite/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-dark font-bold px-6 py-3 hover:bg-accent-dark transition-colors"
          >
            {t("catalogLink")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>

        <address className="not-italic text-text-muted whitespace-pre-line border-t border-grey-200 pt-6 text-sm">
          {t("nextAddress")}
        </address>
      </div>
    </div>
  );
}
