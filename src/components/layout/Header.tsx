"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white"
      }`}
      role="banner"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 relative">
            <Image
              src="/images/logo/graewe-logo.jpg"
              alt="GRAEWE – Xtras for Extrusion"
              width={220}
              height={60}
              className={`h-auto transition-all duration-300 ${
                scrolled ? "w-[150px] sm:w-[180px]" : "w-[180px] sm:w-[220px]"
              }`}
              priority
            />
          </Link>

          {/* Right side: language + menu */}
          <div className="flex items-center gap-3 sm:gap-4" ref={menuRef}>
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Navigation menu"
              className={`relative bg-accent hover:bg-accent-dark text-dark font-bold px-5 py-2.5 text-sm tracking-wider transition-all duration-200 ${
                menuOpen ? "bg-accent-dark" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="flex flex-col gap-[3px]">
                  <span
                    className={`block w-4 h-[2px] bg-dark transition-all duration-300 ${
                      menuOpen ? "rotate-45 translate-y-[5px]" : ""
                    }`}
                  />
                  <span
                    className={`block w-4 h-[2px] bg-dark transition-all duration-300 ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-4 h-[2px] bg-dark transition-all duration-300 ${
                      menuOpen ? "-rotate-45 -translate-y-[5px]" : ""
                    }`}
                  />
                </span>
                <span className="hidden sm:inline">MENÜ</span>
              </span>
            </button>

            {/* Desktop dropdown menu */}
            <div
              className={`hidden lg:block absolute top-full right-0 w-full transition-all duration-300 ease-out origin-top ${
                menuOpen
                  ? "opacity-100 scale-y-100 pointer-events-auto"
                  : "opacity-0 scale-y-95 pointer-events-none"
              }`}
            >
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-end">
                  <nav
                    className="bg-white shadow-2xl border border-grey-200 w-full sm:w-auto sm:min-w-[540px] overflow-hidden"
                    aria-label="Main navigation"
                  >
                    {/* Yellow accent bar at top */}
                    <div className="h-1 bg-accent" />

                    <div className="p-6 sm:p-8">
                      <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                        {/* Left column */}
                        <div>
                          <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-3">
                            {t("company")}
                          </p>
                          {companyLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMenuOpen(false)}
                              className="block py-1.5 text-sm text-text-muted hover:text-dark hover:translate-x-1 transition-all duration-200"
                            >
                              {link.label}
                            </Link>
                          ))}

                          <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mt-6 mb-3">
                            {t("products")}
                          </p>
                          {productLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMenuOpen(false)}
                              className="block py-1.5 text-sm text-text-muted hover:text-dark hover:translate-x-1 transition-all duration-200"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>

                        {/* Right column */}
                        <div>
                          <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-3">
                            &nbsp;
                          </p>
                          {mainLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMenuOpen(false)}
                              className="group flex items-center gap-2 py-1.5 text-sm font-semibold text-dark hover:text-accent-dark transition-all duration-200"
                            >
                              <span className="w-0 group-hover:w-3 h-[2px] bg-accent transition-all duration-200" />
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
            {/* Mobile menu */}
            <MobileMenu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              companyLinks={companyLinks}
              productLinks={productLinks}
              mainLinks={mainLinks}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
