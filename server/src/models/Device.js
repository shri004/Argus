import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, unique: true },
    hostname: String,
    mac: String,
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
    alertCount: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);
