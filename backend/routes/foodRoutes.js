import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getFoodItems,
  getFoodItemsByCategory,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getAllFoodItems
} from "../controllers/foodController.js";

const router = express.Router();

router.get("/", protect, getFoodItems);
router.get("/category/:category", protect, getFoodItemsByCategory);
router.get("/all", protect, getAllFoodItems);
router.post("/", protect, createFoodItem);
router.put("/:id", protect, updateFoodItem);
router.delete("/:id", protect, deleteFoodItem);

export default router;
