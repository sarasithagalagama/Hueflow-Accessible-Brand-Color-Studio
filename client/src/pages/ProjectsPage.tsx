import { Copy, FolderPlus, Globe2, Lock, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { Meta } from "../components/Meta";
import { Toast } from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { useStudioStore } from "../stores/studioStore";

export function ProjectsPage() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const config = useStudioStore((state) => state.config);
  const markSaved = useStudioStore((state) => state.markSaved);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", description: "", visibility: "private" as "private" | "public", tags: "" });
  const projects = useQuery({ queryKey: ["projects"], queryFn: api.projects, enabled: Boolean(user) });
  const create = useMutation({
    mutationFn: async () => {
      const project = await api.createProject({ ...form, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
      await api.saveGradient(project.id, { ...config, tags: [] });
      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setModal(false); setToast("Project created and draft attached"); markSaved();
      setForm({ name: "", description: "", visibility: "private", tags: "" });
    }
  });
  const remove = useMutation({
    mutationFn: api.deleteProject,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["projects"] }); setToast("Project deleted"); }
  });
  const submit = (event: FormEvent) => { event.preventDefault(); create.mutate(); };
  if (isLoading) return <div className="page-loader"><p>Restoring your workspace…</p></div>;
  if (!user) return <Navigate to="/signin" replace />;
  return <div className="content-page projects-page">
    <Meta title="Projects" description="Organise, save and share your Hueflow colour systems." noIndex />
    <header className="projects-header"><div><small>YOUR WORKSPACE</small><h1>Good systems<br />deserve a home.</h1><p>Welcome back, {user.name}. Pick up a colour system or attach your current Studio draft to a new project.</p></div><button className="large-primary" onClick={() => setModal(true)}><Plus />New project</button></header>
    <div className="project-summary"><div><b>{projects.data?.length ?? 0}</b><span>Projects</span></div><div><b>{projects.data?.filter((project) => project.visibility === "public").length ?? 0}</b><span>Shared publicly</span></div><div><b>{config.stops.length}</b><span>Colours in current draft</span></div></div>
    {projects.isLoading ? <div className="project-grid">{[1,2,3].map((item) => <div className="project-skeleton" key={item} />)}</div>
      : projects.data?.length ? <div className="project-grid">{projects.data.map((project, index) => <article className="project-card" key={project.id}>
        <div className={`project-thumb thumb-${index % 4}`}><span>HF / {String(index + 1).padStart(2, "0")}</span><div className="project-palette">{config.stops.slice(0, 4).map((stop) => <i style={{ background: stop.hex }} key={stop.id} />)}</div></div>
        <div className="project-card-body"><div className="project-title"><div><h2>{project.name}</h2><p>{project.description || "A Hueflow colour system."}</p></div><button aria-label={`More options for ${project.name}`}><MoreHorizontal /></button></div>
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="project-card-footer"><span>{project.visibility === "public" ? <Globe2 /> : <Lock />}{project.visibility}</span><time>{new Date(project.updatedAt).toLocaleDateString()}</time><button onClick={() => confirm(`Delete “${project.name}”?`) && remove.mutate(project.id)} aria-label={`Delete ${project.name}`}><Trash2 /></button>{project.visibility === "public" && <Link to={`/share/${project.slug}`}><Copy />Share</Link>}</div>
        </div>
      </article>)}</div>
      : <div className="empty-state project-empty"><FolderPlus /><span>0 PROJECTS</span><h2>Your workspace is beautifully empty.</h2><p>Create a project and we’ll attach the gradient waiting in your Studio.</p><button onClick={() => setModal(true)}>Create first project</button></div>}
    {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(false)}><form className="project-modal" onSubmit={submit}>
      <div><small>NEW PROJECT</small><h2>Give the system a home.</h2><p>Your current Studio gradient will be saved inside this project.</p></div>
      <label><span>Project name</span><input autoFocus required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Northline rebrand" /></label>
      <label><span>Description</span><textarea maxLength={600} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="A short note about this colour system" /></label>
      <label><span>Tags <small>comma separated</small></span><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="brand, client, web" /></label>
      <fieldset><legend>Visibility</legend><label className={form.visibility === "private" ? "selected" : ""}><input type="radio" checked={form.visibility === "private"} onChange={() => setForm({ ...form, visibility: "private" })} /><Lock /><span><b>Private</b><small>Only you can access it</small></span></label><label className={form.visibility === "public" ? "selected" : ""}><input type="radio" checked={form.visibility === "public"} onChange={() => setForm({ ...form, visibility: "public" })} /><Globe2 /><span><b>Public</b><small>Anyone with the link can view it</small></span></label></fieldset>
      {create.error && <p className="form-error">{create.error.message}</p>}
      <div className="project-modal-actions"><button type="button" onClick={() => setModal(false)}>Cancel</button><button className="button-primary" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create project"}</button></div>
    </form></div>}
    {toast && <Toast message={toast} />}
  </div>;
}
