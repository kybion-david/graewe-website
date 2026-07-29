export interface WindingPositionInput {
  pipeDiameter: number;
  length: number;
  innerDiameter: number;
  pipesPerLayer: number;
}

export interface WindingPatternResult {
  layerCount: number;
  /** Pipes wound on the last (partial) layer (`ni`). */
  pipesLastLayer: number;
  /** Max pipes for that layer pattern (`mi`); live UI shows `ni / mi`. */
  pipesOnFullLayer: number;
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

/** Live TYPO3 calculator uses 3.1415 (not Math.PI) for Wickelendposition. */
const WEP_PI = 3.1415;
const HEX_OFFSET = Math.sqrt(3) / 2;
/** Pipe-count step used when accumulating helix length on a layer. */
const PIPE_STEP = 0.25;

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

function helixLengthMm(meanDiameter: number, pipeDiameter: number): number {
  return Math.sqrt(
    Math.pow(WEP_PI * meanDiameter, 2) + Math.pow(pipeDiameter, 2)
  );
}

function hexPackHeight(pipeDiameter: number, layerCount: number): number {
  return Math.round(
    pipeDiameter + (layerCount - 1) * pipeDiameter * HEX_OFFSET
  );
}

function hexPackOuterDiameter(
  innerDiameter: number,
  pipeDiameter: number,
  layerCount: number
): number {
  return Math.round(
    innerDiameter +
      2 * (pipeDiameter + (layerCount - 1) * pipeDiameter * HEX_OFFSET)
  );
}

/**
 * Wickelbild / Ungleiche Lagen (live `calculateWEP_BB1`).
 * Odd layers fill up to `pipesPerLayer`, even layers up to `pipesPerLayer - 1`.
 */
export function calculateWindingPositionUneven(
  input: WindingPositionInput
): WindingPatternResult {
  const { pipeDiameter: ND, length: L, innerDiameter: RD, pipesPerLayer: CPL } =
    input;

  let layerCount = 1;
  let rotationCount = 0;
  let pipesLastLayer = 0;
  let pipesOnFullLayer = CPL;
  let lengthAccumulated = 0;
  let lengthIfLayerFull = 0;
  const targetLengthMm = L * 1000;

  do {
    const meanDiameter =
      RD + ND + 2 * (layerCount - 1) * (ND * HEX_OFFSET);
    const layerHelix = helixLengthMm(meanDiameter, ND);
    pipesLastLayer = 0;

    if (layerCount % 2 !== 0) {
      do {
        pipesLastLayer += PIPE_STEP;
        rotationCount += PIPE_STEP;
        lengthAccumulated =
          lengthIfLayerFull + pipesLastLayer * layerHelix;
      } while (
        !(pipesLastLayer >= CPL || lengthAccumulated >= targetLengthMm)
      );
      lengthIfLayerFull += CPL * layerHelix;
      pipesOnFullLayer = CPL;
    } else {
      do {
        pipesLastLayer += PIPE_STEP;
        rotationCount += PIPE_STEP;
        lengthAccumulated =
          lengthIfLayerFull + pipesLastLayer * layerHelix;
      } while (
        !(
          pipesLastLayer >= CPL - 1 ||
          lengthAccumulated >= targetLengthMm
        )
      );
      lengthIfLayerFull += (CPL - 1) * layerHelix;
      pipesOnFullLayer = CPL - 1;
    }

    if (!(lengthAccumulated >= targetLengthMm)) {
      layerCount += 1;
    }
  } while (!(lengthAccumulated >= targetLengthMm));

  return {
    layerCount,
    pipesLastLayer,
    pipesOnFullLayer,
    rotationCount,
    bundleWidth: ND * CPL,
    bundleHeight: hexPackHeight(ND, layerCount),
    outerDiameter: hexPackOuterDiameter(RD, ND, layerCount),
  };
}

/**
 * Wickelbild / Gleiche Lagen versetzt (live `calculateWEP_BB05`).
 * Every layer targets `pipesPerLayer`; bundle width includes a half-pipe offset.
 */
export function calculateWindingPositionEven(
  input: WindingPositionInput
): WindingPatternResult {
  const { pipeDiameter: ND, length: L, innerDiameter: RD, pipesPerLayer: CPL } =
    input;

  let layerCount = 1;
  let rotationCount = 0;
  let pipesLastLayer = 0;
  let lengthAccumulated = 0;
  let lengthIfLayerFull = 0;
  const targetLengthMm = L * 1000;

  do {
    const meanDiameter =
      RD + ND + 2 * (layerCount - 1) * (ND * HEX_OFFSET);
    const layerHelix = helixLengthMm(meanDiameter, ND);
    pipesLastLayer = 0;

    do {
      pipesLastLayer += PIPE_STEP;
      rotationCount += PIPE_STEP;
      lengthAccumulated = lengthIfLayerFull + pipesLastLayer * layerHelix;
    } while (
      !(pipesLastLayer >= CPL || lengthAccumulated >= targetLengthMm)
    );

    lengthIfLayerFull += CPL * layerHelix;

    if (!(lengthAccumulated >= targetLengthMm)) {
      layerCount += 1;
    }
  } while (!(lengthAccumulated >= targetLengthMm));

  return {
    layerCount,
    pipesLastLayer,
    pipesOnFullLayer: CPL,
    rotationCount,
    bundleWidth: ND * (CPL + 0.5),
    bundleHeight: hexPackHeight(ND, layerCount),
    outerDiameter: hexPackOuterDiameter(RD, ND, layerCount),
  };
}

function helixLengthMmWl(meanDiameter: number, pipeDiameter: number): number {
  return Math.sqrt(
    Math.pow(Math.PI * meanDiameter, 2) + Math.pow(pipeDiameter, 2)
  );
}

/**
 * Wickellänge / Ungleiche Lagen (live `calculateWL_BB1`).
 * Alternating full / full−1 pipe counts; returns achieved OD and snapped width.
 */
export function calculateWindingLengthUneven(
  input: WindingLengthInput
): WindingLengthResult {
  const {
    pipeDiameter: ND,
    innerDiameter: ID,
    outerDiameter: OD,
    bundleWidth: W,
  } = input;

  const pipesPerLayer = Math.floor(W / ND);
  let totalLengthMm = 0;
  let layer = 1;
  let meanDiameter = ID;
  let nextMean = ID;

  do {
    const idPlusPipe = ID + ND;
    meanDiameter = idPlusPipe + 2 * (layer - 1) * (ND * HEX_OFFSET);
    nextMean = idPlusPipe + 2 * layer * (ND * HEX_OFFSET);
    const pipesThisLayer = layer % 2 === 1 ? pipesPerLayer : pipesPerLayer - 1;
    totalLengthMm += helixLengthMmWl(meanDiameter, ND) * pipesThisLayer;
    layer += 1;
  } while (!(nextMean + ND > OD));

  return {
    windingLength: Math.round(totalLengthMm) / 1000,
    outerDiameter: Math.round(meanDiameter + ND),
    bundleWidth: pipesPerLayer * ND,
  };
}

/**
 * Wickellänge / Gleiche Lagen versetzt (live `calculateWL_BB05`).
 * Constant pipe count with half-pipe width offset.
 */
export function calculateWindingLengthEven(
  input: WindingLengthInput
): WindingLengthResult {
  const {
    pipeDiameter: ND,
    innerDiameter: ID,
    outerDiameter: OD,
    bundleWidth: W,
  } = input;

  const pipesPerLayer = Math.floor(W / ND - 0.5);
  let totalLengthMm = 0;
  let layer = 1;
  let meanDiameter = ID;
  let nextMean = ID;

  do {
    meanDiameter = ID + ND + 2 * (layer - 1) * (ND * HEX_OFFSET);
    nextMean = ID + ND + 2 * layer * (ND * HEX_OFFSET);
    totalLengthMm += helixLengthMmWl(meanDiameter, ND) * pipesPerLayer;
    layer += 1;
  } while (!(nextMean + ND > OD));

  return {
    windingLength: Math.round(totalLengthMm) / 1000,
    outerDiameter: Math.round(meanDiameter + ND),
    bundleWidth: pipesPerLayer * ND + ND / 2,
  };
}
