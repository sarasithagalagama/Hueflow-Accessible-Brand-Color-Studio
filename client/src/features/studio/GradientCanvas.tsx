import { bestTextColour, gradientCss } from "@hueflow/shared";
import { useStudioStore } from "../../stores/studioStore";

const ratioMap = { "16:9": "16 / 9", "4:3": "4 / 3", "1:1": "1", "9:16": "9 / 16" } as const;

export function GradientCanvas({ fullscreen = false }: { fullscreen?: boolean }) {
  const { config, previewMode } = useStudioStore();
  const background = gradientCss(config);
  const foreground = bestTextColour(config.stops[Math.floor(config.stops.length / 2)]?.hex ?? "#FFFFFF");
  const ratio = config.aspectRatio === "custom" ? config.customRatio.replace(":", " / ") : ratioMap[config.aspectRatio];
  const style = { "--gradient": background, "--preview-fg": foreground, aspectRatio: fullscreen ? undefined : ratio } as React.CSSProperties;

  return <section className={`gradient-canvas preview-${previewMode} ${fullscreen ? "is-fullscreen" : ""}`} style={style} aria-label={`${config.name} ${previewMode} preview`}>
    {config.noise > 0 && <div className="noise-overlay" style={{ opacity: config.noise / 250 }} />}
    {previewMode === "hero" && <div className="hero-preview">
      <div className="mock-nav"><b>Northline</b><span>Work</span><span>Services</span><i>Start a project</i></div>
      <div className="hero-copy"><small>Independent creative practice</small><h2>Ideas with<br />forward motion.</h2><p>Strategy, identity and digital experiences for teams building what comes next.</p><button>View selected work <span>↗</span></button></div>
      <div className="canvas-index">HF—01</div>
    </div>}
    {previewMode === "mobile" && <div className="mobile-preview">
      <div className="phone-shell"><div className="phone-bar"><span>9:41</span><b>● ● ●</b></div><div className="phone-content"><small>YOUR WEEK</small><h2>Move with<br />intention.</h2><div className="activity-ring"><b>74</b><span>focus score</span></div><div className="phone-card"><span>Today’s rhythm</span><b>Deep work · 2h 20m</b></div></div><div className="phone-dock"><span>⌂</span><span>◫</span><span>◎</span><span>◇</span></div></div>
    </div>}
    {previewMode === "social" && <div className="social-preview"><small>FIELD NOTES / 024</small><h2>Colour is a<br />working material.</h2><p>Build systems, not swatches.</p><b>@hueflow.studio</b></div>}
    {previewMode === "poster" && <div className="poster-preview"><div><small>DESIGN ASSEMBLY</small><h2>FORM<br />FOLLOWS<br />FEELING</h2></div><p>Colombo · 08.24<br />Studio Hall 03</p><span>↘</span></div>}
    {previewMode === "components" && <div className="components-preview">
      <div className="component-card"><small>PROJECT HEALTH</small><h3>Everything’s flowing.</h3><p>Your system passes 8 of 10 accessibility checks.</p><div className="progress"><span /></div><div className="button-row"><button>View report</button><button className="secondary">Dismiss</button></div></div>
      <div className="mini-stack"><span className="badge">● Live system</span><label>Email address<input value="hello@hueflow.design" readOnly /></label><a href="#component-link">Read the guidelines →</a></div>
    </div>}
    {previewMode === "plain" && <div className="plain-preview"><small>LIVE GRADIENT</small><h2>{config.name}</h2><p>{config.type} · {config.stops.length} colours · {config.angle}°</p></div>}
  </section>;
}
