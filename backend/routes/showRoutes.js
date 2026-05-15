import express from "express";
import {
  createShow,
  getShowsByMovie,
  getShowById,
  getAllShows,
  getShowSeats,
  lockSeats,
  confirmBooking,
} from "../controllers/showController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("TENANT_ADMIN"), createShow);

router.get("/", protect, getAllShows);
router.get("/movie/:movieId", protect, getShowsByMovie);
router.get("/:id", protect, getShowById);
router.get("/:id/seats", protect, getShowSeats);

router.post("/lock", protect, authorizeRoles("USER"), lockSeats);
router.post("/book", protect, authorizeRoles("USER"), confirmBooking);

export default router;
