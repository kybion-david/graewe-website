"use client";

import Image from "next/image";
import { CALCULATOR_EMPTY_VALUE } from "@/lib/calculator";

export type ResultField = {
  label: string;
  value: string;
  emphasize?: boolean;
};

type PatternResultCardProps = {
  title: string;
  diagramSrc: string;
  diagramAlt: string;
  fields: ResultField[];
};

/**
 * Modern result card with a labeled Wickelbild diagram to guide users
 * on what OD / ID / H / W / d mean — without copying the old TYPO3 chrome.
 */
export function PatternResultCard({
  title,
  diagramSrc,
  diagramAlt,
  fields,
}: PatternResultCardProps) {
  return (
    <div className="bg-white border border-grey-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
      <h4 className="font-bold text-dark mb-4">{title}</h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs text-text-muted">{field.label}</p>
            <p
              className={`text-lg font-semibold tabular-nums ${
                field.emphasize ? "text-accent-dark" : "text-dark"
              }`}
            >
              {field.value || CALCULATOR_EMPTY_VALUE}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-lg bg-grey-100 p-4">
        <Image
          src={diagramSrc}
          alt={diagramAlt}
          width={260}
          height={280}
          className="w-full h-auto max-w-[260px] mx-auto"
          unoptimized
        />
      </div>
    </div>
  );
}
