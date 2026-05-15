import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/realtime.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

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

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="animated-bg"></div>
      <div className="home-container">
        <div className="hero-section">
          <h1 className="hero-title">🎬 Book Your Show</h1>
          <p className="hero-subtitle">Experience cinema like never before</p>
        </div>

        <div className="movies-section">
          <div className="section-header">
            <h2 className="section-title">Now Showing</h2>
          </div>
          
          <div className="movies-grid">
            {movies.map((movie, index) => (
              <div
                key={movie._id}
                className="movie-card"
                onClick={() => navigate(`/movie/${movie._id}`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={movie.poster || 'https://via.placeholder.com/250x350?text=Movie+Poster'}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="movie-rating">8.5</span>
                    <span>{movie.duration || '2h 30m'}</span>
                    <span>{movie.language || 'English'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {movies.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.5)' }}>
              <h3>No movies available</h3>
              <p>Check back soon for new releases!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
