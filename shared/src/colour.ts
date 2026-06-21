export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function normaliseHex(hex: string): string {
  const raw = hex.trim().replace("#", "");
  if (/^[\da-f]{3}$/i.test(raw)) {
    return `#${raw.split("").map((char) => char + char).join("").toUpperCase()}`;
  }
  if (/^[\da-f]{6}$/i.test(raw)) return `#${raw.toUpperCase()}`;
  throw new Error("Invalid HEX colour");
}

export function hexToRgb(hex: string): RGB {
  const value = normaliseHex(hex).slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const part = (value: number) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === rn) h = 60 * (((gn - bn) / delta) % 6);
    else if (max === gn) h = 60 * ((bn - rn) / delta + 2);
    else h = 60 * ((rn - gn) / delta + 4);
  }
  if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = clamp(s / 100);
  const ln = clamp(l / 100);
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let [r, g, b] = [0, 0, 0];
  if (hp < 1) [r, g] = [c, x];
  else if (hp < 2) [r, g] = [x, c];
  else if (hp < 3) [g, b] = [c, x];
  else if (hp < 4) [g, b] = [x, c];
  else if (hp < 5) [r, b] = [x, c];
  else [r, b] = [c, x];
  const m = ln - c / 2;
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function rgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

export function hslString(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

export function oklchString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const linear = [r, g, b].map((v) => {
    const n = v / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  const [lr = 0, lg = 0, lb = 0] = linear;
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l3 = Math.cbrt(l);
  const m3 = Math.cbrt(m);
  const s3 = Math.cbrt(s);
  const lightness = 0.2104542553 * l3 + 0.793617785 * m3 - 0.0040720468 * s3;
  const a = 1.9779984951 * l3 - 2.428592205 * m3 + 0.4505937099 * s3;
  const b2 = 0.0259040371 * l3 + 0.7827717662 * m3 - 0.808675766 * s3;
  const chroma = Math.sqrt(a * a + b2 * b2);
  const hue = (Math.atan2(b2, a) * 180 / Math.PI + 360) % 360;
  return `oklch(${(lightness * 100).toFixed(1)}% ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
}

export function mixHex(a: string, b: string, amount: number): string {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  const t = clamp(amount);
  return rgbToHex({
    r: first.r + (second.r - first.r) * t,
    g: first.g + (second.g - first.g) * t,
    b: first.b + (second.b - first.b) * t
  });
}

export function bestTextColour(background: string): "#11120F" | "#FFFFFF" {
  return contrastRatio("#11120F", background) >= contrastRatio("#FFFFFF", background) ? "#11120F" : "#FFFFFF";
}

export function accessibleAlternative(foreground: string, background: string, target = 4.5): string {
  if (contrastRatio(foreground, background) >= target) return normaliseHex(foreground);
  const source = hexToHsl(foreground);
  const darkBackground = relativeLuminance(background) < 0.35;
  for (let step = 1; step <= 100; step += 1) {
    const l = darkBackground ? Math.min(100, source.l + step) : Math.max(0, source.l - step);
    const candidate = hslToHex({ ...source, l });
    if (contrastRatio(candidate, background) >= target) return candidate;
  }
  return darkBackground ? "#FFFFFF" : "#000000";
}

export function simulateColourVision(hex: string, mode: "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"): string {
  const { r, g, b } = hexToRgb(hex);
  const matrices = {
    protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
    deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
    tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
    achromatopsia: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]]
  } as const;
  const matrix = matrices[mode];
  return rgbToHex({
    r: r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2],
    g: r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2],
    b: r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]
  });
}
