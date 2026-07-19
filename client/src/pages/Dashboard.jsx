import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import TimelineChart from "../components/TimelineChart";
import CategoryDonut from "../components/CategoryDonut";
import AlertTable from "../components/AlertTable";
import api from "../services/api";
import { useAlertsSocket } from "../hooks/useAlertsSocket";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const liveAlerts = useAlertsSocket(10);

  useEffect(() => {
    api.get("/analytics/summary").then((res) => setSummary(res.data));
    api.get("/analytics/timeline").then((res) => setTimeline(res.data));
    api.get("/alerts?limit=8").then((res) => setRecentAlerts(res.data.alerts));
  }, []);

  // merge freshly-pushed alerts on top of the initial page load
  const merged = [...liveAlerts, ...recentAlerts].slice(0, 8);

  return (
    <DashboardLayout title="Dashboard" subtitle="Real-time overview of network security posture">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total alerts" value={summary?.total ?? "—"} />
        <StatCard
          label="Critical"
          value={summary?.bySeverity?.critical ?? 0}
          accent
          sublabel="Requires immediate review"
        />
        <StatCard label="Open incidents" value={summary?.openIncidents ?? 0} />
        <StatCard
          label="Top offender"
          value={summary?.topOffenders?.[0]?.ip ?? "—"}
          sublabel={summary?.topOffenders?.[0] ? `${summary.topOffenders[0].count} alerts` : ""}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimelineChart data={timeline} />
        </div>
        <CategoryDonut byCategory={summary?.byCategory} />
      </div>

      <div>
        <h3 className="mb-3">Recent alerts</h3>
        <AlertTable alerts={merged} />
      </div>
    </DashboardLayout>
  );
}
