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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-5">
      {/* Inputs — left column like live site */}
      <div className="lg:col-span-3 space-y-4">
        <h3 className="font-bold text-dark text-sm uppercase tracking-wide">
          {t("inputs")}
        </h3>
        <CalculatorField
          id="wl-pipe-diameter"
          label={t("pipeDiameter")}
          value={pipeDiameter}
          onChange={setPipeDiameter}
          error={fieldError("pipeDiameter")}
          placeholder={CALCULATOR_EMPTY_VALUE}
        />
        <CalculatorField
          id="wl-inner-diameter"
          label={t("innerDiameter")}
          value={innerDiameter}
          onChange={setInnerDiameter}
          error={fieldError("innerDiameter")}
          placeholder={CALCULATOR_EMPTY_VALUE}
        />
        <CalculatorField
          id="wl-outer-diameter"
          label={t("outerDiameter")}
          value={outerDiameter}
          onChange={setOuterDiameter}
          error={fieldError("outerDiameter")}
          placeholder={CALCULATOR_EMPTY_VALUE}
        />
        <CalculatorField
          id="wl-bundle-width"
          label={t("bundleWidth")}
          value={bundleWidth}
          onChange={setBundleWidth}
          error={fieldError("bundleWidth")}
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
              label: t("windingLengthResult"),
              value: formatValue(unevenResult?.windingLength),
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
