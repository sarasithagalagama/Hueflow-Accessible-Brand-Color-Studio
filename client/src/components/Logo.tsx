import { Link } from "react-router-dom";

export function Logo() {
  return <Link to="/studio" className="logo" aria-label="Hueflow Studio">
    <span className="logo-mark">H<span /></span>
    <span>Hueflow</span>
  </Link>;
}
