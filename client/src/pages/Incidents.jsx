import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SeverityBadge from "../components/SeverityBadge";
import api from "../services/api";

const STATUS_LABEL = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  closed: "Closed",
};

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);

  async function load() {
    const { data } = await api.get("/incidents");
    setIncidents(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    await api.patch(`/incidents/${id}`, { status });
    setIncidents((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
  }

  return (
    <DashboardLayout title="Incidents" subtitle="Correlated alert clusters and case management">
      {!incidents.length ? (
        <div className="card p-10 text-center text-text-secondary">
          No incidents yet. Group related alerts from the Alerts page to open one, or create incidents
          via <code className="font-mono">POST /api/incidents</code>.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {incidents.map((incident) => (
            <div key={incident._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3>{incident.title}</h3>
                    <SeverityBadge severity={incident.severity} />
                  </div>
                  <p className="text-sm text-text-secondary">{incident.description}</p>
                  <p className="text-xs text-text-muted mt-2">
                    {incident.alertIds?.length || 0} linked alerts &middot;{" "}
                    {new Date(incident.createdAt).toLocaleString()}
                  </p>
                </div>
                <select
                  value={incident.status}
                  onChange={(e) => updateStatus(incident._id, e.target.value)}
                  className="bg-surface-2 border border-border rounded-md text-xs px-2 py-1.5 text-text-secondary"
                >
                  {Object.entries(STATUS_LABEL).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
