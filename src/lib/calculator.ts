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
