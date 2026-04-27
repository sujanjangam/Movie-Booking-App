import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get('/movies');
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="home-container">
      <h1>Now Showing</h1>
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;
