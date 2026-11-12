import express from "express";
import {
  createGatePass,
  ExecutiveApprovedGatePasses,
  ManagerApprovedGatePasses,
} from "../controllers/gatePassController.js";

import { requireAuth, requireRole } from "../middleware/requireAuth.js";

const router = express.Router();

// ✅ Correct routes (no "/gatepass" prefix here)
router.post("/", requireAuth, createGatePass);
router.put("/:id/approve/executive", requireRole("executive", "admin"), ExecutiveApprovedGatePasses);
router.put("/:id/approve/manager", requireRole("manager", "admin"), ManagerApprovedGatePasses);

export default router;
