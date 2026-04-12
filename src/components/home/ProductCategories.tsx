"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  productCategories,
  type ProductCategory,
} from "@/lib/products";

const categories: {
  key: ProductCategory;
  navKey: string;
  descKey: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "rohrextrusion",
    navKey: "pipeExtrusion",
    descKey: "pipeExtrusionDesc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="24" cy="24" r="14" />
        <circle cx="24" cy="24" r="6" />
      </svg>
    ),
  },
  {
    key: "profilextrusion",
    navKey: "profileExtrusion",
    descKey: "profileExtrusionDesc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.5}>
        <rect x="8" y="14" width="32" height="20" rx="2" />
        <path d="M14 14V10h20v4M14 34v4h20v-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "plattenextrusion",
    navKey: "sheetExtrusion",
    descKey: "sheetExtrusionDesc",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6 14h36M6 22h36M6 30h36" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function ProductCategories() {
  const tNav = useTranslations("nav");
  const tHome = useTranslations("home");
  const tProducts = useTranslations("products");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {categories.map((cat, idx) => {
            const subs = productCategories[cat.key];
            const isHovered = hoveredIdx === idx;
            const isLast = idx === categories.length - 1;

            return (
              <div
                key={cat.key}
                className="relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Yellow subcategory panel — slides up above header */}
                <div
                  className="absolute bottom-full left-0 right-0 z-30 bg-accent overflow-hidden transition-[max-height,opacity] duration-500 ease-out"
                  style={{
                    maxHeight: isHovered ? "300px" : "0px",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <div className="px-5 py-4">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {subs.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/produkte/${cat.key}/${sub.slug}`}
                          className="text-[13px] text-dark underline hover:text-dark/70 transition-colors py-0.5"
                        >
                          {tProducts(`subcategories.${sub.translationKey}`)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grey header bar — always in normal flow, never moves */}
                <div className={`flex items-center justify-between px-5 py-3 bg-[#5a5a5a] relative z-20 transition-colors ${
                  !isLast ? "border-r border-[#6a6a6a]" : ""
                } ${isHovered ? "bg-[#4a4a4a]" : ""}`}>
                  <Link
                    href={`/produkte/${cat.key}`}
                    className="text-lg font-bold text-accent hover:text-accent/80 transition-colors"
                  >
                    {tNav(cat.navKey)}
                  </Link>
                  <div className="text-white/50 shrink-0">
                    {cat.icon}
                  </div>
                </div>

                {/* Description — always in normal flow */}
                <div className={`px-5 py-4 ${!isLast ? "border-r border-grey-200" : ""}`}>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {tHome(cat.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
