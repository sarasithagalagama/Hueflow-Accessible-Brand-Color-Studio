import { useEffect } from "react";
import { Meta } from "../components/Meta";
import { ControlPanel } from "../features/studio/ControlPanel";
import { GradientCanvas } from "../features/studio/GradientCanvas";
import { PreviewTabs } from "../features/studio/PreviewTabs";
import { StudioToolbar } from "../features/studio/StudioToolbar";
import { useStudioStore } from "../stores/studioStore";

export function StudioPage() {
  const { randomise, undo, redo, isDirty } = useStudioStore();
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches("input, textarea, select, [contenteditable=true]")) return;
      if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey) randomise();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [randomise, redo, undo]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      if (isDirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, [isDirty]);
  return <>
    <Meta title="Studio" description="Create gradients, test them in real interfaces, and export production-ready colour tokens." />
    <div className="studio-page">
      <StudioToolbar />
      <div className="studio-layout">
        <div className="canvas-workspace">
          <div className="workspace-label"><span>LIVE CANVAS</span><i>{isDirty ? "Draft saved locally" : "Saved"}</i></div>
          <GradientCanvas />
          <PreviewTabs />
          <div className="shortcut-strip"><span><kbd>R</kbd> Randomise</span><span><kbd>⌘ Z</kbd> Undo</span><span><kbd>⇧ ⌘ Z</kbd> Redo</span><p>Create colour systems that work everywhere.</p></div>
        </div>
        <ControlPanel />
      </div>
    </div>
  </>;
}
