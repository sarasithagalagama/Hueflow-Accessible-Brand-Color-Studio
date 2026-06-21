import type { ColourStop, GradientConfig, HarmonyMode } from "./types.js";
import { hexToHsl, hslToHex, mixHex } from "./colour.js";

export function sortStops(stops: ColourStop[]): ColourStop[] {
  return [...stops].sort((a, b) => a.position - b.position);
}

export function gradientCss(config: GradientConfig): string {
  const stops = sortStops(config.stops).map((stop) => `${stop.hex} ${stop.position}%`).join(", ");
  if (config.type === "linear") return `linear-gradient(${config.angle}deg, ${stops})`;
  if (config.type === "radial") return `radial-gradient(circle at ${config.centreX}% ${config.centreY}%, ${stops})`;
  if (config.type === "conic") return `conic-gradient(from ${config.angle}deg at ${config.centreX}% ${config.centreY}%, ${stops})`;
  return config.stops.map((stop, index) => {
    const positions = [[15, 20], [82, 22], [26, 84], [78, 78], [50, 48], [52, 90]];
    const [x, y] = positions[index] ?? [50, 50];
    const radius = Math.max(28, 72 - config.blur / 2);
    return `radial-gradient(circle at ${x}% ${y}%, ${stop.hex} 0%, transparent ${radius}%)`;
  }).join(", ");
}

export function sampleGradient(stops: ColourStop[], count = 13): Array<{ position: number; hex: string }> {
  const sorted = sortStops(stops);
  return Array.from({ length: count }, (_, index) => {
    const position = count === 1 ? 0 : (index / (count - 1)) * 100;
    const rightIndex = sorted.findIndex((stop) => stop.position >= position);
    if (rightIndex <= 0) return { position, hex: sorted[0]?.hex ?? "#000000" };
    const right = sorted[rightIndex];
    const left = sorted[rightIndex - 1];
    if (!right || !left) return { position, hex: sorted.at(-1)?.hex ?? "#000000" };
    const span = Math.max(1, right.position - left.position);
    return { position, hex: mixHex(left.hex, right.hex, (position - left.position) / span) };
  });
}

export function generateHarmony(base: string, mode: HarmonyMode): string[] {
  const source = hexToHsl(base);
  const hues: Record<HarmonyMode, number[]> = {
    complementary: [0, 180],
    analogous: [-32, 0, 32],
    triadic: [0, 120, 240],
    split: [0, 150, 210],
    monochromatic: [0, 0, 0, 0, 0]
  };
  return hues[mode].map((offset, index, items) => hslToHex({
    h: source.h + offset,
    s: mode === "monochromatic" ? Math.max(15, source.s - index * 7) : source.s,
    l: mode === "monochromatic" ? 18 + index * (64 / Math.max(1, items.length - 1)) : source.l
  }));
}

export function generateScale(base: string, steps = 9): string[] {
  const source = hexToHsl(base);
  return Array.from({ length: steps }, (_, index) => hslToHex({
    h: source.h,
    s: Math.max(8, source.s - Math.abs(index - steps / 2) * 2),
    l: 96 - index * (88 / (steps - 1))
  }));
}
