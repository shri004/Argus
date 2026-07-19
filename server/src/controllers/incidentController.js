import Incident from "../models/Incident.js";
import Alert from "../models/Alert.js";
import { broadcastIncident } from "../websocket/socket.js";

export async function listIncidents(req, res, next) {
  try {
    const { status, severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    const incidents = await Incident.find(filter).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    next(err);
  }
}

export async function getIncident(req, res, next) {
  try {
    const incident = await Incident.findById(req.params.id).populate("alertIds");
    if (!incident) return res.status(404).json({ error: "Incident not found" });
    res.json(incident);
  } catch (err) {
    next(err);
  }
}

export async function createIncident(req, res, next) {
  try {
    const { title, description, severity, alertIds = [] } = req.body;
    const incident = await Incident.create({
      title,
      description,
      severity,
      alertIds,
      timeline: [{ note: "Incident created", actor: req.user?.name || "system" }],
    });

    if (alertIds.length) {
      await Alert.updateMany({ _id: { $in: alertIds } }, { $set: { incidentId: incident._id } });
    }

    broadcastIncident(incident);
    res.status(201).json(incident);
  } catch (err) {
    next(err);
  }
}

export async function updateIncident(req, res, next) {
  try {
    const { status, note, assignedTo } = req.body;
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ error: "Incident not found" });

    if (status) {
      incident.status = status;
      if (status === "resolved" || status === "closed") incident.resolvedAt = new Date();
    }
    if (assignedTo !== undefined) incident.assignedTo = assignedTo;
    if (note) incident.timeline.push({ note, actor: req.user?.name || "system" });

    await incident.save();
    broadcastIncident(incident);
    res.json(incident);
  } catch (err) {
    next(err);
  }
}
