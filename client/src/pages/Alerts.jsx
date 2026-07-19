import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AlertTable from "../components/AlertTable";
import api from "../services/api";
import { useAlertsSocket } from "../hooks/useAlertsSocket";

const SEVERITIES = ["", "critical", "high", "medium", "low"];
const CATEGORIES = [
  ["", "All categories"],
  ["port_scan", "Port scan"],
  ["dos", "DoS / high rate"],
  ["icmp_flood", "ICMP flood"],
  ["suspicious_conn", "Suspicious connection"],
];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [sourceIp, setSourceIp] = useState("");
  const liveAlerts = useAlertsSocket(20);

  async function load() {
    const params = {};
    if (severity) params.severity = severity;
    if (category) params.category = category;
    if (sourceIp) params.sourceIp = sourceIp;
    const { data } = await api.get("/alerts", { params });
    setAlerts(data.alerts);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity, category, sourceIp]);

  async function handleStatusChange(id, status) {
    await api.patch(`/alerts/${id}`, { status });
    setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
  }

  const displayed = liveAlerts.length ? [...liveAlerts, ...alerts].slice(0, 100) : alerts;

  return (
    <DashboardLayout title="Alerts" subtitle="Search and triage detections across your network">
      <div className="flex flex-wrap gap-3">
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-text-secondary"
        >
          <option value="">All severities</option>
          {SEVERITIES.filter(Boolean).map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-text-secondary"
        >
          {CATEGORIES.map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
        <input
          placeholder="Filter by source IP"
          value={sourceIp}
          onChange={(e) => setSourceIp(e.target.value)}
          className="bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-text-muted flex-1 min-w-[200px]"
        />
      </div>

      <AlertTable alerts={displayed} onStatusChange={handleStatusChange} />
    </DashboardLayout>
  );
}
