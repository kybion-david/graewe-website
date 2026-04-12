"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { WindingPositionCalc } from "./WindingPosition";
import { WindingLengthCalc } from "./WindingLength";

type Mode = "position" | "length";

export function Calculator() {
  const t = useTranslations("calculator");
  const [mode, setMode] = useState<Mode>("position");

  return (
    <div>
      {/* Mode tabs */}
      <div className="flex gap-1 mb-8 bg-grey-100 rounded-lg p-1">
        <button
          onClick={() => setMode("position")}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
            mode === "position"
              ? "bg-dark text-white shadow-sm"
              : "text-text-muted hover:text-dark hover:bg-grey-200"
          }`}
        >
          {t("windingPosition")}
        </button>
        <button
          onClick={() => setMode("length")}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
            mode === "length"
              ? "bg-dark text-white shadow-sm"
              : "text-text-muted hover:text-dark hover:bg-grey-200"
          }`}
        >
          {t("windingLength")}
        </button>
      </div>

      {mode === "position" ? <WindingPositionCalc /> : <WindingLengthCalc />}

      <p className="mt-8 text-sm text-text-muted italic border-t border-grey-200 pt-4">
        {t("disclaimer")}
      </p>
    </div>
  );
}
