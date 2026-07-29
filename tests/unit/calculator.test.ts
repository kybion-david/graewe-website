import { describe, it, expect } from "vitest";
import {
  calculateWindingPositionUneven,
  calculateWindingPositionEven,
  calculateWindingLengthUneven,
  calculateWindingLengthEven,
  validateWindingPositionInput,
  validateWindingLengthInput,
} from "@/lib/calculator";

/**
 * Golden samples captured from live graewe.com Produktrechner
 * (TYPO3 `Graewe_Productcalculator`, 2026-07-29).
 *
 * Mapping:
 * - Uneven = Wickelbild / Ungleiche Lagen (live BB1 / WL1)
 * - Even   = Wickelbild / Gleiche Lagen versetzt (live BB05 / WL05)
 */
const LIVE_WEP_SAMPLES = [
  {
    input: { pipeDiameter: 20, length: 100, innerDiameter: 300, pipesPerLayer: 10 },
    uneven: {
      layerCount: 8,
      pipesLastLayer: 6.25,
      pipesOnFullLayer: 9,
      rotationCount: 73.25,
      bundleWidth: 200,
      bundleHeight: 141,
      outerDiameter: 582,
    },
    even: {
      layerCount: 8,
      pipesLastLayer: 4,
      pipesOnFullLayer: 10,
      rotationCount: 74,
      bundleWidth: 210,
      bundleHeight: 141,
      outerDiameter: 582,
    },
  },
  {
    input: { pipeDiameter: 25, length: 50, innerDiameter: 400, pipesPerLayer: 8 },
    uneven: {
      layerCount: 5,
      pipesLastLayer: 2.25,
      pipesOnFullLayer: 8,
      rotationCount: 32.25,
      bundleWidth: 200,
      bundleHeight: 112,
      outerDiameter: 623,
    },
    even: {
      layerCount: 5,
      pipesLastLayer: 0.5,
      pipesOnFullLayer: 8,
      rotationCount: 32.5,
      bundleWidth: 212.5,
      bundleHeight: 112,
      outerDiameter: 623,
    },
  },
  {
    input: { pipeDiameter: 16, length: 200, innerDiameter: 250, pipesPerLayer: 12 },
    uneven: {
      layerCount: 13,
      pipesLastLayer: 10.25,
      pipesOnFullLayer: 12,
      rotationCount: 148.25,
      bundleWidth: 192,
      bundleHeight: 182,
      outerDiameter: 615,
    },
    even: {
      layerCount: 13,
      pipesLastLayer: 5.75,
      pipesOnFullLayer: 12,
      rotationCount: 149.75,
      bundleWidth: 200,
      bundleHeight: 182,
      outerDiameter: 615,
    },
  },
  {
    input: { pipeDiameter: 32, length: 75, innerDiameter: 500, pipesPerLayer: 6 },
    uneven: {
      layerCount: 7,
      pipesLastLayer: 2.25,
      pipesOnFullLayer: 6,
      rotationCount: 35.25,
      bundleWidth: 192,
      bundleHeight: 198,
      outerDiameter: 897,
    },
    even: {
      layerCount: 6,
      pipesLastLayer: 5.75,
      pipesOnFullLayer: 6,
      rotationCount: 35.75,
      bundleWidth: 208,
      bundleHeight: 171,
      outerDiameter: 841,
    },
  },
] as const;

const LIVE_WL_SAMPLES = [
  {
    input: {
      pipeDiameter: 20,
      innerDiameter: 300,
      outerDiameter: 500,
      bundleWidth: 200,
    },
    uneven: { windingLength: 58.71, outerDiameter: 479, bundleWidth: 200 },
    even: { windingLength: 55.041, outerDiameter: 479, bundleWidth: 190 },
  },
  {
    input: {
      pipeDiameter: 25,
      innerDiameter: 400,
      outerDiameter: 700,
      bundleWidth: 250,
    },
    uneven: { windingLength: 95.297, outerDiameter: 667, bundleWidth: 250 },
    even: { windingLength: 90.475, outerDiameter: 667, bundleWidth: 237.5 },
  },
  {
    input: {
      pipeDiameter: 16,
      innerDiameter: 250,
      outerDiameter: 450,
      bundleWidth: 192,
    },
    uneven: { windingLength: 88.855, outerDiameter: 448, bundleWidth: 192 },
    even: { windingLength: 84.467, outerDiameter: 448, bundleWidth: 184 },
  },
  {
    input: {
      pipeDiameter: 32,
      innerDiameter: 500,
      outerDiameter: 800,
      bundleWidth: 224,
    },
    uneven: { windingLength: 66.655, outerDiameter: 786, bundleWidth: 224 },
    even: { windingLength: 60.595, outerDiameter: 786, bundleWidth: 208 },
  },
] as const;

