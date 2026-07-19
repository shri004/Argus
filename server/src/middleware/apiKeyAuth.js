/**
 * Protects the internal ingestion endpoint. Only the Python capture
 * engine (holding the shared secret) may post detections -- this is
 * the boundary that keeps the sensor from needing full user auth
 * while still not being an open write endpoint.
 */
export function apiKeyAuth(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.INGEST_API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  next();
}
