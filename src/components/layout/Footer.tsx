"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-bg-footer text-white">
      {/* CTA banner */}
      <div className="bg-accent">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-dark font-bold text-sm sm:text-base">
                {t("footer.productCalculator")}
              </span>
            </div>
            <Link
              href="/produktrechner"
              className="inline-flex items-center gap-2 bg-dark text-white px-5 py-2 text-sm font-bold hover:bg-dark-light transition-colors"
            >
              {t("footer.productCalculator")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Company info */}
          <div>
            <Image
              src="/images/logo/graewe-logo.jpg"
              alt="GRAEWE"
              width={160}
              height={44}
              className="h-auto w-[140px] brightness-0 invert mb-5"
            />
            <p className="text-grey-400 text-sm leading-relaxed mb-4">
              GRAEWE GmbH Maschinenbau
              <br />
              Max-Planck-Straße 1-3
              <br />
              79395 Neuenburg am Rhein
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:+4976317944-0"
                className="flex items-center gap-2 text-grey-300 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {t("footer.phone")}
              </a>
              <a
                href="mailto:info@graewe.com"
                className="flex items-center gap-2 text-grey-300 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@graewe.com
              </a>
            </div>
          </div>

          {/* Navigation column 1 */}
          <div>
            <h3 className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-4">
              {t("nav.company")}
            </h3>
            <div className="space-y-2 text-sm">
              <Link href="/unternehmen/wer-ist-graewe" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.whoIsGraewe")}</Link>
              <Link href="/unternehmen/was-macht-graewe" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.whatDoesGraewe")}</Link>
              <Link href="/unternehmen/wofuer-steht-graewe" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.whatDoesGraeweStandFor")}</Link>
              <Link href="/unternehmen/die-graewe-gruppe" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.graeweGroup")}</Link>
            </div>
          </div>

          {/* Navigation column 2 */}
          <div>
            <h3 className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-4">
              {t("nav.products")}
            </h3>
            <div className="space-y-2 text-sm">
              <Link href="/produkte/rohrextrusion" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.pipeExtrusion")}</Link>
              <Link href="/produkte/profilextrusion" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.profileExtrusion")}</Link>
              <Link href="/produkte/plattenextrusion" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.sheetExtrusion")}</Link>
            </div>

            <h3 className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-4 mt-6">
              Service
            </h3>
            <div className="space-y-2 text-sm">
              <Link href="/aktuelles" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.news")}</Link>
              <Link href="/gebrauchtmaschinen" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.usedMachines")}</Link>
              <Link href="/downloads" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.downloads")}</Link>
              <Link href="/produktrechner" className="block text-grey-300 hover:text-accent transition-colors">{t("nav.calculator")}</Link>
            </div>
          </div>

          {/* Social + Next machines */}
          <div>
            <h3 className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-4">
              Social
            </h3>
            <div className="flex gap-3 mb-8">
              <a
                href="https://www.facebook.com/graewegmbh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-grey-300 hover:bg-accent hover:text-dark transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCgraewe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-grey-300 hover:bg-accent hover:text-dark transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                </svg>
              </a>
            </div>

            {/* next branding */}
            <a
              href="http://www.next-machines.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                <span className="font-black text-xl tracking-tight leading-none text-white group-hover:text-accent transition-colors">next</span>
                <br />
                <span className="text-[10px] tracking-wide text-grey-400">SECOND HAND · FIRST QUALITY</span>
              </div>
            </a>
          </div>
        </div>

        {/* Legal links */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-grey-500">
            &copy; {new Date().getFullYear()} GRAEWE GmbH Maschinenbau
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <Link href="/kontakt" className="text-grey-500 hover:text-grey-300 transition-colors">{t("footer.contact")}</Link>
            <Link href="/impressum" className="text-grey-500 hover:text-grey-300 transition-colors">{t("footer.imprint")}</Link>
            <Link href="/datenschutz" className="text-grey-500 hover:text-grey-300 transition-colors">{t("footer.privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
