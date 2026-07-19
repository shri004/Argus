import { useAuth } from "../context/AuthContext";

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 md:px-8 py-5">
      <div>
        <h1 className="leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Live
        </div>
        {user && (
          <button
            onClick={logout}
            className="text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg px-3 py-1.5 transition-colors"
          >
            {user.name} · Sign out
          </button>
        )}
      </div>
    </header>
  );
}
