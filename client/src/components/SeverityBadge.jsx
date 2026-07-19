const STYLES = {
  critical: "bg-[rgba(229,72,77,0.12)] text-severity-critical border-[rgba(229,72,77,0.3)]",
  high: "bg-[rgba(232,147,90,0.12)] text-severity-high border-[rgba(232,147,90,0.3)]",
  medium: "bg-[rgba(217,193,90,0.12)] text-severity-medium border-[rgba(217,193,90,0.3)]",
  low: "bg-[rgba(107,143,163,0.12)] text-severity-low border-[rgba(107,143,163,0.3)]",
};

export default function SeverityBadge({ severity }) {
  const style = STYLES[severity] || STYLES.low;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium capitalize ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {severity}
    </span>
  );
}
