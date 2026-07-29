"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { WindingPositionCalc } from "./WindingPosition";
import { WindingLengthCalc } from "./WindingLength";

type Mode = "position" | "length";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
        active
          ? "bg-grey-500 text-white"
          : "bg-grey-200 text-dark hover:bg-grey-300"
      }`}
    >
      <span
        className="inline-flex h-5 w-5 items-center justify-center bg-accent text-dark text-[10px] leading-none"
        aria-hidden
      >
        ▶
      </span>
      {children}
    </button>
  );
}

export function Calculator() {
  const t = useTranslations("calculator");
  const [mode, setMode] = useState<Mode>("position");

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-8">
        <TabButton
          active={mode === "position"}
          onClick={() => setMode("position")}
        >
          {t("windingPosition")}
        </TabButton>
        <TabButton active={mode === "length"} onClick={() => setMode("length")}>
          {t("windingLength")}
        </TabButton>
      </div>

      {mode === "position" ? <WindingPositionCalc /> : <WindingLengthCalc />}

      <p className="mt-8 text-sm text-text-muted italic border-t border-grey-200 pt-4">
        {t("disclaimer")}
      </p>
    </div>
  );
}
