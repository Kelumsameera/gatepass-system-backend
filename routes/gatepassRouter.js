import express from "express";
import {
  createGatePass,
  ExecutiveApprovedGatePasses,
  ManagerApprovedGatePasses,
} from "../controllers/gatePassController.js";

const router = express.Router();

// ✅ Correct routes (no "/gatepass" prefix here)
router.post("/", createGatePass);
router.put("/:id/approve/executive", ExecutiveApprovedGatePasses);
router.put("/:id/approve/manager", ManagerApprovedGatePasses);

export default router;
