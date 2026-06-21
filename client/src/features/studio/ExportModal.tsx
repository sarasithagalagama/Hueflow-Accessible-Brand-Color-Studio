import { Check, Copy, Download, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cssVariables, gradientCss, jsonTokens, scssVariables, slugify, svgExport, tailwindTheme } from "@hueflow/shared";
import { useStudioStore } from "../../stores/studioStore";

type Tab = "css" | "variables" | "tailwind" | "json" | "scss" | "svg" | "png";

export function ExportModal({ onClose }: { onClose: () => void }) {
  const { config } = useStudioStore();
  const [tab, setTab] = useState<Tab>("css");
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "css", label: "CSS" }, { id: "variables", label: "Variables" }, { id: "tailwind", label: "Tailwind" }, { id: "json", label: "JSON" }, { id: "scss", label: "SCSS" }, { id: "svg", label: "SVG" }, { id: "png", label: "PNG" }
  ];
  const exports: Record<Exclude<Tab, "png">, string> = {
    css: `background: ${gradientCss(config)};`,
    variables: cssVariables(config),
    tailwind: tailwindTheme(config),
    json: jsonTokens(config),
    scss: scssVariables(config),
    svg: svgExport(config)
  };
  const content = tab === "png" ? "" : exports[tab];

  useEffect(() => {
    dialog.current?.focus();
    const listener = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  const downloadText = () => {
    const extensions: Record<Exclude<Tab, "png">, string> = { css: "css", variables: "css", tailwind: "ts", json: "json", scss: "scss", svg: "svg" };
    const blob = new Blob([content], { type: tab === "svg" ? "image/svg+xml" : "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${slugify(config.name)}.${extensions[tab as Exclude<Tab, "png">]}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const downloadPng = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1600; canvas.height = 900;
    const context = canvas.getContext("2d");
    if (!context) return;
    const stops = [...config.stops].sort((a, b) => a.position - b.position);
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    stops.forEach((stop) => gradient.addColorStop(stop.position / 100, stop.hex));
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.download = `${slugify(config.name)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="export-modal" role="dialog" aria-modal="true" aria-labelledby="export-title" tabIndex={-1} ref={dialog}>
      <div className="modal-heading"><div><small>DEVELOPER HANDOFF</small><h2 id="export-title">Export {config.name}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close export"><X /></button></div>
      <div className="export-tabs" role="tablist">{tabs.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>
      {config.type === "mesh" && <p className="export-note">Mesh exports use layered radial gradients in CSS. SVG and PNG are flattened representations.</p>}
      {tab !== "png" ? <div className="code-panel"><div><span>{tab.toUpperCase()} output</span><button onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy"}</button></div><pre><code>{content}</code></pre></div>
        : <div className="png-panel" style={{ background: gradientCss(config) }}><div><b>1600 × 900</b><span>PNG · sRGB</span></div></div>}
      <div className="modal-footer"><p>{tab === "png" ? "Raster export is generated in your browser." : "Generated syntax is ready to paste into your project."}</p><button className="button-primary" onClick={tab === "png" ? downloadPng : downloadText}><Download size={16} /> Download {tab.toUpperCase()}</button></div>
    </div>
  </div>;
}
