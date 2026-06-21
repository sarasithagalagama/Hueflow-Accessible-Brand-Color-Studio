import { ArrowLeft, Copy, ExternalLink, Globe2, Layers3, Lock, Plus, Save, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { gradientCss } from "@hueflow/shared";
import { api } from "../api/client";
import { Meta } from "../components/Meta";
import { Toast } from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { useStudioStore } from "../stores/studioStore";
import { useState } from "react";

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const config = useStudioStore((state) => state.config);
  const loadPreset = useStudioStore((state) => state.loadPreset);
  const markSaved = useStudioStore((state) => state.markSaved);
  const [toast, setToast] = useState("");
  const project = useQuery({ queryKey: ["project", projectId], queryFn: () => api.project(projectId), enabled: Boolean(user && projectId) });
  const gradients = useQuery({ queryKey: ["project-gradients", projectId], queryFn: () => api.projectGradients(projectId), enabled: Boolean(user && projectId) });
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    queryClient.invalidateQueries({ queryKey: ["project-gradients", projectId] });
  };
  const saveCurrent = useMutation({
    mutationFn: () => api.saveGradient(projectId, { ...config, tags: [] }),
    onSuccess: () => {
      invalidate();
      markSaved();
      setToast("Current Studio gradient saved");
    }
  });
  const overwrite = useMutation({
    mutationFn: (gradientId: string) => api.updateGradient(gradientId, { ...config, tags: [] }),
    onSuccess: () => {
      invalidate();
      markSaved();
      setToast("Saved gradient updated from Studio");
    }
  });
  const removeGradient = useMutation({
    mutationFn: api.deleteGradient,
    onSuccess: () => {
      invalidate();
      setToast("Gradient removed");
    }
  });
  const toggleVisibility = useMutation({
    mutationFn: () => api.updateProject(projectId, { visibility: project.data?.visibility === "public" ? "private" : "public" }),
    onSuccess: () => {
      invalidate();
      setToast("Project visibility updated");
    }
  });
  const removeProject = useMutation({
    mutationFn: () => api.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/projects");
    }
  });

  if (authLoading) return <div className="page-loader"><p>Opening project…</p></div>;
  if (!user) return <Navigate to="/signin" replace />;
  if (project.isLoading || gradients.isLoading) return <div className="page-loader"><p>Opening project…</p></div>;
  if (project.isError || !project.data) return <div className="share-error"><h1>Project not found.</h1><Link to="/projects">Return to projects</Link></div>;
  const item = project.data;

  return <div className="content-page project-detail-page">
    <Meta title={item.name} description={item.description || "A saved Hueflow colour project."} noIndex />
    <Link className="back-link" to="/projects"><ArrowLeft />All projects</Link>
    <header className="project-detail-header">
      <div><small>{item.visibility === "public" ? "PUBLIC PROJECT" : "PRIVATE PROJECT"}</small><h1>{item.name}</h1><p>{item.description || "No description yet."}</p><div className="project-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
      <div className="project-detail-actions">
        <button onClick={() => saveCurrent.mutate()} disabled={saveCurrent.isPending}><Plus />Save current Studio gradient</button>
        <button onClick={() => toggleVisibility.mutate()}>{item.visibility === "public" ? <Lock /> : <Globe2 />}{item.visibility === "public" ? "Make private" : "Make public"}</button>
        {item.visibility === "public" && <Link to={`/share/${item.slug}`}><ExternalLink />Open share page</Link>}
        <button className="danger-action" onClick={() => confirm(`Delete “${item.name}” and all saved gradients?`) && removeProject.mutate()}><Trash2 />Delete project</button>
      </div>
    </header>
    <div className="project-detail-summary"><div><b>{gradients.data?.length ?? 0}</b><span>Saved gradients</span></div><div><b>{item.visibility}</b><span>Visibility</span></div><div><b>{new Date(item.updatedAt).toLocaleDateString()}</b><span>Last updated</span></div></div>
    {saveCurrent.error && <p className="form-error">{saveCurrent.error.message}</p>}
    {gradients.data?.length ? <section className="saved-gradient-grid">
      {gradients.data.map((gradient) => <article className="saved-gradient-card" key={gradient.id}>
        <button className="saved-gradient-preview" style={{ background: gradientCss(gradient.config) }} onClick={() => { loadPreset(gradient.config); navigate("/studio"); }} aria-label={`Open ${gradient.name} in Studio`}>
          <span><Layers3 />Open in Studio</span>
        </button>
        <div className="saved-gradient-body">
          <div><h2>{gradient.name}</h2><p>{gradient.config.type} · {gradient.config.stops.length} colours · Updated {new Date(gradient.updatedAt).toLocaleDateString()}</p></div>
          <div className="saved-gradient-swatches">{gradient.config.stops.map((stop) => <i key={stop.id} style={{ background: stop.hex }} title={stop.hex} />)}</div>
          <div className="saved-gradient-actions">
            <button onClick={() => { loadPreset(gradient.config); navigate("/studio"); }}><Copy />Edit in Studio</button>
            <button onClick={() => overwrite.mutate(gradient.id)}><Save />Replace with current draft</button>
            <button onClick={() => confirm(`Delete “${gradient.name}”?`) && removeGradient.mutate(gradient.id)}><Trash2 />Delete</button>
          </div>
        </div>
      </article>)}
    </section> : <div className="empty-state"><Layers3 /><h2>No gradients saved yet.</h2><p>Save the current Studio draft to begin this project.</p><button onClick={() => saveCurrent.mutate()}>Save current gradient</button></div>}
    {toast && <Toast message={toast} />}
  </div>;
}
