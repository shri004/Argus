/**
 * Turns a raw detection payload from the Python sensor into a stored
 * Alert. This is where dedup/collapsing lives: if the same source IP
 * triggers the same rule again within COLLAPSE_WINDOW_MS, we bump the
 * occurrence count on the existing alert instead of creating a new
 * document. Without this, a single ongoing port scan would create
 * hundreds of near-identical alert rows -- which is not how any real
 * SIEM behaves, and it's usually the first thing an interviewer asks
 * about ("how do you avoid alert fatigue?").
 */
import Alert from "../models/Alert.js";
import Device from "../models/Device.js";

const COLLAPSE_WINDOW_MS = 60 * 1000;

export async function processDetection(payload) {
  const { ruleName, category, severity, sourceIp, sourcePort, destIp, destPort, protocol, evidence } = payload;

  if (!ruleName || !category || !severity || !sourceIp) {
    const err = new Error("Missing required alert fields");
    err.status = 400;
    throw err;
  }

  const collapseAfter = new Date(Date.now() - COLLAPSE_WINDOW_MS);
  const existing = await Alert.findOne({
    sourceIp,
    category,
    status: "new",
    updatedAt: { $gte: collapseAfter },
  }).sort({ updatedAt: -1 });

  let alert;
  if (existing) {
    existing.occurrenceCount += 1;
    existing.evidence = evidence || existing.evidence;
    existing.updatedAt = new Date();
    alert = await existing.save();
  } else {
    alert = await Alert.create({
      ruleName,
      category,
      severity,
      sourceIp,
      sourcePort,
      destIp,
      destPort,
      protocol,
      evidence,
    });
  }

  // upsert device inventory context for both source and destination
  await touchDevice(sourceIp);
  if (destIp) await touchDevice(destIp, { incrementAlerts: false });
  await Device.updateOne({ ip: sourceIp }, { $inc: { alertCount: 1 } });

  return alert;
}

async function touchDevice(ip) {
  if (!ip) return;
  await Device.updateOne(
    { ip },
    { $set: { lastSeen: new Date() }, $setOnInsert: { firstSeen: new Date() } },
    { upsert: true }
  );
}
