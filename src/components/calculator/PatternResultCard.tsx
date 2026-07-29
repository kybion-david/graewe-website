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

export function PatternResultCard({
  title,
  diagramSrc,
  diagramAlt,
  fields,
}: PatternResultCardProps) {
  return (
    <div className="bg-white border border-accent/60 rounded-xl p-5 shadow-sm h-full">
      <h4 className="font-bold text-dark mb-4">{title}</h4>
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-1 space-y-3 min-w-0">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-xs text-text-muted uppercase tracking-wide">
                {field.label}
              </p>
              <p
                className={`text-base font-semibold tabular-nums ${
                  field.emphasize ? "text-accent-dark" : "text-dark"
                }`}
              >
                {field.value || CALCULATOR_EMPTY_VALUE}
              </p>
            </div>
          ))}
        </div>
        <div className="shrink-0 mx-auto sm:mx-0">
          <Image
            src={diagramSrc}
            alt={diagramAlt}
            width={160}
            height={172}
            className="w-40 h-auto"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
