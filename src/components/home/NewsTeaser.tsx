"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function NewsTeaser() {
  const t = useTranslations();

  return (
    <section className="bg-grey-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Vimeo video */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full aspect-video bg-dark">
              <iframe
                src="https://player.vimeo.com/video/987078686?badge=0&autopause=0&player_id=0&app_id=58479"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Graewe Video Coilers"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-grey-400 uppercase tracking-wider font-bold mb-1">Video</p>
              <p className="text-sm font-semibold text-dark">GRAEWE Coilers</p>
            </div>
          </div>

          {/* News placeholder */}
          <div className="flex flex-col items-center justify-center min-h-[200px] bg-white rounded-lg p-8 shadow-sm">
            <svg className="w-10 h-10 text-grey-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-text-muted text-sm text-center">
              {t("home.noNews")}
            </p>
            <Link
              href="/aktuelles"
              className="mt-4 text-sm font-semibold text-dark hover:text-accent-dark transition-colors flex items-center gap-1"
            >
              {t("nav.news")}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Produktrechner CTA */}
          <Link href="/produktrechner" className="group block">
            <div className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
              <div className="bg-accent text-dark font-bold px-5 py-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {t("footer.productCalculator")}
                </span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="bg-white p-3">
                <Image
                  src="/images/company/produktrechner.jpg"
                  alt="Produktrechner"
                  width={400}
                  height={240}
                  className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity rounded"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
