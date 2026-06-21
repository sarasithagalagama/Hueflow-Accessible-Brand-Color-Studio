export type GradientType = "linear" | "radial" | "conic" | "mesh";
export type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16" | "custom";
export type PreviewMode = "hero" | "mobile" | "social" | "poster" | "components" | "plain";
export type HarmonyMode = "complementary" | "analogous" | "triadic" | "split" | "monochromatic";

export interface ColourStop {
  id: string;
  name: string;
  hex: string;
  position: number;
  locked: boolean;
}

export interface GradientConfig {
  name: string;
  type: GradientType;
  angle: number;
  centreX: number;
  centreY: number;
  noise: number;
  blur: number;
  aspectRatio: AspectRatio;
  customRatio: string;
  stops: ColourStop[];
}

export interface Preset {
  id: string;
  name: string;
  slug: string;
  config: GradientConfig;
  tags: string[];
  mood: string;
  saveCount: number;
  accessible: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ path: string; message: string }>;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  visibility: "private" | "public";
  tags: string[];
  updatedAt: string;
  gradientCount?: number;
  previewGradient?: GradientConfig;
}

export interface SavedGradient {
  id: string;
  projectId: string;
  name: string;
  config: GradientConfig;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
