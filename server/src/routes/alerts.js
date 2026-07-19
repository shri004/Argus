import { Router } from "express";
import { listAlerts, getAlert, updateAlertStatus } from "../controllers/alertController.js";

const router = Router();
router.get("/", listAlerts);
router.get("/:id", getAlert);
router.patch("/:id", updateAlertStatus);
export default router;
