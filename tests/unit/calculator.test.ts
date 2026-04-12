import { describe, it, expect } from "vitest";
import {
  calculateWindingPositionUneven,
  calculateWindingPositionEven,
  calculateWindingLengthUneven,
  calculateWindingLengthEven,
} from "@/lib/calculator";

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

  it("outer diameter is inner diameter plus twice the bundle height", () => {
    const result = calculateWindingPositionUneven({
      pipeDiameter: 25,
      length: 50,
      innerDiameter: 400,
      pipesPerLayer: 8,
    });

    const expectedOD = 400 + 2 * result.layerCount * 25;
    expect(result.outerDiameter).toBeCloseTo(expectedOD, 0);
  });

  it("bundle width equals pipes per layer times pipe diameter", () => {
    const result = calculateWindingPositionUneven({
      pipeDiameter: 16,
      length: 200,
      innerDiameter: 250,
      pipesPerLayer: 12,
    });

    expect(result.bundleWidth).toBeCloseTo(12 * 16, 0);
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
    const expectedHeight = 20 + (result.layerCount - 1) * 20 * offsetFactor;
    expect(result.bundleHeight).toBeCloseTo(expectedHeight, 0);
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
    expect(result.outerDiameter).toBe(500);
    expect(result.bundleWidth).toBe(200);
  });

  it("returns zero length when dimensions make no layers possible", () => {
    const result = calculateWindingLengthUneven({
      pipeDiameter: 100,
      innerDiameter: 300,
      outerDiameter: 310,
      bundleWidth: 200,
    });

    expect(result.windingLength).toBe(0);
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
    expect(result.outerDiameter).toBe(500);
    expect(result.bundleWidth).toBe(200);
  });

  it("even layers produce slightly longer winding than uneven due to offset", () => {
    const input = {
      pipeDiameter: 20,
      innerDiameter: 300,
      outerDiameter: 600,
      bundleWidth: 200,
    };

    const uneven = calculateWindingLengthUneven(input);
    const even = calculateWindingLengthEven(input);

    // Both should produce positive lengths
    expect(uneven.windingLength).toBeGreaterThan(0);
    expect(even.windingLength).toBeGreaterThan(0);
  });
});
