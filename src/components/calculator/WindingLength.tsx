"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CALCULATOR_EMPTY_VALUE,
  calculateWindingLengthUneven,
  calculateWindingLengthEven,
  validateWindingLengthInput,
  type CalculatorFieldError,
  type WindingLengthFieldKey,
} from "@/lib/calculator";
import { CalculatorField } from "./CalculatorField";
import { PatternResultCard } from "./PatternResultCard";

function formatValue(value: number | undefined) {
  if (value === undefined) return CALCULATOR_EMPTY_VALUE;
  return `${value}`;
}

export function WindingLengthCalc() {
  const t = useTranslations("calculator");
  const [pipeDiameter, setPipeDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [bundleWidth, setBundleWidth] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const validation = validateWindingLengthInput({
    pipeDiameter,
    innerDiameter,
    outerDiameter,
    bundleWidth,
  });
  const unevenResult = validation.ok
    ? calculateWindingLengthUneven(validation.input)
    : null;
  const evenResult = validation.ok
    ? calculateWindingLengthEven(validation.input)
    : null;

  function fieldError(key: WindingLengthFieldKey): string | undefined {
    if (!showErrors || validation.ok) return undefined;
    const code = validation.errors[key] as CalculatorFieldError | undefined;
    return code ? t(`validation.${code}`) : undefined;
  }

  function calculate() {
    setShowErrors(true);
  }

  function reset() {
    setPipeDiameter("");
    setInnerDiameter("");
    setOuterDiameter("");
    setBundleWidth("");
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
            id="wl-pipe-diameter"
            label={t("pipeDiameter")}
            value={pipeDiameter}
            onChange={setPipeDiameter}
            error={fieldError("pipeDiameter")}
          />
          <CalculatorField
            id="wl-inner-diameter"
            label={t("innerDiameter")}
            value={innerDiameter}
            onChange={setInnerDiameter}
            error={fieldError("innerDiameter")}
          />
          <CalculatorField
            id="wl-outer-diameter"
            label={t("outerDiameter")}
            value={outerDiameter}
            onChange={setOuterDiameter}
            error={fieldError("outerDiameter")}
          />
          <CalculatorField
            id="wl-bundle-width"
            label={t("bundleWidth")}
            value={bundleWidth}
            onChange={setBundleWidth}
            error={fieldError("bundleWidth")}
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
              label: t("windingLengthResult"),
              value: formatValue(unevenResult?.windingLength),
              emphasize: true,
            },
            {
              label: t("outerDiameter"),
              value: formatValue(unevenResult?.outerDiameter),
            },
            {
              label: t("bundleWidth"),
              value: formatValue(unevenResult?.bundleWidth),
            },
          ]}
        />
        <PatternResultCard
          title={t("evenLayersOffset")}
          diagramSrc="/images/calculator/ggl.gif"
          diagramAlt={t("diagramEvenAlt")}
          fields={[
            {
              label: t("windingLengthResult"),
              value: formatValue(evenResult?.windingLength),
              emphasize: true,
            },
            {
              label: t("outerDiameter"),
              value: formatValue(evenResult?.outerDiameter),
            },
            {
              label: t("bundleWidth"),
              value: formatValue(evenResult?.bundleWidth),
            },
          ]}
        />
      </div>
    </div>
  );
}
