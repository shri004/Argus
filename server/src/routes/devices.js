import { Router } from "express";
import { listDevices } from "../controllers/deviceController.js";

const router = Router();
router.get("/", listDevices);
export default router;
