import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@argus.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-0 px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-lg font-semibold tracking-tight">Argus</span>
        </div>
        <h2 className="mb-1">Sign in</h2>
        <p className="text-sm text-text-secondary mb-6">Network intrusion detection & monitoring</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-border-strong"
              required
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-border-strong"
              required
            />
          </div>
          {error && <p className="text-sm text-severity-critical">{error}</p>}
          <button
            type="submit"
            className="mt-2 bg-accent text-black font-medium rounded-lg py-2.5 text-sm hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </form>
        <p className="text-xs text-text-muted mt-6">
          Seed a user with <code className="font-mono">npm run seed</code> or the auth register endpoint.
        </p>
      </div>
    </div>
  );
}
