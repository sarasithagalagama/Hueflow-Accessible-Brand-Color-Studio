import { FolderPlus, Save, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { useStudioStore } from "../../stores/studioStore";

export function SaveToProjectModal({ onClose, onSaved }: { onClose: () => void; onSaved: (message: string) => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const config = useStudioStore((state) => state.config);
  const markSaved = useStudioStore((state) => state.markSaved);
  const [projectId, setProjectId] = useState("");
  const projects = useQuery({ queryKey: ["projects"], queryFn: api.projects, enabled: Boolean(user) });
  const save = useMutation({
    mutationFn: () => api.saveGradient(projectId, { ...config, tags: [] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-gradients", projectId] });
      markSaved();
      onSaved("Gradient saved to project");
      onClose();
    }
  });

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="save-project-modal" role="dialog" aria-modal="true" aria-labelledby="save-project-title">
      <div className="modal-heading"><div><small>SAVE GRADIENT</small><h2 id="save-project-title">Add “{config.name}” to a project</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X /></button></div>
      {!user ? <div className="save-project-content"><p>Sign in to save this gradient to your persistent workspace. Your current draft will remain available.</p><button className="button-primary" onClick={() => navigate("/signin")}>Sign in to continue</button></div>
        : projects.data?.length ? <div className="save-project-content">
          <label><span>Choose a project</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="">Select a project</option>{projects.data.map((project) => <option value={project.id} key={project.id}>{project.name} ({project.gradientCount ?? 0})</option>)}</select></label>
          {save.error && <p className="form-error">{save.error.message}</p>}
          <div className="project-modal-actions"><button onClick={onClose}>Cancel</button><button className="button-primary" disabled={!projectId || save.isPending} onClick={() => save.mutate()}><Save />{save.isPending ? "Saving…" : "Save gradient"}</button></div>
        </div>
        : <div className="save-project-content"><FolderPlus /><p>You do not have a project yet. Create one and the current Studio draft will be attached automatically.</p><button className="button-primary" onClick={() => navigate("/projects")}>Create a project</button></div>}
    </div>
  </div>;
}
