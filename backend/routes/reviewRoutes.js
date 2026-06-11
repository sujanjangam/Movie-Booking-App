import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReview,
  getMovieReviews,
  likeReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/movie/:movieId", getMovieReviews);
router.post("/:reviewId/like", protect, likeReview);

export default router;
