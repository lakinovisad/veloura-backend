import { useState } from "react";
import { login } from "../services/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      window.location.href = "/dashboard";
    } catch (e) {
      alert("Neuspešan login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Lozinka" type="password" />
      <button disabled={loading} type="submit">{loading ? "..." : "Uloguj se"}</button>
    </form>
  );
} 