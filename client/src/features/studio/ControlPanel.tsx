import { generateScale } from "@hueflow/shared";
import type { AspectRatio, GradientType, HarmonyMode } from "@hueflow/shared";
import { ColourStops } from "./ColourStops";
import { useStudioStore } from "../../stores/studioStore";

const gradientTypes: Array<{ value: GradientType; label: string }> = [
  { value: "linear", label: "Linear" }, { value: "radial", label: "Radial" }, { value: "conic", label: "Conic" }, { value: "mesh", label: "Mesh" }
];
const ratios: AspectRatio[] = ["16:9", "4:3", "1:1", "9:16", "custom"];
const harmonies: Array<{ value: HarmonyMode; label: string }> = [
  { value: "complementary", label: "Complement" }, { value: "analogous", label: "Analogous" }, { value: "triadic", label: "Triadic" }, { value: "split", label: "Split" }, { value: "monochromatic", label: "Mono" }
];

export function ControlPanel() {
  const { config, update, updateStop, applyHarmony } = useStudioStore();
  const scale = generateScale(config.stops[0]?.hex ?? "#FF5C35");
  return <aside className="control-panel" aria-label="Gradient controls">
    <div className="panel-intro"><span>CONTROLS</span><p>Build the colour system, then test it in context.</p></div>
    <div className="control-section">
      <div className="section-heading"><div><span>01</span><h3>Gradient</h3></div></div>
      <div className="segmented-control">{gradientTypes.map((type) => <button key={type.value} className={config.type === type.value ? "active" : ""} onClick={() => update({ type: type.value })}>{type.label}</button>)}</div>
      {config.type !== "radial" && config.type !== "mesh" && <label className="range-field"><span>Angle <output>{config.angle}°</output></span><input type="range" min="0" max="360" value={config.angle} onChange={(event) => update({ angle: Number(event.target.value) })} /></label>}
      {(config.type === "radial" || config.type === "conic") && <div className="range-pair">
        <label className="range-field"><span>Centre X <output>{config.centreX}%</output></span><input type="range" min="0" max="100" value={config.centreX} onChange={(event) => update({ centreX: Number(event.target.value) })} /></label>
        <label className="range-field"><span>Centre Y <output>{config.centreY}%</output></span><input type="range" min="0" max="100" value={config.centreY} onChange={(event) => update({ centreY: Number(event.target.value) })} /></label>
      </div>}
      <label className="range-field"><span>Grain <output>{config.noise}%</output></span><input type="range" min="0" max="40" value={config.noise} onChange={(event) => update({ noise: Number(event.target.value) })} /></label>
      {config.type === "mesh" && <label className="range-field"><span>Softness <output>{config.blur}%</output></span><input type="range" min="0" max="100" value={config.blur} onChange={(event) => update({ blur: Number(event.target.value) })} /></label>}
    </div>
    <ColourStops />
    <div className="control-section">
      <div className="section-heading"><div><span>03</span><h3>Harmony</h3></div></div>
      <div className="harmony-grid">{harmonies.map((item) => <button key={item.value} onClick={() => applyHarmony(item.value)}>{item.label}</button>)}</div>
      <p className="helper-text">Uses the first colour as the harmony anchor.</p>
      <div className="scale-strip" aria-label="Light to dark scale">{scale.map((hex, index) => <button key={hex} style={{ background: hex }} title={hex} onClick={() => config.stops[0] && updateStop(config.stops[0].id, { hex })} aria-label={`Use scale colour ${index + 1}: ${hex}`} />)}</div>
    </div>
    <div className="control-section">
      <div className="section-heading"><div><span>04</span><h3>Canvas</h3></div></div>
      <div className="ratio-grid">{ratios.map((ratio) => <button key={ratio} className={config.aspectRatio === ratio ? "active" : ""} onClick={() => update({ aspectRatio: ratio })}>{ratio === "custom" ? "Custom" : ratio}</button>)}</div>
      {config.aspectRatio === "custom" && <label className="text-field"><span>Custom ratio</span><input value={config.customRatio} onChange={(event) => update({ customRatio: event.target.value })} placeholder="3:2" /></label>}
    </div>
  </aside>;
}
