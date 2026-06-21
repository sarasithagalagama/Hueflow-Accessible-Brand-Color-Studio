import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ColourStop, GradientConfig, HarmonyMode, PreviewMode } from "@hueflow/shared";
import { generateHarmony, presets } from "@hueflow/shared";

interface StudioSnapshot {
  config: GradientConfig;
  previewMode: PreviewMode;
}

interface StudioState extends StudioSnapshot {
  history: StudioSnapshot[];
  future: StudioSnapshot[];
  isDirty: boolean;
  update: (patch: Partial<GradientConfig>) => void;
  updateStop: (id: string, patch: Partial<ColourStop>) => void;
  addStop: () => void;
  removeStop: (id: string) => void;
  moveStop: (id: string, direction: -1 | 1) => void;
  randomise: () => void;
  applyHarmony: (mode: HarmonyMode) => void;
  loadPreset: (config: GradientConfig) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  markSaved: () => void;
}

const initial: StudioSnapshot = { config: presets[0]!.config, previewMode: "hero" };
const colours = ["#FF5C35", "#FFB000", "#F7F06D", "#006D77", "#83C5BE", "#1D3557", "#F72585", "#4DCCBD", "#B23A48", "#C8F560"];
const clone = <T,>(value: T): T => structuredClone(value);

export const useStudioStore = create<StudioState>()(persist((set, get) => {
  const commit = (next: StudioSnapshot) => {
    const current = get();
    set({
      ...next,
      history: [...current.history.slice(-39), { config: clone(current.config), previewMode: current.previewMode }],
      future: [],
      isDirty: true
    });
  };

  return {
    ...clone(initial),
    history: [],
    future: [],
    isDirty: false,
    update: (patch) => commit({ config: { ...get().config, ...patch }, previewMode: get().previewMode }),
    updateStop: (id, patch) => commit({
      config: { ...get().config, stops: get().config.stops.map((stop) => stop.id === id ? { ...stop, ...patch } : stop) },
      previewMode: get().previewMode
    }),
    addStop: () => {
      const stops = get().config.stops;
      if (stops.length >= 6) return;
      const index = stops.length;
      commit({
        config: {
          ...get().config,
          stops: [...stops, {
            id: crypto.randomUUID(),
            name: `Colour ${index + 1}`,
            hex: colours[index % colours.length] ?? "#FF5C35",
            position: Math.round(index * (100 / Math.max(index, 1))),
            locked: false
          }]
        },
        previewMode: get().previewMode
      });
    },
    removeStop: (id) => {
      if (get().config.stops.length <= 2) return;
      commit({ config: { ...get().config, stops: get().config.stops.filter((stop) => stop.id !== id) }, previewMode: get().previewMode });
    },
    moveStop: (id, direction) => {
      const stops = [...get().config.stops];
      const index = stops.findIndex((stop) => stop.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= stops.length) return;
      [stops[index], stops[target]] = [stops[target]!, stops[index]!];
      commit({ config: { ...get().config, stops }, previewMode: get().previewMode });
    },
    randomise: () => {
      const stops = get().config.stops.map((stop) => stop.locked ? stop : {
        ...stop,
        hex: `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`
      });
      commit({ config: { ...get().config, stops, angle: Math.round(Math.random() * 360) }, previewMode: get().previewMode });
    },
    applyHarmony: (mode) => {
      const base = get().config.stops[0]?.hex ?? "#FF5C35";
      const harmony = generateHarmony(base, mode);
      const stops = harmony.map((hex, index) => ({
        id: get().config.stops[index]?.id ?? crypto.randomUUID(),
        name: get().config.stops[index]?.name ?? `Colour ${index + 1}`,
        hex,
        position: Math.round(index * (100 / Math.max(1, harmony.length - 1))),
        locked: false
      }));
      commit({ config: { ...get().config, stops }, previewMode: get().previewMode });
    },
    loadPreset: (config) => commit({ config: clone(config), previewMode: get().previewMode }),
    setPreviewMode: (previewMode) => set({ previewMode }),
    undo: () => {
      const { history, config, previewMode, future } = get();
      const previous = history.at(-1);
      if (!previous) return;
      set({ ...clone(previous), history: history.slice(0, -1), future: [{ config: clone(config), previewMode }, ...future], isDirty: true });
    },
    redo: () => {
      const { future, config, previewMode, history } = get();
      const next = future[0];
      if (!next) return;
      set({ ...clone(next), future: future.slice(1), history: [...history, { config: clone(config), previewMode }], isDirty: true });
    },
    reset: () => commit(clone(initial)),
    markSaved: () => set({ isDirty: false })
  };
}, {
  name: "hueflow-studio-draft",
  partialize: (state) => ({ config: state.config, previewMode: state.previewMode, isDirty: state.isDirty })
}));
