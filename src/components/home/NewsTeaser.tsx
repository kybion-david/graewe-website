"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function NewsTeaser() {
  const t = useTranslations();

  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Vimeo video embed */}
          <div>
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
          </div>

          {/* News area */}
          <div className="flex items-center justify-center min-h-[120px]">
            <p className="text-text-muted text-sm italic">
              {t("home.noNews")}
            </p>
          </div>

          {/* Produktrechner teaser */}
          <div>
            <Link href="/produktrechner" className="group block">
              <div className="bg-accent text-dark font-bold px-5 py-2.5 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {t("footer.productCalculator")}
              </div>
              <div className="bg-white p-2">
                <Image
                  src="/images/company/produktrechner.jpg"
                  alt="Produktrechner"
                  width={400}
                  height={240}
                  className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
