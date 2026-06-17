import Movie from "../models/Movie.js";
import redisClient from "../config/redis.js";

export const getMovies = async (req, res) => {
  try {
    const { status, genre, language, city } = req.query;
    const cacheKey = `movies:${status || 'all'}:${genre || ''}:${language || ''}:${city || ''}`;

    // Check cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const query = { tenantId: req.user.tenantId };
    if (status) query.status = status;
    if (genre) query.genre = genre;
    if (language) query.language = language;

    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    
    // Cache for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(movies), { EX: 3600 });
    
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
    
    // Clear movie cache
    const keys = await redisClient.keys('movies:*');
    if (keys.length > 0) await redisClient.del(keys);
    
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const tenantId = req.user.tenantId;

    const movies = await Movie.find({
      tenantId,
      $text: { $search: query }
    }).sort({ rating: -1 });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMoviesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const tenantId = req.user.tenantId;

    const movies = await Movie.find({ tenantId, status }).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const movie = await Movie.findOneAndUpdate(
      { _id: id, tenantId },
      req.body,
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Clear movie cache
    const keys = await redisClient.keys('movies:*');
    if (keys.length > 0) await redisClient.del(keys);

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const movie = await Movie.findOneAndDelete({ _id: id, tenantId });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Clear movie cache
    const keys = await redisClient.keys('movies:*');
    if (keys.length > 0) await redisClient.del(keys);

    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
