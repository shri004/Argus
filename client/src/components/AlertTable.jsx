import SeverityBadge from "./SeverityBadge";

const CATEGORY_LABEL = {
  port_scan: "Port scan",
  dos: "DoS / high rate",
  icmp_flood: "ICMP flood",
  suspicious_conn: "Suspicious connection",
};

export default function AlertTable({ alerts, onStatusChange }) {
  if (!alerts?.length) {
    return (
      <div className="card p-10 text-center text-text-secondary">
        No alerts match the current filters.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-text-muted">
            <th className="font-medium px-5 py-3">Severity</th>
            <th className="font-medium px-5 py-3">Rule</th>
            <th className="font-medium px-5 py-3">Source</th>
            <th className="font-medium px-5 py-3">Destination</th>
            <th className="font-medium px-5 py-3">Occurrences</th>
            <th className="font-medium px-5 py-3">Time</th>
            <th className="font-medium px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a._id} className="border-b border-border last:border-0 hover:bg-surface-2/60 transition-colors">
              <td className="px-5 py-3.5">
                <SeverityBadge severity={a.severity} />
              </td>
              <td className="px-5 py-3.5">
                <div className="text-text-primary">{a.ruleName}</div>
                <div className="text-xs text-text-muted">{CATEGORY_LABEL[a.category] || a.category}</div>
              </td>
              <td className="px-5 py-3.5 font-mono text-text-secondary">
                {a.sourceIp}
                {a.sourcePort ? `:${a.sourcePort}` : ""}
              </td>
              <td className="px-5 py-3.5 font-mono text-text-secondary">
                {a.destIp || "—"}
                {a.destPort ? `:${a.destPort}` : ""}
              </td>
              <td className="px-5 py-3.5 text-text-secondary">{a.occurrenceCount || 1}</td>
              <td className="px-5 py-3.5 text-text-muted">
                {new Date(a.createdAt).toLocaleString()}
              </td>
              <td className="px-5 py-3.5">
                <select
                  value={a.status}
                  onChange={(e) => onStatusChange?.(a._id, e.target.value)}
                  className="bg-surface-2 border border-border rounded-md text-xs px-2 py-1.5 text-text-secondary focus:text-text-primary"
                >
                  <option value="new">New</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="resolved">Resolved</option>
                  <option value="false_positive">False positive</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
