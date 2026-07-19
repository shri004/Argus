import Rule from "../models/Rule.js";

export async function listRules(req, res, next) {
  try {
    const rules = await Rule.find().sort({ category: 1 });
    res.json(rules);
  } catch (err) {
    next(err);
  }
}

export async function updateRule(req, res, next) {
  try {
    const { enabled, severity, thresholds } = req.body;
    const update = {};
    if (enabled !== undefined) update.enabled = enabled;
    if (severity) update.severity = severity;
    if (thresholds) update.thresholds = thresholds;

    const rule = await Rule.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json(rule);
  } catch (err) {
    next(err);
  }
}
