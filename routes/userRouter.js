import express from "express";
import {
  createUser,
  loginUser,
  getProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createUser); // register
router.post("/login", loginUser); // login
router.get("/profile", verifyToken, getProfile); // protected route

export default router;
