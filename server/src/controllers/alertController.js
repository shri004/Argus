import Alert from "../models/Alert.js";

export async function listAlerts(req, res, next) {
  try {
    const { severity, category, status, sourceIp, from, to, page = 1, limit = 25 } = req.query;

    const filter = {};
    if (severity) filter.severity = severity;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (sourceIp) filter.sourceIp = sourceIp;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [alerts, total] = await Promise.all([
      Alert.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Alert.countDocuments(filter),
    ]);

    res.json({ alerts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function getAlert(req, res, next) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    next(err);
  }
}

export async function updateAlertStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ["new", "acknowledged", "resolved", "false_positive"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `status must be one of ${allowed.join(", ")}` });
    }
    const alert = await Alert.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    next(err);
  }
}
