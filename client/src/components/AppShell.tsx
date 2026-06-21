import { Moon, Sun, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "../hooks/useAuth";

export function AppShell() {
  const [dark, setDark] = useState(() => localStorage.getItem("hueflow-theme") === "dark");
  const { user } = useAuth();
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("hueflow-theme", dark ? "dark" : "light");
  }, [dark]);
  return <div className="app-shell">
    <header className="topbar">
      <Logo />
      <nav aria-label="Main navigation">
        <NavLink to="/studio">Studio</NavLink>
        <NavLink to="/explore">Explore</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/accessibility">Accessibility</NavLink>
      </nav>
      <div className="topbar-actions">
        <button className="icon-button" onClick={() => setDark((value) => !value)} aria-label={`Use ${dark ? "light" : "dark"} theme`}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <NavLink className="account-link" to={user ? "/projects" : "/signin"}><UserRound size={17} />{user?.name ?? "Sign in"}</NavLink>
      </div>
    </header>
    <main><Outlet /></main>
    <footer className="site-footer">
      <p>© 2026 Hueflow. All rights reserved.</p>
      <p>Designed &amp; Developed by <a href="https://www.sarasitha.me/" target="_blank" rel="noreferrer">Sarasitha Galagama</a></p>
    </footer>
  </div>;
}
