import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getActiveOffers,
  validateOffer,
  applyOffer,
  createOffer,
  getAllOffers,
  updateOffer,
  deleteOffer
} from "../controllers/offerController.js";

const router = express.Router();

router.get("/", protect, getActiveOffers);
router.post("/validate", protect, validateOffer);
router.post("/apply", protect, applyOffer);
router.post("/create", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), createOffer);
router.get("/all", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), getAllOffers);
router.put("/:id", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), updateOffer);
router.delete("/:id", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), deleteOffer);

export default router;
