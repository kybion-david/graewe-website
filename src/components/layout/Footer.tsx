"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-bg-footer text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Legal links row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 py-5 border-b border-white/10 text-sm">
          <Link href="/kontakt" className="text-grey-400 hover:text-white transition-colors">{t("footer.contact")}</Link>
          <Link href="/impressum" className="text-grey-400 hover:text-white transition-colors">{t("footer.imprint")}</Link>
          <Link href="/datenschutz" className="text-grey-400 hover:text-white transition-colors">{t("footer.privacy")}</Link>
          <Link href="/datenschutz" className="text-grey-400 hover:text-white transition-colors">{t("footer.sitemap")}</Link>
          <Link href="/datenschutz" className="text-grey-400 hover:text-white transition-colors">{t("footer.cookies")}</Link>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          {/* Contact info */}
          <div className="flex items-start gap-4">
            <a
              href="tel:+4976317944-0"
              className="flex items-center gap-2 text-grey-300 hover:text-white transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </span>
              <span className="text-sm">{t("footer.phone")}</span>
            </a>
            <a
              href="mailto:info@graewe.com"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors"
              aria-label="E-Mail"
            >
              <svg className="w-4 h-4 text-grey-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </a>
          </div>

          {/* Nav links column 1 */}
          <div className="text-sm space-y-1.5">
            <Link href="/unternehmen/wer-ist-graewe" className="block text-grey-400 hover:text-white transition-colors">{t("nav.company")}</Link>
            <Link href="/produkte/rohrextrusion" className="block text-grey-400 hover:text-white transition-colors">{t("nav.products")}</Link>
            <Link href="/aktuelles" className="block text-grey-400 hover:text-white transition-colors">{t("nav.news")}</Link>
            <Link href="/stellenanzeigen" className="block text-grey-400 hover:text-white transition-colors">{t("nav.jobs")}</Link>
          </div>

          {/* Nav links column 2 */}
          <div className="text-sm space-y-1.5">
            <Link href="/gebrauchtmaschinen" className="block text-grey-400 hover:text-white transition-colors">{t("nav.usedMachines")}</Link>
            <Link href="/team" className="block text-grey-400 hover:text-white transition-colors">{t("nav.team")}</Link>
            <Link href="/produktrechner" className="block text-grey-400 hover:text-white transition-colors">{t("nav.calculator")}</Link>
            <Link href="/downloads" className="block text-grey-400 hover:text-white transition-colors">{t("nav.downloads")}</Link>
          </div>

          {/* Social + next logo */}
          <div className="flex items-start justify-end gap-5">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/graewegmbh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-grey-400 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/channel/UCgraewe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-grey-400 hover:text-white transition-colors"
            >
              <svg className="w-10 h-8" fill="currentColor" viewBox="0 0 576 512">
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
              </svg>
            </a>
            {/* next logo */}
            <a
              href="http://www.next-machines.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-grey-300 hover:text-white transition-colors text-right"
            >
              <span className="font-black text-2xl tracking-tight leading-none">next</span>
              <br />
              <span className="text-[10px] tracking-wide text-grey-400">SECOND HAND · FIRST QUALITY</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-bg-footer-bottom">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-grey-500">
            &copy; {new Date().getFullYear()} GRAEWE GmbH Maschinenbau. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
