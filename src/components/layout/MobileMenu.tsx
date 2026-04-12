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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-grey-200">
          <span className="text-lg font-bold text-dark">GRAEWE</span>
          <button onClick={onClose} className="p-2 hover:bg-grey-100 rounded" aria-label="Close menu">
            <svg className="w-6 h-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {companyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block py-2 px-3 text-sm text-text-muted hover:text-dark hover:bg-grey-100 rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t border-grey-200" />
          {productLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block py-2 px-3 text-sm font-bold text-accent-dark hover:bg-grey-100 rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t border-grey-200" />
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block py-2 px-3 text-sm text-dark hover:bg-grey-100 rounded transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
