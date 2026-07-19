import Alert from "../models/Alert.js";

export async function getTimeline(req, res, next) {
  try {
    const { hours = 24 } = req.query;
    const since = new Date(Date.now() - Number(hours) * 60 * 60 * 1000);

    const buckets = await Alert.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%dT%H:00:00", date: "$createdAt" },
          },
          count: { $sum: 1 },
          critical: { $sum: { $cond: [{ $eq: ["$severity", "critical"] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ["$severity", "high"] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ["$severity", "medium"] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ["$severity", "low"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(buckets.map((b) => ({ time: b._id, ...b, _id: undefined })));
  } catch (err) {
    next(err);
  }
}

export async function getSummary(req, res, next) {
  try {
    const [bySeverity, byCategory, total, topOffenders, openIncidentCount] = await Promise.all([
      Alert.aggregate([{ $group: { _id: "$severity", count: { $sum: 1 } } }]),
      Alert.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
      Alert.countDocuments(),
      Alert.aggregate([
        { $group: { _id: "$sourceIp", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Alert.db.model("Incident").countDocuments({ status: { $in: ["open", "investigating"] } }),
    ]);

    res.json({
      total,
      bySeverity: Object.fromEntries(bySeverity.map((s) => [s._id, s.count])),
      byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
      topOffenders: topOffenders.map((o) => ({ ip: o._id, count: o.count })),
      openIncidents: openIncidentCount,
    });
  } catch (err) {
    next(err);
  }
}
