import { Copy, Edit3, FolderPlus, Globe2, Layers3, Lock, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import type { ProjectSummary } from "@hueflow/shared";
import { gradientCss } from "@hueflow/shared";
import { api } from "../api/client";
import { Meta } from "../components/Meta";
import { Toast } from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { useStudioStore } from "../stores/studioStore";

interface ProjectForm {
  name: string;
  description: string;
  visibility: "private" | "public";
  tags: string;
}

const emptyForm: ProjectForm = { name: "", description: "", visibility: "private", tags: "" };

export function ProjectsPage() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const config = useStudioStore((state) => state.config);
  const markSaved = useStudioStore((state) => state.markSaved);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<ProjectSummary | null>(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const projects = useQuery({ queryKey: ["projects"], queryFn: api.projects, enabled: Boolean(user) });

  const create = useMutation({
    mutationFn: async () => {
      const project = await api.createProject({ ...form, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
      await api.saveGradient(project.id, { ...config, tags: [] });
      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
      setToast("Project created and Studio draft attached");
      markSaved();
    }
  });
  const update = useMutation({
    mutationFn: () => api.updateProject(editing!.id, {
      name: form.name,
      description: form.description,
      visibility: form.visibility,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
      setToast("Project updated");
    }
  });
  const duplicate = useMutation({
    mutationFn: api.duplicateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setToast("Project duplicated");
    }
  });
  const remove = useMutation({
    mutationFn: api.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setToast("Project deleted");
    }
  });

  const closeModal = () => {
    setModal(null);
    setEditing(null);
    setForm(emptyForm);
  };
  const openCreate = () => {
    setForm(emptyForm);
    setModal("create");
  };
  const openEdit = (project: ProjectSummary) => {
    setEditing(project);
    setForm({
      name: project.name,
      description: project.description,
      visibility: project.visibility,
      tags: project.tags.join(", ")
    });
    setModal("edit");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (modal === "create") create.mutate();
    else update.mutate();
  };

  if (isLoading) return <div className="page-loader"><p>Restoring your workspace…</p></div>;
  if (!user) return <Navigate to="/signin" replace />;
  return <div className="content-page projects-page">
    <Meta title="Projects" description="Organise, save and share your Hueflow colour systems." noIndex />
    <header className="projects-header">
      <div><small>YOUR WORKSPACE</small><h1>Good systems<br />deserve a home.</h1><p>Welcome back, {user.name}. Open a saved colour system or attach your current Studio draft to a new project.</p></div>
      <button className="large-primary" onClick={openCreate}><Plus />New project</button>
    </header>
    <div className="project-summary">
      <div><b>{projects.data?.length ?? 0}</b><span>Projects</span></div>
      <div><b>{projects.data?.reduce((total, project) => total + (project.gradientCount ?? 0), 0) ?? 0}</b><span>Saved gradients</span></div>
      <div><b>{projects.data?.filter((project) => project.visibility === "public").length ?? 0}</b><span>Shared publicly</span></div>
    </div>
    {projects.isError && <div className="form-error">{projects.error.message}</div>}
    {projects.isLoading ? <div className="project-grid">{[1, 2, 3].map((item) => <div className="project-skeleton" key={item} />)}</div>
      : projects.data?.length ? <div className="project-grid">{projects.data.map((project, index) => {
        const preview = project.previewGradient;
        return <article className="project-card" key={project.id}>
          <Link className={`project-thumb thumb-${index % 4}`} to={`/projects/${project.id}`} style={preview ? { background: gradientCss(preview) } : undefined}>
            <span>HF / {String(index + 1).padStart(2, "0")}</span>
            <div className="project-palette">{preview?.stops.slice(0, 6).map((stop) => <i style={{ background: stop.hex }} key={stop.id} />)}</div>
          </Link>
          <div className="project-card-body">
            <div className="project-title"><div><Link to={`/projects/${project.id}`}><h2>{project.name}</h2></Link><p>{project.description || "A Hueflow colour system."}</p></div></div>
            <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="project-card-footer">
              <span>{project.visibility === "public" ? <Globe2 /> : <Lock />}{project.visibility}</span>
              <span><Layers3 />{project.gradientCount ?? 0}</span>
              <time>{new Date(project.updatedAt).toLocaleDateString()}</time>
              <button onClick={() => openEdit(project)} aria-label={`Edit ${project.name}`}><Edit3 /></button>
              <button onClick={() => duplicate.mutate(project.id)} aria-label={`Duplicate ${project.name}`}><Copy /></button>
              <button onClick={() => confirm(`Delete “${project.name}”?`) && remove.mutate(project.id)} aria-label={`Delete ${project.name}`}><Trash2 /></button>
            </div>
          </div>
        </article>;
      })}</div>
      : <div className="empty-state project-empty"><FolderPlus /><span>0 PROJECTS</span><h2>Your workspace is beautifully empty.</h2><p>Create a project and we’ll attach the gradient waiting in your Studio.</p><button onClick={openCreate}>Create first project</button></div>}
    {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
      <form className="project-modal" onSubmit={submit}>
        <div><small>{modal === "create" ? "NEW PROJECT" : "EDIT PROJECT"}</small><h2>{modal === "create" ? "Give the system a home." : "Refine the project."}</h2><p>{modal === "create" ? "Your current Studio gradient will be saved inside this project." : "Update its name, description, tags, or sharing state."}</p></div>
        <label><span>Project name</span><input autoFocus required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label><span>Description</span><textarea maxLength={600} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
        <label><span>Tags <small>comma separated</small></span><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} /></label>
        <fieldset><legend>Visibility</legend>
          <label className={form.visibility === "private" ? "selected" : ""}><input type="radio" checked={form.visibility === "private"} onChange={() => setForm({ ...form, visibility: "private" })} /><Lock /><span><b>Private</b><small>Only you can access it</small></span></label>
          <label className={form.visibility === "public" ? "selected" : ""}><input type="radio" checked={form.visibility === "public"} onChange={() => setForm({ ...form, visibility: "public" })} /><Globe2 /><span><b>Public</b><small>Anyone with the link can view it</small></span></label>
        </fieldset>
        {(create.error || update.error) && <p className="form-error">{(create.error ?? update.error)?.message}</p>}
        <div className="project-modal-actions"><button type="button" onClick={closeModal}>Cancel</button><button className="button-primary" disabled={create.isPending || update.isPending}>{modal === "create" ? "Create project" : "Save changes"}</button></div>
      </form>
    </div>}
    {toast && <Toast message={toast} />}
  </div>;
}
