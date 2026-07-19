import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function Devices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    api.get("/devices").then((res) => setDevices(res.data));
  }, []);

  return (
    <DashboardLayout title="Devices" subtitle="Hosts observed on the monitored network">
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-muted">
              <th className="font-medium px-5 py-3">IP address</th>
              <th className="font-medium px-5 py-3">Hostname</th>
              <th className="font-medium px-5 py-3">First seen</th>
              <th className="font-medium px-5 py-3">Last seen</th>
              <th className="font-medium px-5 py-3">Alert count</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d._id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 font-mono text-text-secondary">{d.ip}</td>
                <td className="px-5 py-3.5 text-text-secondary">{d.hostname || "—"}</td>
                <td className="px-5 py-3.5 text-text-muted">{new Date(d.firstSeen).toLocaleDateString()}</td>
                <td className="px-5 py-3.5 text-text-muted">{new Date(d.lastSeen).toLocaleString()}</td>
                <td className="px-5 py-3.5 text-text-secondary">{d.alertCount}</td>
              </tr>
            ))}
            {!devices.length && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-text-secondary">
                  No devices observed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
