import { Link } from "react-router-dom";

export function Logo() {
  return <Link to="/studio" className="logo" aria-label="Hueflow Studio">
    <img src="/branding/hueflow-modern-icon.svg" alt="" width="30" height="30" />
    <span>hueflow</span>
  </Link>;
}
