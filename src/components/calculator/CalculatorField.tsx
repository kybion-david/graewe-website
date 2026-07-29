"use client";

type CalculatorFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inputMode?: "decimal" | "numeric";
  /** Live-site placeholder when empty (N/V). */
  placeholder?: string;
};

export function CalculatorField({
  id,
  label,
  value,
  onChange,
  error,
  inputMode = "decimal",
  placeholder,
}: CalculatorFieldProps) {
  const inputBase =
    "w-full px-3 py-2.5 outline-none transition-all text-text-muted";
  const inputNormal = `${inputBase} border-0 bg-grey-200 focus:ring-2 focus:ring-accent/40`;
  const inputError = `${inputBase} border border-red-400 bg-white focus:ring-2 focus:ring-red-200`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={error ? inputError : inputNormal}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
