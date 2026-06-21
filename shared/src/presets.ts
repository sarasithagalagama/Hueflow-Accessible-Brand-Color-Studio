import type { GradientConfig, Preset } from "./types.js";

const paletteData = [
  ["Citrus Ledger", "linear", 128, ["#FF5C35", "#FFB000", "#F7F06D"], ["bright", "warm"], "optimistic"],
  ["Alpine Receipt", "linear", 42, ["#163832", "#55B896", "#DFF5E8"], ["cool", "accessible"], "grounded"],
  ["Night Orchard", "radial", 0, ["#11120F", "#344E41", "#A3B18A"], ["dark", "cool"], "quiet"],
  ["Clay Signal", "linear", 102, ["#7A2E2E", "#D96C4F", "#F2C6A0"], ["warm", "accessible"], "editorial"],
  ["Poolside Manual", "conic", 18, ["#006D77", "#83C5BE", "#EDF6F9", "#FFDDD2"], ["cool", "pastel"], "fresh"],
  ["Lemon Transit", "linear", 86, ["#1D3557", "#F1FA8C", "#FFCA3A"], ["bright", "accessible"], "kinetic"],
  ["Rose Hardware", "mesh", 0, ["#B23A48", "#F4ACB7", "#FFE5D9", "#7D4E57"], ["warm", "pastel"], "tactile"],
  ["Copper Current", "linear", 145, ["#3D1308", "#A44200", "#EFD6AC"], ["warm", "dark"], "crafted"],
  ["Mint Condition", "radial", 0, ["#0B525B", "#4DCCBD", "#C9F2E7"], ["cool", "accessible"], "clean"],
  ["Saffron Type", "linear", 25, ["#3A0CA3", "#F72585", "#FFBE0B"], ["bright"], "expressive"],
  ["Pebble Radio", "linear", 164, ["#2F3E46", "#84A98C", "#CAD2C5"], ["cool", "monochrome"], "measured"],
  ["Papaya Index", "conic", 225, ["#FF6B35", "#F7C59F", "#EFEFD0", "#004E89"], ["bright", "warm"], "playful"],
  ["Ink & Apricot", "linear", 115, ["#101820", "#F2AA4C"], ["dark", "accessible"], "decisive"],
  ["Tidal Ceramic", "mesh", 0, ["#023E8A", "#00B4D8", "#90E0EF", "#FFF3B0"], ["cool", "bright"], "fluid"],
  ["Fig Notebook", "radial", 0, ["#4A1942", "#893168", "#EAE0D5"], ["dark", "warm"], "literary"],
  ["Moss Assembly", "linear", 53, ["#283618", "#606C38", "#DDA15E", "#FEFAE0"], ["warm", "accessible"], "organic"],
  ["Tomato Broadcast", "linear", 91, ["#D00000", "#FFBA08", "#FFF3B0"], ["bright", "warm"], "bold"],
  ["Glacier Postcard", "linear", 136, ["#03045E", "#0077B6", "#CAF0F8"], ["cool", "accessible"], "expansive"],
  ["Lilac Blueprint", "mesh", 0, ["#5A189A", "#C77DFF", "#E0AAFF", "#F8F0FC"], ["pastel", "cool"], "inventive"],
  ["Basil & Brick", "conic", 45, ["#1B4332", "#74C69D", "#BC6C25", "#FDF0D5"], ["warm", "accessible"], "balanced"],
  ["Silver Screen", "linear", 180, ["#161A1D", "#660708", "#E5383B", "#F5F3F4"], ["dark", "monochrome"], "cinematic"],
  ["Sorbet Agenda", "radial", 0, ["#FFAFCC", "#FFC8DD", "#BDE0FE", "#A2D2FF"], ["pastel", "cool"], "gentle"],
  ["Electric Pollen", "conic", 310, ["#240046", "#7B2CBF", "#C8F560", "#FFE66D"], ["bright"], "charged"],
  ["Harbour Stamp", "linear", 72, ["#001219", "#005F73", "#94D2BD", "#EE9B00"], ["dark", "accessible"], "confident"]
] as const;

function config(name: string, type: GradientConfig["type"], angle: number, colours: readonly string[]): GradientConfig {
  return {
    name,
    type,
    angle,
    centreX: 50,
    centreY: 50,
    noise: type === "mesh" ? 8 : 2,
    blur: type === "mesh" ? 38 : 0,
    aspectRatio: "16:9",
    customRatio: "3:2",
    stops: colours.map((hex, index) => ({
      id: `${name.toLowerCase().replace(/\W/g, "")}-${index}`,
      name: ["Primary", "Secondary", "Accent", "Surface", "Detail"][index] ?? `Colour ${index + 1}`,
      hex,
      position: Math.round(index * (100 / (colours.length - 1))),
      locked: false
    }))
  };
}

export const presets: Preset[] = paletteData.map(([name, type, angle, colours, tags, mood], index) => ({
  id: `preset-${index + 1}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  config: config(name, type, angle, colours),
  tags: [...tags],
  mood,
  saveCount: 680 - index * 19 + (index % 4) * 42,
  accessible: (tags as readonly string[]).includes("accessible"),
  createdAt: new Date(Date.UTC(2026, 4, 28 - index)).toISOString()
}));
