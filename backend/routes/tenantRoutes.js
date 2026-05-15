import express from "express";
import { createTenant, getTenants } from "../controllers/tenantController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("SUPER_ADMIN"), createTenant);
router.get("/", protect, authorizeRoles("SUPER_ADMIN"), getTenants);

export default router;
