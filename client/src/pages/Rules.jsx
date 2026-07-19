import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SeverityBadge from "../components/SeverityBadge";
import api from "../services/api";

export default function Rules() {
  const [rules, setRules] = useState([]);

  async function load() {
    const { data } = await api.get("/rules");
    setRules(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id, enabled) {
    await api.patch(`/rules/${id}`, { enabled: !enabled });
    setRules((prev) => prev.map((r) => (r._id === id ? { ...r, enabled: !enabled } : r)));
  }

  return (
    <DashboardLayout title="Detection rules" subtitle="Tune thresholds without redeploying the sensor">
      <div className="flex flex-col gap-3">
        {rules.map((rule) => (
          <div key={rule._id} className="card p-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3>{rule.name}</h3>
                <SeverityBadge severity={rule.severity} />
              </div>
              <p className="text-sm text-text-secondary max-w-2xl">{rule.description}</p>
              <p className="text-xs text-text-muted mt-2 font-mono">{rule.mitreTechnique}</p>
              {rule.thresholds && Object.keys(rule.thresholds).length > 0 && (
                <div className="flex gap-4 mt-3 text-xs text-text-muted">
                  {Object.entries(rule.thresholds).map(([k, v]) =>
                    v ? (
                      <span key={k}>
                        {k}: <span className="text-text-secondary">{v}</span>
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => toggle(rule._id, rule.enabled)}
              className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                rule.enabled
                  ? "bg-accent-soft text-accent-strong border-accent"
                  : "bg-surface-2 text-text-muted border-border"
              }`}
            >
              {rule.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
        {!rules.length && (
          <div className="card p-10 text-center text-text-secondary">
            No rules found. Run <code className="font-mono">npm run seed</code> in /server.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
