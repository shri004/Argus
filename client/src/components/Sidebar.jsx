import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/alerts", label: "Alerts" },
  { to: "/incidents", label: "Incidents" },
  { to: "/devices", label: "Devices" },
  { to: "/rules", label: "Rules" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-border h-screen sticky top-0 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-lg font-semibold tracking-tight">Argus</span>
      </div>
      <nav className="flex flex-col gap-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-surface-2 text-text-primary border border-border-strong"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-1"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-2 pt-6 text-xs text-text-muted">
        Argus NIDS &middot; v1.0
      </div>
    </aside>
  );
}
