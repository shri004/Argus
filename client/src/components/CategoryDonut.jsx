import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#7FAE95", "#E8935A", "#D9C15A", "#6B8FA3"];

const CATEGORY_LABEL = {
  port_scan: "Port scan",
  dos: "DoS / high rate",
  icmp_flood: "ICMP flood",
  suspicious_conn: "Suspicious conn.",
};

export default function CategoryDonut({ byCategory = {} }) {
  const data = Object.entries(byCategory).map(([key, value]) => ({
    name: CATEGORY_LABEL[key] || key,
    value,
  }));

  if (!data.length) {
    return (
      <div className="card p-6 flex items-center justify-center text-text-secondary h-64">
        No category data yet
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="mb-4">Alerts by category</h3>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Legend
              formatter={(value) => <span style={{ color: "#a3a29c", fontSize: 12 }}>{value}</span>}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
