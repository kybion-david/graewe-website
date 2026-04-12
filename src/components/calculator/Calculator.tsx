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
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
            mode === "position"
              ? "bg-dark text-white shadow-sm"
              : "text-text-muted hover:text-dark"
          }`}
        >
          {t("windingPosition")}
        </button>
        <button
          onClick={() => setMode("length")}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
            mode === "length"
              ? "bg-dark text-white shadow-sm"
              : "text-text-muted hover:text-dark"
          }`}
        >
          {t("windingLength")}
        </button>
      </div>

      {mode === "position" ? <WindingPositionCalc /> : <WindingLengthCalc />}

      <p className="mt-8 text-sm text-text-muted italic">{t("disclaimer")}</p>
    </div>
  );
}
