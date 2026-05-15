import express from "express";
import { getMovies, getMovieById, addMovie } from "../controllers/movieController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMovies);
router.get("/:id", protect, getMovieById);
router.post("/", protect, authorizeRoles("TENANT_ADMIN"), addMovie);

export default router;
