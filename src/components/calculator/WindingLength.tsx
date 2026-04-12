"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateWindingLengthUneven,
  calculateWindingLengthEven,
  type WindingLengthResult,
} from "@/lib/calculator";

export function WindingLengthCalc() {
  const t = useTranslations("calculator");
  const [pipeDiameter, setPipeDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [bundleWidth, setBundleWidth] = useState("");
  const [unevenResult, setUnevenResult] = useState<WindingLengthResult | null>(null);
  const [evenResult, setEvenResult] = useState<WindingLengthResult | null>(null);

  function calculate() {
    const d = parseFloat(pipeDiameter);
    const id = parseFloat(innerDiameter);
    const od = parseFloat(outerDiameter);
    const w = parseFloat(bundleWidth);

    if (isNaN(d) || isNaN(id) || isNaN(od) || isNaN(w) || d <= 0 || id <= 0 || od <= 0 || w <= 0) {
      return;
    }

    const input = { pipeDiameter: d, innerDiameter: id, outerDiameter: od, bundleWidth: w };
    setUnevenResult(calculateWindingLengthUneven(input));
    setEvenResult(calculateWindingLengthEven(input));
  }

  function reset() {
    setPipeDiameter("");
    setInnerDiameter("");
    setOuterDiameter("");
    setBundleWidth("");
    setUnevenResult(null);
    setEvenResult(null);
  }

  return (
    <div className="space-y-8">
      <div className="bg-grey-100 rounded-xl p-6">
        <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded-full" />
          {t("inputs")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label={t("pipeDiameter")} value={pipeDiameter} onChange={setPipeDiameter} />
          <InputField label={t("innerDiameter")} value={innerDiameter} onChange={setInnerDiameter} />
          <InputField label={t("outerDiameter")} value={outerDiameter} onChange={setOuterDiameter} />
          <InputField label={t("bundleWidth")} value={bundleWidth} onChange={setBundleWidth} />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={calculate}
            className="px-6 py-2.5 bg-accent text-dark rounded-lg font-bold hover:bg-accent-dark transition-colors"
          >
            {t("calculate")}
          </button>
          <button
            onClick={reset}
            className="px-6 py-2.5 border border-grey-300 text-text-muted rounded-lg font-medium hover:bg-grey-200 transition-colors"
          >
            {t("reset")}
          </button>
        </div>
      </div>

      {unevenResult && (
        <LengthResultSection title={t("unevenLayers")} result={unevenResult} t={t} />
      )}
      {evenResult && (
        <LengthResultSection title={t("evenLayersOffset")} result={evenResult} t={t} />
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-muted mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all"
        min="0"
        step="any"
      />
    </div>
  );
}

function LengthResultSection({
  title,
  result,
  t,
}: {
  title: string;
  result: WindingLengthResult;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="bg-white border border-grey-200 rounded-xl p-6 shadow-sm">
      <h4 className="font-bold text-dark mb-4">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-text-muted">{t("windingLengthResult")}</p>
          <p className="text-lg font-semibold text-accent">{result.windingLength} m</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">{t("outerDiameter")}</p>
          <p className="text-lg font-semibold text-dark">{result.outerDiameter} mm</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">{t("bundleWidth")}</p>
          <p className="text-lg font-semibold text-dark">{result.bundleWidth} mm</p>
        </div>
      </div>
    </div>
  );
}
