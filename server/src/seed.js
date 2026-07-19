/**
 * Seeds the four built-in detection rules so the Rules page and the
 * analytics endpoints have something meaningful on first run. Run with:
 *   npm run seed
 */
import "dotenv/config";
import { connectDB } from "./config/db.js";
import Rule from "./models/Rule.js";
import mongoose from "mongoose";

const RULES = [
  {
    name: "Port scan detected",
    category: "port_scan",
    severity: "high",
    description: "Flags a source IP touching an unusual number of distinct ports in a short window.",
    mitreTechnique: "T1046 - Network Service Discovery",
    thresholds: { uniquePortsPerWindow: 15, windowSeconds: 10 },
  },
  {
    name: "High packet rate / possible DoS",
    category: "dos",
    severity: "critical",
    description: "Flags abnormally high packet volume from a single source, indicating a volumetric DoS attempt.",
    mitreTechnique: "T1498 - Network Denial of Service",
    thresholds: { packetsPerSecond: 200, windowSeconds: 5 },
  },
  {
    name: "ICMP flood detected",
    category: "icmp_flood",
    severity: "medium",
    description: "Flags excessive ICMP echo traffic from one source (ping flood / smurf pattern).",
    mitreTechnique: "T1498.001 - Direct Network Flood",
    thresholds: { packetsPerSecond: 50, windowSeconds: 5 },
  },
  {
    name: "Connection to suspicious port",
    category: "suspicious_conn",
    severity: "high",
    description: "Flags traffic on ports commonly associated with malware C2 channels or backdoors.",
    mitreTechnique: "T1571 - Non-Standard Port",
    thresholds: {},
  },
];

async function seed() {
  await connectDB();
  for (const rule of RULES) {
    await Rule.findOneAndUpdate({ category: rule.category }, rule, { upsert: true, new: true });
  }
  console.log(`Seeded ${RULES.length} rules.`);
  await mongoose.disconnect();
}

seed();
