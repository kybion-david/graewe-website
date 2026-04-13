import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type DownloadItem = { title: string; file: string; size: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "downloads" });
  return { title: t("title") };
}

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "downloads" });
  const items = t.raw("items") as DownloadItem[];

  return (
    <div className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
          {t("title")}
        </h1>
        <div className="w-16 h-1 bg-accent mb-3" />
        <p className="text-text-muted mb-10">{t("subtitle")}</p>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <a
                key={item.file}
                href={item.file}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-grey-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <svg
                      className="w-6 h-6 text-accent-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-dark group-hover:text-accent-dark transition-colors leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-xs text-grey-400 mt-1">
                      PDF, {item.size}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-grey-200">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-dark group-hover:text-accent-dark transition-colors">
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    {t("downloadPdf")}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-grey-200 bg-grey-100 p-8 text-center">
            <svg
              className="w-12 h-12 text-grey-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p className="text-text-muted">{t("noDownloads")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