describe("Calculator - live site parity (Wickelendposition)", () => {
  it.each(LIVE_WEP_SAMPLES)(
    "matches live outputs for d=$input.pipeDiameter L=$input.length",
    ({ input, uneven, even }) => {
      expect(calculateWindingPositionUneven(input)).toEqual(uneven);
      expect(calculateWindingPositionEven(input)).toEqual(even);
    }
  );
});

describe("Calculator - live site parity (Wickellänge)", () => {
  it.each(LIVE_WL_SAMPLES)(
    "matches live outputs for d=$input.pipeDiameter OD=$input.outerDiameter",
    ({ input, uneven, even }) => {
      const unevenResult = calculateWindingLengthUneven(input);
      const evenResult = calculateWindingLengthEven(input);

      expect(unevenResult.outerDiameter).toBe(uneven.outerDiameter);
      expect(unevenResult.bundleWidth).toBe(uneven.bundleWidth);
      expect(unevenResult.windingLength).toBeCloseTo(uneven.windingLength, 3);

      expect(evenResult.outerDiameter).toBe(even.outerDiameter);
      expect(evenResult.bundleWidth).toBe(even.bundleWidth);
      expect(evenResult.windingLength).toBeCloseTo(even.windingLength, 3);
    }
  );
});

describe("Calculator - Winding Position (Uneven Layers)", () => {
  it("calculates basic winding position for uneven layers", () => {
    const result = calculateWindingPositionUneven({
      pipeDiameter: 20,
      length: 100,
      innerDiameter: 300,
      pipesPerLayer: 10,
    });

    expect(result.layerCount).toBeGreaterThan(0);
    expect(result.pipesLastLayer).toBeGreaterThan(0);
    expect(result.rotationCount).toBeGreaterThan(0);
    expect(result.bundleWidth).toBeGreaterThan(0);
    expect(result.bundleHeight).toBeGreaterThan(0);
    expect(result.outerDiameter).toBeGreaterThan(result.bundleHeight);
  });

  it("outer diameter uses hex-packed radius from inner diameter", () => {
    const result = calculateWindingPositionUneven({
      pipeDiameter: 25,
      length: 50,
      innerDiameter: 400,
      pipesPerLayer: 8,
    });

    const offsetFactor = Math.sqrt(3) / 2;
    const expectedOD = Math.round(
      400 + 2 * (25 + (result.layerCount - 1) * 25 * offsetFactor)
    );
    expect(result.outerDiameter).toBe(expectedOD);
  });

  it("bundle width equals pipes per layer times pipe diameter", () => {
    const result = calculateWindingPositionUneven({
      pipeDiameter: 16,
      length: 200,
      innerDiameter: 250,
      pipesPerLayer: 12,
    });

    expect(result.bundleWidth).toBe(12 * 16);
  });
});

describe("Calculator - Winding Position (Even Layers)", () => {
  it("calculates basic winding position for even layers", () => {
    const result = calculateWindingPositionEven({
      pipeDiameter: 20,
      length: 100,
      innerDiameter: 300,
      pipesPerLayer: 10,
    });

    expect(result.layerCount).toBeGreaterThan(0);
    expect(result.pipesLastLayer).toBeGreaterThan(0);
    expect(result.bundleWidth).toBeGreaterThan(0);
    expect(result.outerDiameter).toBeGreaterThan(300);
  });

  it("even layer bundle height uses sqrt(3)/2 offset factor", () => {
    const result = calculateWindingPositionEven({
      pipeDiameter: 20,
      length: 100,
      innerDiameter: 300,
      pipesPerLayer: 10,
    });

    const offsetFactor = Math.sqrt(3) / 2;
    const expectedHeight = Math.round(
      20 + (result.layerCount - 1) * 20 * offsetFactor
    );
    expect(result.bundleHeight).toBe(expectedHeight);
  });

  it("bundle width includes half-pipe offset", () => {
    const result = calculateWindingPositionEven({
      pipeDiameter: 20,
      length: 100,
      innerDiameter: 300,
      pipesPerLayer: 10,
    });

    expect(result.bundleWidth).toBe(20 * (10 + 0.5));
  });
});

