import Device from "../models/Device.js";

export async function listDevices(req, res, next) {
  try {
    const devices = await Device.find().sort({ lastSeen: -1 });
    res.json(devices);
  } catch (err) {
    next(err);
  }
}
