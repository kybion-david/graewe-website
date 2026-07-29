"use client";

type CalculatorFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inputMode?: "decimal" | "numeric";
};

export function CalculatorField({
  id,
  label,
  value,
  onChange,
  error,
  inputMode = "decimal",
}: CalculatorFieldProps) {
  const inputBase =
    "w-full px-3 py-2 border rounded-lg outline-none transition-all";
  const inputNormal = `${inputBase} border-grey-300 focus:ring-2 focus:ring-accent/30 focus:border-accent`;
  const inputError = `${inputBase} border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-muted mb-1">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        value={value}
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
