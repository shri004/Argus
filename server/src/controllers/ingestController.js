import { processDetection } from "../services/detectionService.js";
import { broadcastAlert } from "../websocket/socket.js";

export async function ingestDetection(req, res, next) {
  try {
    const alert = await processDetection(req.body);
    broadcastAlert(alert);
    res.status(201).json(alert);
  } catch (err) {
    next(err);
  }
}
