import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    ruleName: { type: String, required: true },
    category: {
      type: String,
      enum: ["port_scan", "dos", "icmp_flood", "suspicious_conn"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    sourceIp: { type: String, required: true, index: true },
    sourcePort: Number,
    destIp: { type: String, index: true },
    destPort: Number,
    protocol: String,
    evidence: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["new", "acknowledged", "resolved", "false_positive"],
      default: "new",
    },
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: "Incident", default: null },
    occurrenceCount: { type: Number, default: 1 },
    geo: {
      country: String,
      city: String,
    },
  },
  { timestamps: true }
);

alertSchema.index({ createdAt: -1 });
alertSchema.index({ sourceIp: 1, category: 1, createdAt: -1 });

export default mongoose.model("Alert", alertSchema);
