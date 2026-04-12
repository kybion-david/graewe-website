"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  const companyLinks = [
    { href: "/unternehmen/wer-ist-graewe", label: t("whoIsGraewe") },
    { href: "/unternehmen/was-macht-graewe", label: t("whatDoesGraewe") },
    { href: "/unternehmen/wofuer-steht-graewe", label: t("whatDoesGraeweStandFor") },
    { href: "/unternehmen/die-graewe-gruppe", label: t("graeweGroup") },
  ];

  const productLinks = [
    { href: "/produkte/rohrextrusion", label: t("pipeExtrusion") },
    { href: "/produkte/profilextrusion", label: t("profileExtrusion") },
    { href: "/produkte/plattenextrusion", label: t("sheetExtrusion") },
  ];

  const mainLinks = [
    { href: "/success-stories", label: t("successStories") },
    { href: "/aktuelles", label: t("news") },
    { href: "/produktrechner", label: t("calculator") },
    { href: "/gebrauchtmaschinen", label: t("usedMachines") },
    { href: "/downloads", label: t("downloads") },
    { href: "/team", label: t("team") },
    { href: "/kontakt", label: t("contact") },
    { href: "/stellenanzeigen", label: t("jobs") },
  ];

  return (
    <header className="relative z-50" role="banner">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between pt-6 pb-2">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo/graewe-logo.jpg"
              alt="GRAEWE – Xtras for Extrusion"
              width={220}
              height={60}
              className="h-auto w-[180px] sm:w-[220px]"
              priority
            />
          </Link>

          {/* Right side: language + menu */}
          <div className="flex items-center gap-2 sm:gap-4 pt-1">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Navigation menu"
              className="bg-accent hover:bg-accent-dark text-dark font-bold px-5 py-2 text-sm tracking-wide transition-colors"
            >
              MENÜ
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown menu panel */}
      {menuOpen && (
        <div className="absolute top-full right-0 z-[100] w-full">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end">
              <nav className="bg-white shadow-xl border border-grey-200 p-6 sm:p-8 w-full sm:w-auto sm:min-w-[500px]" aria-label="Main navigation">
                <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                  {/* Left column */}
                  <div>
                    <p className="font-bold text-dark mb-2">{t("company")}</p>
                    {companyLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-1 text-sm text-text-muted hover:text-dark transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}

                    <p className="font-bold text-dark mt-4 mb-2">{t("products")}</p>
                    {productLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-1 text-sm text-text-muted hover:text-dark transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Right column */}
                  <div>
                    {mainLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-1.5 font-bold text-sm text-dark hover:text-accent-dark transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Click-away overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[99]"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
