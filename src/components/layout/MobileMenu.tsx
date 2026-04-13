"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  companyLinks: { href: string; label: string }[];
  productLinks: { href: string; label: string }[];
  mainLinks: { href: string; label: string }[];
}

export function MobileMenu({
  isOpen,
  onClose,
  companyLinks,
  productLinks,
  mainLinks,
}: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white overflow-y-auto shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-grey-200">
          <span className="text-lg font-bold text-dark tracking-tight">GRAEWE</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-grey-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-5">
          <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-2">
            Unternehmen
          </p>
          {companyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 px-3 text-sm text-text-muted hover:text-dark hover:bg-grey-100 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="my-4 border-t border-grey-200" />

          <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-2">
            Produkte
          </p>
          {productLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 py-2.5 px-3 text-sm font-semibold text-dark hover:bg-accent/10 rounded-lg transition-colors"
            >
              <span className="w-2 h-2 bg-accent rounded-full shrink-0" />
              {link.label}
            </Link>
          ))}

          <div className="my-4 border-t border-grey-200" />

          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 px-3 text-sm text-dark hover:bg-grey-100 rounded-lg transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
