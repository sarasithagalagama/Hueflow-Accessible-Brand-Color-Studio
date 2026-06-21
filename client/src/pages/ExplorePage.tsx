import { ArrowUpRight, Copy, Heart, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { gradientCss, presets } from "@hueflow/shared";
import { useNavigate } from "react-router-dom";
import { Meta } from "../components/Meta";
import { Toast } from "../components/Toast";
import { useStudioStore } from "../stores/studioStore";

const filters = ["all", "bright", "pastel", "dark", "warm", "cool", "monochrome", "accessible"] as const;

export function ExplorePage() {
  const navigate = useNavigate();
  const loadPreset = useStudioStore((state) => state.loadPreset);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [sort, setSort] = useState("popular");
  const [limit, setLimit] = useState(12);
  const [copied, setCopied] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const items = useMemo(() => {
    const search = query.toLowerCase().trim();
    const result = presets.filter((preset) =>
      (!search || `${preset.name} ${preset.tags.join(" ")} ${preset.config.stops.map((stop) => stop.hex).join(" ")}`.toLowerCase().includes(search)) &&
      (filter === "all" || (filter === "accessible" ? preset.accessible : preset.tags.includes(filter)))
    );
    return [...result].sort((a, b) => sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : sort === "saved" ? Number(saved.includes(b.id)) - Number(saved.includes(a.id)) : b.saveCount - a.saveCount);
  }, [filter, query, saved, sort]);
  const open = (config: (typeof presets)[number]["config"]) => { loadPreset(config); navigate("/studio"); };
  const copy = async (name: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(name);
    window.setTimeout(() => setCopied(""), 1500);
  };
  return <div className="content-page explore-page">
    <Meta title="Explore" description="Browse original gradients and accessible palette ideas, then open any preset in the Hueflow Studio." />
    <header className="editorial-header">
      <div><small>CURATED LIBRARY / 24 SYSTEMS</small><h1>Colour with<br />somewhere to go.</h1></div>
      <p>Original gradients and palettes built for real interface work. Search, save, copy, or pull one apart in the Studio.</p>
    </header>
    <div className="gallery-tools">
      <label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, colour or tag" /></label>
      <div className="filter-scroll"><SlidersHorizontal size={15} />{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort presets"><option value="popular">Most popular</option><option value="newest">Newest</option><option value="saved">Most saved</option></select>
    </div>
    {items.length ? <div className="preset-grid">
      {items.slice(0, limit).map((preset, index) => <article className={`preset-card size-${index % 5}`} key={preset.id}>
        <button className="preset-visual" onClick={() => open(preset.config)} style={{ background: gradientCss(preset.config) }} aria-label={`Open ${preset.name} in Studio`}>
          <span>{String(index + 1).padStart(2, "0")}</span><ArrowUpRight />
        </button>
        <div className="preset-meta">
          <div><h2>{preset.name}</h2><p>{preset.config.type} · {preset.mood}</p></div>
          <div className="preset-actions"><button onClick={() => copy(preset.name, gradientCss(preset.config))} aria-label={`Copy ${preset.name} CSS`}><Copy size={15} /></button><button className={saved.includes(preset.id) ? "saved" : ""} onClick={() => setSaved((list) => list.includes(preset.id) ? list.filter((id) => id !== preset.id) : [...list, preset.id])} aria-label={`${saved.includes(preset.id) ? "Remove" : "Add"} favourite`}><Heart size={15} fill={saved.includes(preset.id) ? "currentColor" : "none"} /></button></div>
        </div>
        <div className="swatch-line">{preset.config.stops.map((stop) => <button key={stop.id} style={{ background: stop.hex }} onClick={() => copy(stop.hex, stop.hex)} aria-label={`Copy ${stop.hex}`} title={stop.hex} />)}</div>
      </article>)}
    </div> : <div className="empty-state"><span>0 results</span><h2>No colours found their way here.</h2><p>Try a broader search or clear the active filter.</p><button onClick={() => { setFilter("all"); setQuery(""); }}>Reset filters</button></div>}
    {limit < items.length && <button className="load-more" onClick={() => setLimit((value) => value + 8)}>Load more systems <span>{Math.min(8, items.length - limit)} remaining</span></button>}
    {copied && <Toast message={`${copied} copied`} />}
  </div>;
}
