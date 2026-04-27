import Movie from "../models/Movie.js";

export const getMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

export const addMovie = async (req, res) => {
  const movie = await Movie.create(req.body);
  res.json(movie);
};
