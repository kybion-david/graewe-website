"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const t = useTranslations("nav");

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm flex-wrap">
        <li>
          <Link href="/" className="text-grey-400 hover:text-dark transition-colors">
            {t("home")}
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-grey-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {item.href ? (
              <Link href={item.href} className="text-grey-400 hover:text-dark transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-dark font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