describe("Calculator - Winding Length (Uneven)", () => {
  it("calculates winding length for uneven layers", () => {
    const result = calculateWindingLengthUneven({
      pipeDiameter: 20,
      innerDiameter: 300,
      outerDiameter: 500,
      bundleWidth: 200,
    });

    expect(result.windingLength).toBeGreaterThan(0);
    expect(result.bundleWidth).toBe(200);
  });

  it("still winds at least one layer when OD barely exceeds ID", () => {
    const result = calculateWindingLengthUneven({
      pipeDiameter: 100,
      innerDiameter: 300,
      outerDiameter: 310,
      bundleWidth: 200,
    });

    expect(result.windingLength).toBeGreaterThan(0);
  });
});

describe("Calculator - Winding Length (Even)", () => {
  it("calculates winding length for even layers", () => {
    const result = calculateWindingLengthEven({
      pipeDiameter: 20,
      innerDiameter: 300,
      outerDiameter: 500,
      bundleWidth: 200,
    });

    expect(result.windingLength).toBeGreaterThan(0);
    expect(result.bundleWidth).toBe(190);
  });

  it("both patterns produce positive winding lengths", () => {
    const input = {
      pipeDiameter: 20,
      innerDiameter: 300,
      outerDiameter: 600,
      bundleWidth: 200,
    };

    const uneven = calculateWindingLengthUneven(input);
    const even = calculateWindingLengthEven(input);

    expect(uneven.windingLength).toBeGreaterThan(0);
    expect(even.windingLength).toBeGreaterThan(0);
  });
});

describe("Calculator - input validation", () => {
  it("rejects empty winding position fields as required", () => {
    const result = validateWindingPositionInput({
      pipeDiameter: "",
      length: "  ",
      innerDiameter: "300",
      pipesPerLayer: "10",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.pipeDiameter).toBe("required");
    expect(result.errors.length).toBe("required");
    expect(result.errors.innerDiameter).toBeUndefined();
    expect(result.errors.pipesPerLayer).toBeUndefined();
  });

  it("rejects non-positive and non-numeric winding position values", () => {
    const result = validateWindingPositionInput({
      pipeDiameter: "0",
      length: "-5",
      innerDiameter: "abc",
      pipesPerLayer: "10",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.pipeDiameter).toBe("positive");
    expect(result.errors.length).toBe("positive");
    expect(result.errors.innerDiameter).toBe("invalid");
  });

  it("accepts valid winding position input", () => {
    const result = validateWindingPositionInput({
      pipeDiameter: "20",
      length: "100",
      innerDiameter: "300",
      pipesPerLayer: "10",
    });

    expect(result).toEqual({
      ok: true,
      input: {
        pipeDiameter: 20,
        length: 100,
        innerDiameter: 300,
        pipesPerLayer: 10,
      },
    });
  });

  it("rejects empty and non-positive winding length fields", () => {
    const result = validateWindingLengthInput({
      pipeDiameter: "",
      innerDiameter: "0",
      outerDiameter: "500",
      bundleWidth: "-1",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.pipeDiameter).toBe("required");
    expect(result.errors.innerDiameter).toBe("positive");
    expect(result.errors.bundleWidth).toBe("positive");
  });

  it("requires outer diameter greater than inner diameter", () => {
    const result = validateWindingLengthInput({
      pipeDiameter: "20",
      innerDiameter: "500",
      outerDiameter: "400",
      bundleWidth: "200",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.outerDiameter).toBe("odMustExceedId");
  });

  it("accepts valid winding length input", () => {
    const result = validateWindingLengthInput({
      pipeDiameter: "20",
      innerDiameter: "300",
      outerDiameter: "500",
      bundleWidth: "200",
    });

    expect(result).toEqual({
      ok: true,
      input: {
        pipeDiameter: 20,
        innerDiameter: 300,
        outerDiameter: 500,
        bundleWidth: 200,
      },
    });
  });

  it("accepts German decimal commas", () => {
    const result = validateWindingPositionInput({
      pipeDiameter: "20,5",
      length: "100,25",
      innerDiameter: "300",
      pipesPerLayer: "10",
    });

    expect(result).toEqual({
      ok: true,
      input: {
        pipeDiameter: 20.5,
        length: 100.25,
        innerDiameter: 300,
        pipesPerLayer: 10,
      },
    });
  });

  it("requires at least 2 pipes per layer (live CPL rule)", () => {
    const result = validateWindingPositionInput({
      pipeDiameter: "20",
      length: "100",
      innerDiameter: "300",
      pipesPerLayer: "1",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.pipesPerLayer).toBe("minPipesPerLayer");
  });

  it("requires bundle width at least 2× pipe diameter (live WL rule)", () => {
    const result = validateWindingLengthInput({
      pipeDiameter: "20",
      innerDiameter: "300",
      outerDiameter: "500",
      bundleWidth: "30",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.bundleWidth).toBe("bundleWidthTooNarrow");
  });
});
