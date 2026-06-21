import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb, normaliseHex, rgbToHex } from "./colour.js";
import { gradientCss, sampleGradient } from "./gradient.js";
import { cssVariables, jsonTokens } from "./export.js";
import { presets } from "./presets.js";

describe("colour utilities", () => {
  it("converts HEX and RGB without drift", () => {
    expect(hexToRgb("#FF5C35")).toEqual({ r: 255, g: 92, b: 53 });
    expect(rgbToHex({ r: 255, g: 92, b: 53 })).toBe("#FF5C35");
    expect(normaliseHex("#abc")).toBe("#AABBCC");
  });

  it("calculates canonical black/white contrast", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
  });
});

describe("gradient and exports", () => {
  const gradient = presets[0]!.config;

  it("creates valid CSS and samples the full range", () => {
    expect(gradientCss(gradient)).toContain("linear-gradient");
    const samples = sampleGradient(gradient.stops, 5);
    expect(samples).toHaveLength(5);
    expect(samples[0]?.position).toBe(0);
    expect(samples.at(-1)?.position).toBe(100);
  });

  it("creates syntactically useful token exports", () => {
    expect(cssVariables(gradient)).toContain("--gradient-citrus-ledger");
    expect(() => JSON.parse(jsonTokens(gradient))).not.toThrow();
  });
});
