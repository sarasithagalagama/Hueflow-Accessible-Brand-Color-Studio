import { ChevronDown, ChevronUp, Copy, GripVertical, Lock, Plus, Trash2, Unlock } from "lucide-react";
import { useState } from "react";
import { hslString, oklchString, rgbString } from "@hueflow/shared";
import { useStudioStore } from "../../stores/studioStore";
import { Toast } from "../../components/Toast";

export function ColourStops() {
  const { config, updateStop, addStop, removeStop, moveStop } = useStudioStore();
  const [copied, setCopied] = useState("");
  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  };
  return <div className="control-section">
    <div className="section-heading"><div><span>02</span><h3>Colour stops</h3></div><button onClick={addStop} disabled={config.stops.length >= 6}><Plus size={15} /> Add</button></div>
    <div className="colour-stop-list">
      {config.stops.map((stop, index) => <div className="colour-stop" key={stop.id}>
        <GripVertical size={15} className="grip" />
        <input className="colour-input" type="color" value={stop.hex} onChange={(event) => updateStop(stop.id, { hex: event.target.value.toUpperCase() })} aria-label={`${stop.name} colour picker`} />
        <div className="stop-fields">
          <input value={stop.name} onChange={(event) => updateStop(stop.id, { name: event.target.value })} aria-label={`Role for ${stop.hex}`} />
          <div className="hex-row"><input value={stop.hex} pattern="^#[0-9A-Fa-f]{6}$" onChange={(event) => /^#[0-9A-Fa-f]{6}$/.test(event.target.value) && updateStop(stop.id, { hex: event.target.value.toUpperCase() })} aria-label={`${stop.name} HEX`} /><button onClick={() => copy(stop.hex, stop.name)} aria-label={`Copy ${stop.name} HEX`}><Copy size={13} /></button></div>
        </div>
        <div className="stop-position"><input type="number" min="0" max="100" value={stop.position} onChange={(event) => updateStop(stop.id, { position: Number(event.target.value) })} aria-label={`${stop.name} position`} /><span>%</span></div>
        <div className="stop-actions">
          <button onClick={() => updateStop(stop.id, { locked: !stop.locked })} aria-label={`${stop.locked ? "Unlock" : "Lock"} ${stop.name}`}>{stop.locked ? <Lock size={14} /> : <Unlock size={14} />}</button>
          <button onClick={() => moveStop(stop.id, -1)} disabled={index === 0} aria-label={`Move ${stop.name} up`}><ChevronUp size={14} /></button>
          <button onClick={() => moveStop(stop.id, 1)} disabled={index === config.stops.length - 1} aria-label={`Move ${stop.name} down`}><ChevronDown size={14} /></button>
          <button onClick={() => removeStop(stop.id)} disabled={config.stops.length <= 2} aria-label={`Remove ${stop.name}`}><Trash2 size={14} /></button>
        </div>
        <details className="colour-formats"><summary>Colour values</summary><button onClick={() => copy(rgbString(stop.hex), `${stop.name} RGB`)}>{rgbString(stop.hex)}</button><button onClick={() => copy(hslString(stop.hex), `${stop.name} HSL`)}>{hslString(stop.hex)}</button><button onClick={() => copy(oklchString(stop.hex), `${stop.name} OKLCH`)}>{oklchString(stop.hex)}</button></details>
      </div>)}
    </div>
    {copied && <Toast message={`${copied} copied`} />}
  </div>;
}
