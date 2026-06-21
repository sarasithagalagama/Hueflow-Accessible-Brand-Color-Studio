import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Meta } from "../components/Meta";
import { useAuth } from "../hooks/useAuth";

export function AuthPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  if (user) return <Navigate to="/projects" replace />;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const mutation = mode === "signin" ? login : register;
    mutation.mutate(form, { onSuccess: () => navigate("/projects") });
  };
  const error = login.error ?? register.error;
  const pending = login.isPending || register.isPending;
  return <div className="auth-page">
    <Meta title={mode === "signin" ? "Sign in" : "Create account"} description="Sign in to save and share your Hueflow colour projects." noIndex />
    <section className="auth-art"><div className="auth-art-copy"><small>YOUR COLOUR WORKSPACE</small><h1>Keep the good<br />ideas moving.</h1><p>Save gradients, organise client systems, and share a clean handoff with your team.</p></div><div className="auth-samples"><span /><span /><span /><span /></div></section>
    <section className="auth-form-wrap"><form onSubmit={submit} className="auth-form">
      <div><small>HUEFLOW ACCOUNT</small><h2>{mode === "signin" ? "Welcome back." : "Make colour useful."}</h2><p>{mode === "signin" ? "Sign in to continue to your projects." : "Your current Studio draft will come with you."}</p></div>
      {mode === "signup" && <label><span>Name</span><input required minLength={2} autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
      <label><span>Email</span><input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
      <label><span>Password</span><div className="password-field"><input required minLength={mode === "signup" ? 8 : 1} type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={`${showPassword ? "Hide" : "Show"} password`}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
      {error && <p className="form-error" role="alert">{error.message}</p>}
      <button className="auth-submit" disabled={pending}>{pending ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}</button>
      <p className="auth-switch">{mode === "signin" ? "New to Hueflow?" : "Already have an account?"} <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p>
    </form></section>
  </div>;
}
