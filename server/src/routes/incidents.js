import { Router } from "express";
import {
  listIncidents,
  getIncident,
  createIncident,
  updateIncident,
} from "../controllers/incidentController.js";

const router = Router();
router.get("/", listIncidents);
router.get("/:id", getIncident);
router.post("/", createIncident);
router.patch("/:id", updateIncident);
export default router;
