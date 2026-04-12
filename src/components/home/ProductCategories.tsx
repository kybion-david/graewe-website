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
      <svg className="w-10 h-10" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.2}>
        <circle cx="24" cy="24" r="16" />
        <circle cx="24" cy="24" r="7" />
      </svg>
    ),
  },
  {
    key: "profilextrusion",
    navKey: "profileExtrusion",
    descKey: "profileExtrusionDesc",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.2}>
        <rect x="6" y="12" width="36" height="24" rx="2" />
        <path d="M12 12V8h24v4M12 36v4h24v-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "plattenextrusion",
    navKey: "sheetExtrusion",
    descKey: "sheetExtrusionDesc",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.2}>
        <path d="M4 14h40M4 24h40M4 34h40" strokeLinecap="round" />
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
    <section className="relative bg-white py-2">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {categories.map((cat, idx) => {
            const subs = productCategories[cat.key];
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={cat.key}
                className="relative group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Subcategory panel - slides up */}
                <div
                  className="absolute bottom-full left-0 right-0 z-30 bg-accent overflow-hidden transition-all duration-400 ease-out"
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
                          className="text-[13px] text-dark hover:text-dark/60 transition-colors py-0.5 flex items-center gap-1.5"
                        >
                          <span className="w-1 h-1 bg-dark/40 rounded-full shrink-0" />
                          {tProducts(`subcategories.${sub.translationKey}`)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`relative z-20 transition-all duration-300 ${
                    idx < categories.length - 1
                      ? "border-r border-grey-200 md:border-r"
                      : ""
                  }`}
                >
                  {/* Dark header with icon */}
                  <div
                    className={`flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
                      isHovered ? "bg-dark" : "bg-dark-light"
                    }`}
                  >
                    <Link
                      href={`/produkte/${cat.key}`}
                      className="text-lg font-bold text-accent hover:text-accent-light transition-colors"
                    >
                      {tNav(cat.navKey)}
                    </Link>
                    <div
                      className={`text-white/30 transition-all duration-300 ${
                        isHovered ? "text-accent/50 scale-110" : ""
                      }`}
                    >
                      {cat.icon}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="px-6 py-5 bg-white">
                    <p className="text-sm text-text-muted leading-relaxed mb-4">
                      {tHome(cat.descKey)}
                    </p>
                    <Link
                      href={`/produkte/${cat.key}`}
                      className={`inline-flex items-center gap-2 text-sm font-semibold text-dark transition-all duration-300 ${
                        isHovered ? "gap-3" : ""
                      }`}
                    >
                      <span className="w-5 h-[2px] bg-accent" />
                      {tNav(cat.navKey)}
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isHovered ? "translate-x-1" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
