import express from "express";
import { getDashboardStats } from "../controllers/analyticsController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), getDashboardStats);

export default router;
