import { Download, Expand, Redo2, RotateCcw, Save, Shuffle, Undo2 } from "lucide-react";
import { useState } from "react";
import { useStudioStore } from "../../stores/studioStore";
import { ExportModal } from "./ExportModal";
import { GradientCanvas } from "./GradientCanvas";

export function StudioToolbar({ onSave }: { onSave: () => void }) {
  const { config, history, future, randomise, undo, redo, reset, update } = useStudioStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  return <>
    <div className="studio-toolbar">
      <div className="name-field"><span className="status-dot" /><input aria-label="Gradient name" value={config.name} onChange={(event) => update({ name: event.target.value })} /></div>
      <div className="toolbar-cluster">
        <button aria-label="Undo" onClick={undo} disabled={!history.length} title="Undo (Ctrl+Z)"><Undo2 size={16} /><span>Undo</span></button>
        <button aria-label="Redo" onClick={redo} disabled={!future.length} title="Redo (Ctrl+Shift+Z)"><Redo2 size={16} /><span>Redo</span></button>
        <button aria-label="Randomise" onClick={randomise} title="Randomise (R)"><Shuffle size={16} /><span>Randomise</span></button>
        <button aria-label="Reset" onClick={reset} title="Reset"><RotateCcw size={16} /><span>Reset</span></button>
      </div>
      <div className="toolbar-cluster">
        <button aria-label="Full-screen preview" onClick={() => setFullScreen(true)}><Expand size={16} /><span>Preview</span></button>
        <button aria-label="Save to project" onClick={onSave}><Save size={16} /><span>Save</span></button>
        <button aria-label="Export" className="button-primary" onClick={() => setExportOpen(true)}><Download size={16} /><span>Export</span></button>
      </div>
    </div>
    {exportOpen && <ExportModal onClose={() => setExportOpen(false)} />}
    {fullScreen && <div className="fullscreen-preview" role="dialog" aria-modal="true"><button className="fullscreen-close" onClick={() => setFullScreen(false)}>Close preview ×</button><GradientCanvas fullscreen /></div>}
  </>;
}
