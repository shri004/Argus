import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";

import { connectDB } from "./config/db.js";
import { initSocket } from "./websocket/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";

import ingestRoutes from "./routes/ingest.js";
import alertRoutes from "./routes/alerts.js";
import incidentRoutes from "./routes/incidents.js";
import ruleRoutes from "./routes/rules.js";
import deviceRoutes from "./routes/devices.js";
import analyticsRoutes from "./routes/analytics.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "argus-server" }));

// internal, API-key protected -- called only by the Python capture engine
app.use("/api/internal/ingest", ingestRoutes);

// public/authenticated API surface consumed by the React dashboard
app.use("/api/alerts", alertRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
initSocket(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => console.log(`[server] Argus API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("[server] failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
