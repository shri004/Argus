import { Router } from "express";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";
import { ingestDetection } from "../controllers/ingestController.js";

const router = Router();
router.post("/", apiKeyAuth, ingestDetection);
export default router;
