import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TimelineChart({ data }) {
  return (
    <div className="card p-6">
      <h3 className="mb-4">Alert timeline</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="accentFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7FAE95" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7FAE95" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#6b6a65", fontSize: 11 }}
              tickFormatter={(t) => new Date(t).getHours() + ":00"}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
            />
            <YAxis tick={{ fill: "#6b6a65", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ color: "#a3a29c" }}
            />
            <Area type="monotone" dataKey="count" stroke="#7FAE95" fill="url(#accentFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
