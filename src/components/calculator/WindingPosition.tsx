"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CALCULATOR_EMPTY_VALUE,
  DEFAULT_PIPES_PER_LAYER,
  calculateWindingPositionUneven,
  calculateWindingPositionEven,
  validateWindingPositionInput,
  type CalculatorFieldError,
  type WindingPatternResult,
  type WindingPositionFieldKey,
} from "@/lib/calculator";
import { CalculatorField } from "./CalculatorField";
import { PatternResultCard } from "./PatternResultCard";

function formatMm(value: number | undefined) {
  return value === undefined ? CALCULATOR_EMPTY_VALUE : `${value}`;
}

function formatPipes(result: WindingPatternResult | null) {
  if (!result) return CALCULATOR_EMPTY_VALUE;
  return `${result.pipesLastLayer} / ${result.pipesOnFullLayer}`;
}

export function WindingPositionCalc() {
  const t = useTranslations("calculator");
  const [pipeDiameter, setPipeDiameter] = useState("");
  const [length, setLength] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [pipesPerLayer, setPipesPerLayer] = useState(DEFAULT_PIPES_PER_LAYER);
  const [showErrors, setShowErrors] = useState(false);

  const validation = validateWindingPositionInput({
    pipeDiameter,
    length,
    innerDiameter,
    pipesPerLayer,
  });
  const unevenResult = validation.ok
    ? calculateWindingPositionUneven(validation.input)
    : null;
  const evenResult = validation.ok
    ? calculateWindingPositionEven(validation.input)
    : null;

  function fieldError(key: WindingPositionFieldKey): string | undefined {
    if (!showErrors || validation.ok) return undefined;
    const code = validation.errors[key] as CalculatorFieldError | undefined;
    return code ? t(`validation.${code}`) : undefined;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-5">
      {/* Inputs — left column like live site */}
      <div className="lg:col-span-3 space-y-4">
        <h3 className="font-bold text-dark text-sm uppercase tracking-wide">
          {t("inputs")}
        </h3>
        <CalculatorField
          id="wep-pipe-diameter"
          label={t("pipeDiameter")}
          value={pipeDiameter}
          onChange={setPipeDiameter}
          error={fieldError("pipeDiameter")}
          placeholder={CALCULATOR_EMPTY_VALUE}
        />
        <CalculatorField
          id="wep-length"
          label={t("length")}
          value={length}
          onChange={setLength}
          error={fieldError("length")}
          placeholder={CALCULATOR_EMPTY_VALUE}
        />
        <CalculatorField
          id="wep-inner-diameter"
          label={t("innerDiameter")}
          value={innerDiameter}
          onChange={setInnerDiameter}
          error={fieldError("innerDiameter")}
          placeholder={CALCULATOR_EMPTY_VALUE}
        />
        <CalculatorField
          id="wep-pipes-per-layer"
          label={t("pipesPerLayer")}
          value={pipesPerLayer}
          onChange={setPipesPerLayer}
          error={fieldError("pipesPerLayer")}
          inputMode="numeric"
          placeholder={CALCULATOR_EMPTY_VALUE}
        />
        <button
          type="button"
          onClick={() => setShowErrors(true)}
          className="w-full px-4 py-2.5 bg-accent text-dark font-bold uppercase text-sm hover:bg-accent-dark transition-colors"
        >
          {t("calculate")}
        </button>
      </div>

      {/* Two Wickelbild panels with large labeled diagrams */}
      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-5">
        <PatternResultCard
          title={t("unevenLayers")}
          diagramSrc="/images/calculator/ugl.gif"
          diagramAlt={t("diagramUnevenAlt")}
          fields={[
            {
              label: t("layerCount"),
              value: unevenResult
                ? String(unevenResult.layerCount)
                : CALCULATOR_EMPTY_VALUE,
            },
            {
              label: t("pipesLastLayer"),
              value: formatPipes(unevenResult),
            },
            {
              label: t("rotationCount"),
              value: unevenResult
                ? String(unevenResult.rotationCount)
                : CALCULATOR_EMPTY_VALUE,
            },
            {
              label: t("bundleWidth"),
              value: formatMm(unevenResult?.bundleWidth),
            },
            {
              label: t("bundleHeight"),
              value: formatMm(unevenResult?.bundleHeight),
            },
            {
              label: t("outerDiameter"),
              value: formatMm(unevenResult?.outerDiameter),
            },
          ]}
        />
        <PatternResultCard
          title={t("evenLayersOffset")}
          diagramSrc="/images/calculator/ggl.gif"
          diagramAlt={t("diagramEvenAlt")}
          fields={[
            {
              label: t("layerCount"),
              value: evenResult
                ? String(evenResult.layerCount)
                : CALCULATOR_EMPTY_VALUE,
            },
            {
              label: t("pipesLastLayer"),
              value: formatPipes(evenResult),
            },
            {
              label: t("rotationCount"),
              value: evenResult
                ? String(evenResult.rotationCount)
                : CALCULATOR_EMPTY_VALUE,
            },
            {
              label: t("bundleWidth"),
              value: formatMm(evenResult?.bundleWidth),
            },
            {
              label: t("bundleHeight"),
              value: formatMm(evenResult?.bundleHeight),
            },
            {
              label: t("outerDiameter"),
              value: formatMm(evenResult?.outerDiameter),
            },
          ]}
        />
      </div>
    </div>
  );
}
