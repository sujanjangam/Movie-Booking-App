import express from "express";
import { createBooking, getUserBookings, cancelBooking, getBookingById, lockSeat } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/lock-seat", protect, lockSeat);
router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);

export default router;
