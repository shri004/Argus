import { Router } from "express";
import { getTimeline, getSummary } from "../controllers/analyticsController.js";

const router = Router();
router.get("/timeline", getTimeline);
router.get("/summary", getSummary);
export default router;
