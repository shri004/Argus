import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["port_scan", "dos", "icmp_flood", "suspicious_conn"],
      required: true,
      unique: true,
    },
    enabled: { type: Boolean, default: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    description: String,
    mitreTechnique: String,
    thresholds: {
      packetsPerSecond: Number,
      uniquePortsPerWindow: Number,
      windowSeconds: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rule", ruleSchema);
