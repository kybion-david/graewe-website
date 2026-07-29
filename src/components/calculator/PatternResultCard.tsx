"use client";

import Image from "next/image";
import { CALCULATOR_EMPTY_VALUE } from "@/lib/calculator";

export type ResultField = {
  label: string;
  value: string;
};

type PatternResultCardProps = {
  title: string;
  diagramSrc: string;
  diagramAlt: string;
  fields: ResultField[];
};

/**
 * Live-style result panel: yellow border, readonly-looking outputs,
 * then a large labeled Wickelbild diagram explaining OD/ID/H/W/d.
 */
export function PatternResultCard({
  title,
  diagramSrc,
  diagramAlt,
  fields,
}: PatternResultCardProps) {
  return (
    <div className="border border-accent bg-white p-4 sm:p-5 h-full flex flex-col">
      <h4 className="font-bold text-dark text-base mb-4">{title}</h4>

      <div className="space-y-3 mb-5">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
              {field.label}
            </p>
            <div
              className="w-full px-3 py-2.5 bg-white border border-dotted border-dark text-text-muted tabular-nums"
              aria-live="polite"
            >
              {field.value || CALCULATOR_EMPTY_VALUE}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-grey-200 pt-4">
        <Image
          src={diagramSrc}
          alt={diagramAlt}
          width={260}
          height={280}
          className="w-full h-auto max-w-[280px] mx-auto"
          unoptimized
          priority
        />
      </div>
    </div>
  );
}
