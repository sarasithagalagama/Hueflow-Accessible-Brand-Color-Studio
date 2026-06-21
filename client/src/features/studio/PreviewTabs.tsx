import { AppWindow, Box, Image, LayoutTemplate, Smartphone, Square } from "lucide-react";
import type { PreviewMode } from "@hueflow/shared";
import { useStudioStore } from "../../stores/studioStore";

const options: Array<{ id: PreviewMode; label: string; icon: typeof AppWindow }> = [
  { id: "hero", label: "Website", icon: LayoutTemplate },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "social", label: "Social", icon: Image },
  { id: "poster", label: "Poster", icon: Square },
  { id: "components", label: "Components", icon: Box },
  { id: "plain", label: "Plain", icon: AppWindow }
];

export function PreviewTabs() {
  const { previewMode, setPreviewMode } = useStudioStore();
  return <div className="preview-tabs" role="tablist" aria-label="Preview mode">
    {options.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={previewMode === id} className={previewMode === id ? "active" : ""} onClick={() => setPreviewMode(id)}><Icon size={15} />{label}</button>)}
  </div>;
}
