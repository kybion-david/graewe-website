"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  fr: "FR",
  ru: "RU",
  es: "ES",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center gap-1 text-sm font-medium text-dark hover:text-dark-muted transition-colors"
      >
        {localeLabels[locale]}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-white shadow-lg border border-grey-200 py-1 z-50 min-w-[60px]">
            {locales.filter((l) => l !== locale).map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className="block w-full px-4 py-1.5 text-sm text-left text-text-muted hover:text-dark hover:bg-grey-100 transition-colors"
              >
                {localeLabels[loc]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
