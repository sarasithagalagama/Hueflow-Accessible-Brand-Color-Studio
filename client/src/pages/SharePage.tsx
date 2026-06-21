import { Copy, Layers3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { cssVariables, gradientCss, jsonTokens } from "@hueflow/shared";
import { api } from "../api/client";
import { Meta } from "../components/Meta";
import { useStudioStore } from "../stores/studioStore";

export function SharePage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const loadPreset = useStudioStore((state) => state.loadPreset);
  const query = useQuery({ queryKey: ["share", slug], queryFn: () => api.share(slug), retry: false });
  if (query.isLoading) return <div className="page-loader"><p>Opening shared project…</p></div>;
  if (query.isError || !query.data) return <div className="share-error"><span>404 / PRIVATE OR MISSING</span><h1>This colour system isn’t available.</h1><p>The project may be private, deleted, or the link may be incorrect.</p><button onClick={() => navigate("/explore")}>Explore public presets</button></div>;
  const { project, gradients } = query.data;
  const gradient = gradients[0];
  if (!gradient) return <div className="share-error"><h1>This project has no gradients yet.</h1></div>;
  const duplicate = () => { loadPreset(gradient.config); navigate("/studio"); };
  return <div className="share-page">
    <Meta title={project.name} description={project.description || `A public Hueflow colour project by ${project.creator}.`} />
    <header className="share-header"><div><small>PUBLIC COLOUR SYSTEM</small><h1>{project.name}</h1><p>Created by {project.creator} · Updated {new Date(project.updatedAt).toLocaleDateString()}</p></div><button onClick={duplicate}><Layers3 />Duplicate to Studio</button></header>
    <section className="share-hero" style={{ background: gradientCss(gradient.config) }}><span>HF / SHARED</span><div><small>{gradient.config.type.toUpperCase()} GRADIENT</small><h2>{gradient.name}</h2></div></section>
    <div className="share-details">
      <section><small>PALETTE</small><h2>Colours in the system</h2><div className="share-swatches">{gradient.config.stops.map((stop) => <button key={stop.id} onClick={() => navigator.clipboard.writeText(stop.hex)} style={{ background: stop.hex }}><span>{stop.name}</span><b>{stop.hex}</b></button>)}</div></section>
      <section className="share-code"><div><small>HANDOFF</small><h2>Ready for production</h2></div><button onClick={() => navigator.clipboard.writeText(cssVariables(gradient.config))}><Copy />Copy CSS variables</button><pre>{jsonTokens(gradient.config).slice(0, 750)}{jsonTokens(gradient.config).length > 750 ? "\n…" : ""}</pre></section>
    </div>
  </div>;
}
