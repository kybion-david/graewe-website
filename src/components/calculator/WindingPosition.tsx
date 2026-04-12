"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateWindingPositionUneven,
  calculateWindingPositionEven,
  type WindingPatternResult,
} from "@/lib/calculator";

export function WindingPositionCalc() {
  const t = useTranslations("calculator");
  const [pipeDiameter, setPipeDiameter] = useState("");
  const [length, setLength] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [pipesPerLayer, setPipesPerLayer] = useState("");
  const [unevenResult, setUnevenResult] = useState<WindingPatternResult | null>(null);
  const [evenResult, setEvenResult] = useState<WindingPatternResult | null>(null);

  function calculate() {
    const d = parseFloat(pipeDiameter);
    const l = parseFloat(length);
    const id = parseFloat(innerDiameter);
    const ppl = parseFloat(pipesPerLayer);

    if (isNaN(d) || isNaN(l) || isNaN(id) || isNaN(ppl) || d <= 0 || l <= 0 || id <= 0 || ppl <= 0) {
      return;
    }

    const input = { pipeDiameter: d, length: l, innerDiameter: id, pipesPerLayer: ppl };
    setUnevenResult(calculateWindingPositionUneven(input));
    setEvenResult(calculateWindingPositionEven(input));
  }

  function reset() {
    setPipeDiameter("");
    setLength("");
    setInnerDiameter("");
    setPipesPerLayer("");
    setUnevenResult(null);
    setEvenResult(null);
  }

  return (
    <div className="space-y-8">
      {/* Input fields */}
      <div className="bg-grey-100 rounded-lg p-6">
        <h3 className="font-semibold text-dark mb-4">{t("inputs")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label={t("pipeDiameter")} value={pipeDiameter} onChange={setPipeDiameter} />
          <InputField label={t("length")} value={length} onChange={setLength} />
          <InputField label={t("innerDiameter")} value={innerDiameter} onChange={setInnerDiameter} />
          <InputField label={t("pipesPerLayer")} value={pipesPerLayer} onChange={setPipesPerLayer} />
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

      {/* Results */}
      {unevenResult && (
        <ResultSection title={t("unevenLayers")} result={unevenResult} t={t} />
      )}
      {evenResult && (
        <ResultSection title={t("evenLayersOffset")} result={evenResult} t={t} />
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

function ResultSection({
  title,
  result,
  t,
}: {
  title: string;
  result: WindingPatternResult;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="bg-white border border-grey-300 rounded-lg p-6">
      <h4 className="font-semibold text-dark mb-4">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ResultItem label={t("layerCount")} value={result.layerCount} />
        <ResultItem label={t("pipesLastLayer")} value={result.pipesLastLayer} />
        <ResultItem label={t("rotationCount")} value={result.rotationCount} />
        <ResultItem label={t("bundleWidth")} value={`${result.bundleWidth} mm`} />
        <ResultItem label={t("bundleHeight")} value={`${result.bundleHeight} mm`} />
        <ResultItem label={t("outerDiameter")} value={`${result.outerDiameter} mm`} />
      </div>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-lg font-semibold text-dark">{value}</p>
    </div>
  );
}
