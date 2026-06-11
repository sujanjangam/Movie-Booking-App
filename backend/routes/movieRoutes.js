import express from "express";
import { getMovies, getMovieById, addMovie, searchMovies, getMoviesByStatus, updateMovie, deleteMovie } from "../controllers/movieController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMovies);
router.get("/search", protect, searchMovies);
router.get("/status/:status", protect, getMoviesByStatus);
router.get("/:id", protect, getMovieById);
router.post("/", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), addMovie);
router.put("/:id", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), updateMovie);
router.delete("/:id", protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN"), deleteMovie);

export default router;
