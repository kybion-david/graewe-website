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

  function fieldError(
    key: WindingPositionFieldKey
  ): string | undefined {
    if (!showErrors || validation.ok) return undefined;
    const code = validation.errors[key] as CalculatorFieldError | undefined;
    return code ? t(`validation.${code}`) : undefined;
  }

  function calculate() {
    setShowErrors(true);
  }

  function reset() {
    setPipeDiameter("");
    setLength("");
    setInnerDiameter("");
    setPipesPerLayer(DEFAULT_PIPES_PER_LAYER);
    setShowErrors(false);
  }

  return (
    <div className="space-y-8">
      <div className="bg-grey-100 rounded-xl p-6">
        <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded-full" />
          {t("inputs")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorField
            id="wep-pipe-diameter"
            label={t("pipeDiameter")}
            value={pipeDiameter}
            onChange={setPipeDiameter}
            error={fieldError("pipeDiameter")}
          />
          <CalculatorField
            id="wep-length"
            label={t("length")}
            value={length}
            onChange={setLength}
            error={fieldError("length")}
          />
          <CalculatorField
            id="wep-inner-diameter"
            label={t("innerDiameter")}
            value={innerDiameter}
            onChange={setInnerDiameter}
            error={fieldError("innerDiameter")}
          />
          <CalculatorField
            id="wep-pipes-per-layer"
            label={t("pipesPerLayer")}
            value={pipesPerLayer}
            onChange={setPipesPerLayer}
            error={fieldError("pipesPerLayer")}
            inputMode="numeric"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={calculate}
            className="px-6 py-2.5 bg-accent text-dark rounded-lg font-bold hover:bg-accent-dark transition-colors"
          >
            {t("calculate")}
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-6 py-2.5 border border-grey-300 text-text-muted rounded-lg font-medium hover:bg-grey-200 transition-colors"
          >
            {t("reset")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
