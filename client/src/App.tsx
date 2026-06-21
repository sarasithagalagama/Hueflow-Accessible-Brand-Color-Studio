import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppShell } from "./components/AppShell";
import { StudioPage } from "./pages/StudioPage";

const ExplorePage = lazy(() => import("./pages/ExplorePage").then((module) => ({ default: module.ExplorePage })));
const AccessibilityPage = lazy(() => import("./pages/AccessibilityPage").then((module) => ({ default: module.AccessibilityPage })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then((module) => ({ default: module.ProjectsPage })));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage").then((module) => ({ default: module.ProjectDetailPage })));
const AuthPage = lazy(() => import("./pages/AuthPage").then((module) => ({ default: module.AuthPage })));
const SharePage = lazy(() => import("./pages/SharePage").then((module) => ({ default: module.SharePage })));

function PageLoader() {
  return <div className="page-loader"><span /><span /><span /><p>Mixing colour...</p></div>;
}

export function App() {
  return <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/studio" replace />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/share/:slug" element={<SharePage />} />
        <Route path="*" element={<Navigate to="/studio" replace />} />
      </Route>
    </Routes>
  </Suspense>;
}
