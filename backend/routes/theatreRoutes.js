import express from "express";
import { getTheatres, createTheatre, addScreen, getTheatreScreens } from "../controllers/theatreController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTheatres);
router.post("/", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), createTheatre);
router.post("/:theatreId/screens", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), addScreen);
router.get("/:theatreId/screens", protect, getTheatreScreens);

export default router;
