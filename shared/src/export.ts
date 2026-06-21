import { gradientCss } from "./gradient.js";
import type { GradientConfig } from "./types.js";
import { hslString, oklchString, rgbString } from "./colour.js";

export const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "hueflow-colours";

export function cssVariables(config: GradientConfig): string {
  const colours = config.stops.map((stop) => `  --color-${slugify(stop.name)}: ${stop.hex};`).join("\n");
  return `:root {\n${colours}\n  --gradient-${slugify(config.name)}: ${gradientCss(config)};\n}`;
}

export function scssVariables(config: GradientConfig): string {
  const colours = config.stops.map((stop) => `$color-${slugify(stop.name)}: ${stop.hex};`).join("\n");
  return `${colours}\n$gradient-${slugify(config.name)}: ${gradientCss(config)};`;
}

export function tailwindTheme(config: GradientConfig): string {
  const colours = config.stops.map((stop) => `        '${slugify(stop.name)}': '${stop.hex}',`).join("\n");
  return `export default {\n  theme: {\n    extend: {\n      colors: {\n${colours}\n      },\n      backgroundImage: {\n        '${slugify(config.name)}': '${gradientCss(config)}',\n      },\n    },\n  },\n};`;
}

export function jsonTokens(config: GradientConfig): string {
  return JSON.stringify({
    color: Object.fromEntries(config.stops.map((stop) => [slugify(stop.name), {
      value: stop.hex,
      rgb: rgbString(stop.hex),
      hsl: hslString(stop.hex),
      oklch: oklchString(stop.hex),
      type: "color"
    }])),
    gradient: { [slugify(config.name)]: { value: gradientCss(config), type: "gradient" } }
  }, null, 2);
}

export function svgExport(config: GradientConfig, width = 1600, height = 900): string {
  const sorted = [...config.stops].sort((a, b) => a.position - b.position);
  const stops = sorted.map((stop) => `<stop offset="${stop.position}%" stop-color="${stop.hex}"/>`).join("");
  const radians = (config.angle - 90) * Math.PI / 180;
  const x = Math.cos(radians);
  const y = Math.sin(radians);
  const x1 = 50 - x * 50;
  const y1 = 50 - y * 50;
  const x2 = 50 + x * 50;
  const y2 = 50 + y * 50;
  const gradient = config.type === "radial"
    ? `<radialGradient id="hueflow" cx="${config.centreX}%" cy="${config.centreY}%">${stops}</radialGradient>`
    : `<linearGradient id="hueflow" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stops}</linearGradient>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${gradient}</defs><rect width="100%" height="100%" fill="url(#hueflow)"/></svg>`;
}
