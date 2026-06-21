import { AlertTriangle, ArrowRight, Check, Eye, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { accessibleAlternative, bestTextColour, contrastRatio, gradientCss, sampleGradient, simulateColourVision } from "@hueflow/shared";
import { Meta } from "../components/Meta";
import { useStudioStore } from "../stores/studioStore";

type Simulation = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

export function AccessibilityPage() {
  const config = useStudioStore((state) => state.config);
  const [foreground, setForeground] = useState("#FFFFFF");
  const [background, setBackground] = useState(config.stops[0]?.hex ?? "#11120F");
  const [simulation, setSimulation] = useState<Simulation>("none");
  const ratio = contrastRatio(foreground, background);
  const samples = useMemo(() => sampleGradient(config.stops, 17).map((sample) => ({ ...sample, ratio: contrastRatio(foreground, sample.hex) })), [config.stops, foreground]);
  const weakest = samples.reduce((minimum, sample) => sample.ratio < minimum.ratio ? sample : minimum, samples[0] ?? { ratio: 1, position: 0, hex: "#000000" });
  const suggestion = accessibleAlternative(foreground, background);
  const checks = [
    ["AA normal", 4.5], ["AA large", 3], ["AAA normal", 7], ["AAA large", 4.5]
  ] as const;
  const simulated = (hex: string) => simulation === "none" ? hex : simulateColourVision(hex, simulation);
  return <div className="content-page accessibility-page">
    <Meta title="Accessibility" description="Measure WCAG contrast, inspect palette combinations, and simulate common colour-vision deficiencies." />
    <header className="page-heading compact"><div><small>ACCESSIBILITY WORKSPACE</small><h1>Contrast is a relationship,<br />not a colour.</h1></div><p>Test colour pairs, inspect the weakest point across your current gradient, and find practical alternatives that preserve intent.</p></header>
    <div className="access-layout">
      <section className="contrast-workbench">
        <div className="workbench-heading"><div><span>PAIR CHECK</span><h2>Foreground on background</h2></div><Eye size={20} /></div>
        <div className="colour-pair-controls">
          <label><span>Foreground</span><div><input type="color" value={foreground} onChange={(event) => setForeground(event.target.value.toUpperCase())} /><input value={foreground} onChange={(event) => /^#[0-9a-f]{6}$/i.test(event.target.value) && setForeground(event.target.value.toUpperCase())} /></div></label>
          <ArrowRight />
          <label><span>Background</span><div><input type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /><input value={background} onChange={(event) => /^#[0-9a-f]{6}$/i.test(event.target.value) && setBackground(event.target.value.toUpperCase())} /></div></label>
        </div>
        <div className="ratio-display"><div><small>CONTRAST RATIO</small><strong>{ratio.toFixed(2)}<span>:1</span></strong></div><p className={ratio >= 4.5 ? "pass" : "fail"}>{ratio >= 4.5 ? <Check /> : <AlertTriangle />}{ratio >= 4.5 ? "Passes AA normal text" : "Does not pass AA normal text"}</p></div>
        <div className="criteria-grid">{checks.map(([label, target]) => <div key={label} className={ratio >= target ? "pass" : "fail"}><span>{ratio >= target ? <Check size={14} /> : "×"}</span><div><b>{label}</b><small>{target}:1 required</small></div></div>)}</div>
        <div className="text-specimen" style={{ background, color: foreground }}><small>TEXT SPECIMEN</small><p className="size-large">Good colour earns attention.</p><p className="size-normal">Accessible design makes the message easier to perceive, understand and act on.</p><a href="#sample-link">A sample link with context</a><button style={{ color: background, background: foreground }}>Primary action</button></div>
        {suggestion !== foreground && <div className="suggestion"><div className="suggestion-swatch" style={{ background: suggestion }} /><div><small>SUGGESTED FOREGROUND</small><b>{suggestion}</b><p>{contrastRatio(suggestion, background).toFixed(2)}:1 while preserving the original hue where practical.</p></div><button onClick={() => setForeground(suggestion)}>Use colour</button></div>}
      </section>
      <aside className="gradient-audit">
        <div className="workbench-heading"><div><span>GRADIENT AUDIT</span><h2>Conservative text contrast</h2></div></div>
        <div className="gradient-audit-preview" style={{ background: gradientCss(config), color: foreground }}><h3>Readable everywhere?</h3><p>The lowest sampled contrast is the number that matters.</p><span style={{ left: `${weakest.position}%` }} /></div>
        <div className="minimum-score"><small>LOWEST OF 17 SAMPLES</small><strong>{weakest.ratio.toFixed(2)}:1</strong><p>Weakest near {Math.round(weakest.position)}% of the gradient.</p></div>
        <div className="notice"><Info size={17} /><p>Endpoint checks are not enough. Text may cross many colours, and sampling cannot guarantee every possible layout. Treat this as a conservative design aid, then verify the final interface.</p></div>
        <label className="simulation-select"><span>Colour-vision simulation</span><select value={simulation} onChange={(event) => setSimulation(event.target.value as Simulation)}><option value="none">Original colours</option><option value="protanopia">Protanopia</option><option value="deuteranopia">Deuteranopia</option><option value="tritanopia">Tritanopia</option><option value="achromatopsia">Achromatopsia</option></select></label>
        <div className="simulation-preview" style={{ background: gradientCss({ ...config, stops: config.stops.map((stop) => ({ ...stop, hex: simulated(stop.hex) })) }) }}><span>{simulation === "none" ? "Original" : simulation}</span></div>
      </aside>
    </div>
    <section className="matrix-section">
      <div className="matrix-heading"><div><small>PALETTE MATRIX</small><h2>Every colour against every colour</h2></div><p>Ratios of 4.5:1 or higher are marked as suitable for normal text.</p></div>
      <div className="contrast-matrix">
        <div />
        {config.stops.map((stop) => <div className="matrix-axis" key={`head-${stop.id}`}><span style={{ background: stop.hex }} />{stop.name}</div>)}
        {config.stops.map((foregroundStop) => <div className="matrix-row" key={foregroundStop.id}>
          <div className="matrix-axis"><span style={{ background: foregroundStop.hex }} />{foregroundStop.name}</div>
          {config.stops.map((backgroundStop) => {
            const value = contrastRatio(foregroundStop.hex, backgroundStop.hex);
            return <div className={value >= 4.5 ? "matrix-pass" : ""} style={{ color: bestTextColour(backgroundStop.hex), background: backgroundStop.hex }} key={backgroundStop.id}><b>{value.toFixed(1)}</b><small>{value >= 4.5 ? "AA" : "—"}</small></div>;
          })}
        </div>)}
      </div>
    </section>
  </div>;
}
