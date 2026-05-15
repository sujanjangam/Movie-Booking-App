import Movie from "../models/Movie.js";

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      tenantId: req.user.tenantId,
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMovie = async (req, res) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      tenantId: req.user.tenantId,
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
