"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateWindingLengthUneven,
  calculateWindingLengthEven,
  validateWindingLengthInput,
  type CalculatorFieldError,
  type WindingLengthFieldKey,
  type WindingLengthResult,
} from "@/lib/calculator";

type FieldErrors = Partial<Record<WindingLengthFieldKey, CalculatorFieldError>>;

export function WindingLengthCalc() {
  const t = useTranslations("calculator");
  const [pipeDiameter, setPipeDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [bundleWidth, setBundleWidth] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [unevenResult, setUnevenResult] = useState<WindingLengthResult | null>(null);
  const [evenResult, setEvenResult] = useState<WindingLengthResult | null>(null);

  function fieldErrorMessage(code: CalculatorFieldError | undefined) {
    if (!code) return undefined;
    return t(`validation.${code}`);
  }

  function updateField(
    key: WindingLengthFieldKey,
    value: string,
    setter: (v: string) => void
  ) {
    setter(value);
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function calculate() {
    const validation = validateWindingLengthInput({
      pipeDiameter,
      innerDiameter,
      outerDiameter,
      bundleWidth,
    });

    if (!validation.ok) {
      setErrors(validation.errors);
      setUnevenResult(null);
      setEvenResult(null);
      return;
    }

    setErrors({});
    setUnevenResult(calculateWindingLengthUneven(validation.input));
    setEvenResult(calculateWindingLengthEven(validation.input));
  }

  function reset() {
    setPipeDiameter("");
    setInnerDiameter("");
    setOuterDiameter("");
    setBundleWidth("");
    setErrors({});
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
          <InputField
            label={t("pipeDiameter")}
            value={pipeDiameter}
            onChange={(v) => updateField("pipeDiameter", v, setPipeDiameter)}
            error={fieldErrorMessage(errors.pipeDiameter)}
          />
          <InputField
            label={t("innerDiameter")}
            value={innerDiameter}
            onChange={(v) => updateField("innerDiameter", v, setInnerDiameter)}
            error={fieldErrorMessage(errors.innerDiameter)}
          />
          <InputField
            label={t("outerDiameter")}
            value={outerDiameter}
            onChange={(v) => updateField("outerDiameter", v, setOuterDiameter)}
            error={fieldErrorMessage(errors.outerDiameter)}
          />
          <InputField
            label={t("bundleWidth")}
            value={bundleWidth}
            onChange={(v) => updateField("bundleWidth", v, setBundleWidth)}
            error={fieldErrorMessage(errors.bundleWidth)}
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
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const inputBase =
    "w-full px-3 py-2 border rounded-lg outline-none transition-all";
  const inputNormal = `${inputBase} border-grey-300 focus:ring-2 focus:ring-accent/30 focus:border-accent`;
  const inputError = `${inputBase} border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400`;

  return (
    <div>
      <label className="block text-sm font-medium text-text-muted mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? inputError : inputNormal}
        min="0"
        step="any"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      {error && (
        <p id={`${label}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
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
