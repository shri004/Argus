import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved", "closed"],
      default: "open",
    },
    alertIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alert" }],
    assignedTo: { type: String, default: null },
    timeline: [
      {
        ts: { type: Date, default: Date.now },
        note: String,
        actor: String,
      },
    ],
    resolvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Incident", incidentSchema);
