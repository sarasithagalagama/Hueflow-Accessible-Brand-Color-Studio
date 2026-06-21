import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { GradientCanvas } from "./GradientCanvas";
import { useStudioStore } from "../../stores/studioStore";
import { presets } from "@hueflow/shared";

describe("GradientCanvas", () => {
  beforeEach(() => {
    useStudioStore.setState({ config: structuredClone(presets[0]!.config), previewMode: "hero" });
  });

  it("renders the current gradient and preview", () => {
    render(<GradientCanvas />);
    expect(screen.getByLabelText("Sunset Glow hero preview")).toBeInTheDocument();
    expect(screen.getByText(/Ideas with/)).toBeInTheDocument();
  });

  it("updates immediately when the store changes", () => {
    useStudioStore.getState().update({ name: "Fresh direction", type: "radial" });
    render(<GradientCanvas />);
    expect(screen.getByLabelText("Fresh direction hero preview")).toHaveStyle({ background: expect.stringContaining("radial-gradient") });
  });
});
