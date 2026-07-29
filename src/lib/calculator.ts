export interface WindingPositionInput {
  pipeDiameter: number;
  length: number;
  innerDiameter: number;
  pipesPerLayer: number;
}

export interface WindingPatternResult {
  layerCount: number;
  pipesLastLayer: number;
  rotationCount: number;
  bundleWidth: number;
  bundleHeight: number;
  outerDiameter: number;
}

export interface WindingLengthInput {
  pipeDiameter: number;
  innerDiameter: number;
  outerDiameter: number;
  bundleWidth: number;
}

export interface WindingLengthResult {
  windingLength: number;
  outerDiameter: number;
  bundleWidth: number;
}

/** Field-level validation codes mapped to i18n in the calculator UI. */
export type CalculatorFieldError =
  | "required"
  | "invalid"
  | "positive"
  | "odMustExceedId";

export type WindingPositionFields = {
  pipeDiameter: string;
  length: string;
  innerDiameter: string;
  pipesPerLayer: string;
};

export type WindingLengthFields = {
  pipeDiameter: string;
  innerDiameter: string;
  outerDiameter: string;
  bundleWidth: string;
};

export type WindingPositionFieldKey = keyof WindingPositionFields;
export type WindingLengthFieldKey = keyof WindingLengthFields;

export type ValidationSuccess<T> = { ok: true; input: T };
export type ValidationFailure<K extends string> = {
  ok: false;
  errors: Partial<Record<K, CalculatorFieldError>>;
};
export type ValidationResult<T, K extends string> =
  | ValidationSuccess<T>
  | ValidationFailure<K>;

function parsePositiveNumber(
  raw: string
): { ok: true; value: number } | { ok: false; error: CalculatorFieldError } {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { ok: false, error: "required" };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { ok: false, error: "invalid" };
  }
  if (value <= 0) {
    return { ok: false, error: "positive" };
  }
  return { ok: true, value };
}

export function validateWindingPositionInput(
  fields: WindingPositionFields
): ValidationResult<WindingPositionInput, WindingPositionFieldKey> {
  const errors: Partial<Record<WindingPositionFieldKey, CalculatorFieldError>> =
    {};
  const parsed: Partial<WindingPositionInput> = {};

  (Object.keys(fields) as WindingPositionFieldKey[]).forEach((key) => {
    const result = parsePositiveNumber(fields[key]);
    if (result.ok) {
      parsed[key] = result.value;
    } else {
      errors[key] = result.error;
    }
  });

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    input: parsed as WindingPositionInput,
  };
}

export function validateWindingLengthInput(
  fields: WindingLengthFields
): ValidationResult<WindingLengthInput, WindingLengthFieldKey> {
  const errors: Partial<Record<WindingLengthFieldKey, CalculatorFieldError>> =
    {};
  const parsed: Partial<WindingLengthInput> = {};

  (Object.keys(fields) as WindingLengthFieldKey[]).forEach((key) => {
    const result = parsePositiveNumber(fields[key]);
    if (result.ok) {
      parsed[key] = result.value;
    } else {
      errors[key] = result.error;
    }
  });

  if (
    parsed.innerDiameter !== undefined &&
    parsed.outerDiameter !== undefined &&
    parsed.outerDiameter <= parsed.innerDiameter
  ) {
    errors.outerDiameter = "odMustExceedId";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    input: parsed as WindingLengthInput,
  };
}

