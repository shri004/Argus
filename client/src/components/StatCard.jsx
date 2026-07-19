import { motion } from "framer-motion";

export default function StatCard({ label, value, sublabel, accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-6 flex flex-col gap-2"
    >
      <span className="text-sm text-text-secondary">{label}</span>
      <span className={`text-3xl font-semibold ${accent ? "text-accent" : "text-text-primary"}`}>
        {value}
      </span>
      {sublabel && <span className="text-xs text-text-muted">{sublabel}</span>}
    </motion.div>
  );
}
