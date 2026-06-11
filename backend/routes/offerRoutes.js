import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getActiveOffers,
  validateOffer,
  applyOffer,
  createOffer,
  getAllOffers
} from "../controllers/offerController.js";

const router = express.Router();

router.get("/", protect, getActiveOffers);
router.post("/validate", protect, validateOffer);
router.post("/apply", protect, applyOffer);
router.post("/create", protect, createOffer);
router.get("/all", protect, getAllOffers);

export default router;