export function calculateWindingPositionUneven(
  input: WindingPositionInput
): WindingPatternResult {
  const { pipeDiameter, length, innerDiameter, pipesPerLayer } = input;
  const d = pipeDiameter;
  const totalPipeLength = length * 1000; // m to mm
  const circumferenceAtCenter = Math.PI * (innerDiameter + d);
  const pipeLengthPerRotation = pipesPerLayer * d;
  const totalRotations = totalPipeLength / circumferenceAtCenter;
  const rotationsPerLayer = pipesPerLayer;
  const layerCount = Math.ceil(totalRotations / rotationsPerLayer);
  const remainingRotations = totalRotations - (layerCount - 1) * rotationsPerLayer;
  const pipesLastLayer = Math.ceil(remainingRotations);
  const rotationCount = Math.round(totalRotations);
  const bundleWidth = pipesPerLayer * d;
  const bundleHeight = layerCount * d;
  const outerDiameter = innerDiameter + 2 * layerCount * d;

  return {
    layerCount,
    pipesLastLayer: Math.max(1, pipesLastLayer),
    rotationCount,
    bundleWidth: Math.round(bundleWidth * 10) / 10,
    bundleHeight: Math.round(bundleHeight * 10) / 10,
    outerDiameter: Math.round(outerDiameter * 10) / 10,
  };
}

export function calculateWindingPositionEven(
  input: WindingPositionInput
): WindingPatternResult {
  const { pipeDiameter, length, innerDiameter, pipesPerLayer } = input;
  const d = pipeDiameter;
  const totalPipeLength = length * 1000;
  const offsetFactor = Math.sqrt(3) / 2;
  const circumferenceAtCenter = Math.PI * (innerDiameter + d);
  const totalRotations = totalPipeLength / circumferenceAtCenter;
  const rotationsPerLayer = pipesPerLayer;
  const layerCount = Math.ceil(totalRotations / rotationsPerLayer);
  const remainingRotations = totalRotations - (layerCount - 1) * rotationsPerLayer;
  const pipesLastLayer = Math.ceil(remainingRotations);
  const rotationCount = Math.round(totalRotations);
  const bundleWidth = pipesPerLayer * d + d / 2;
  const bundleHeight = d + (layerCount - 1) * d * offsetFactor;
  const outerDiameter = innerDiameter + 2 * (d + (layerCount - 1) * d * offsetFactor);

  return {
    layerCount,
    pipesLastLayer: Math.max(1, pipesLastLayer),
    rotationCount,
    bundleWidth: Math.round(bundleWidth * 10) / 10,
    bundleHeight: Math.round(bundleHeight * 10) / 10,
    outerDiameter: Math.round(outerDiameter * 10) / 10,
  };
}

export function calculateWindingLengthUneven(
  input: WindingLengthInput
): WindingLengthResult {
  const { pipeDiameter, innerDiameter, outerDiameter, bundleWidth } = input;
  const d = pipeDiameter;
  const layerCount = Math.floor((outerDiameter - innerDiameter) / (2 * d));
  const pipesPerLayer = Math.floor(bundleWidth / d);
  let totalLength = 0;

  for (let i = 0; i < layerCount; i++) {
    const currentDiameter = innerDiameter + d + 2 * i * d;
    const circumference = Math.PI * currentDiameter;
    totalLength += circumference * pipesPerLayer;
  }

  return {
    windingLength: Math.round((totalLength / 1000) * 10) / 10,
    outerDiameter,
    bundleWidth,
  };
}

export function calculateWindingLengthEven(
  input: WindingLengthInput
): WindingLengthResult {
  const { pipeDiameter, innerDiameter, outerDiameter, bundleWidth } = input;
  const d = pipeDiameter;
  const offsetFactor = Math.sqrt(3) / 2;
  const availableHeight = (outerDiameter - innerDiameter) / 2;
  const layerCount = Math.floor((availableHeight - d) / (d * offsetFactor)) + 1;
  const pipesPerLayer = Math.floor(bundleWidth / d);
  let totalLength = 0;

  for (let i = 0; i < layerCount; i++) {
    const currentDiameter = innerDiameter + d + 2 * i * d * offsetFactor;
    const circumference = Math.PI * currentDiameter;
    const currentPipes = i % 2 === 0 ? pipesPerLayer : pipesPerLayer - 1;
    totalLength += circumference * Math.max(1, currentPipes);
  }

  return {
    windingLength: Math.round((totalLength / 1000) * 10) / 10,
    outerDiameter,
    bundleWidth,
  };
}
