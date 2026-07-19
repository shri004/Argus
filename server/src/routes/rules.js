import { Router } from "express";
import { listRules, updateRule } from "../controllers/ruleController.js";

const router = Router();
router.get("/", listRules);
router.patch("/:id", updateRule);
export default router;
