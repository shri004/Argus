/**
 * Thin Socket.IO wrapper. initSocket() attaches to the HTTP server;
 * broadcastAlert() is called by the ingestion controller so every
 * connected dashboard gets the alert the instant it's stored --
 * no polling required.
 */
import { Server } from "socket.io";

let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log(`[ws] client connected: ${socket.id}`);
    socket.on("disconnect", () => console.log(`[ws] client disconnected: ${socket.id}`));
  });

  return io;
}

export function broadcastAlert(alert) {
  if (!io) return;
  io.emit("alert:new", alert);
}

export function broadcastIncident(incident) {
  if (!io) return;
  io.emit("incident:update", incident);
}
