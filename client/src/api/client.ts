import type { ApiResponse, ProjectSummary, UserSummary } from "@hueflow/shared";

const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options
    });
  } catch {
    throw new Error("The Hueflow API is unavailable. Start the server and try again.");
  }

  const text = await response.text();
  let payload: ApiResponse<T>;
  try {
    payload = text ? JSON.parse(text) as ApiResponse<T> : {
      success: false,
      message: response.ok
        ? "The server returned an empty response."
        : "The Hueflow API is unavailable. Start the server and try again."
    };
  } catch {
    throw new Error("The server returned an invalid response. Please try again.");
  }

  if (!response.ok || !payload.success) throw new Error(payload.message || "Something went wrong");
  return payload.data as T;
}

export const api = {
  me: () => request<UserSummary | null>("/auth/me"),
  login: (body: { email: string; password: string }) => request<UserSummary>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body: { name: string; email: string; password: string }) => request<UserSummary>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request<null>("/auth/logout", { method: "POST" }),
  projects: () => request<ProjectSummary[]>("/projects"),
  createProject: (body: { name: string; description: string; visibility: "private" | "public"; tags: string[] }) =>
    request<ProjectSummary>("/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject: (id: string, body: Partial<ProjectSummary>) =>
    request<ProjectSummary>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteProject: (id: string) => request<null>(`/projects/${id}`, { method: "DELETE" }),
  saveGradient: (projectId: string, body: unknown) =>
    request(`/projects/${projectId}/gradients`, { method: "POST", body: JSON.stringify(body) }),
  share: (slug: string) => request<SharedProject>(`/share/${slug}`)
};

export interface SharedProject {
  project: ProjectSummary & { creator: string };
  gradients: Array<{ id: string; name: string; config: import("@hueflow/shared").GradientConfig }>;
}
