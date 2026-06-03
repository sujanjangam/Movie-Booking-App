import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
    fetchShows();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const { data } = await axios.get(`/movies/${id}`);
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get(`/shows/movie/${id}`);
      setShows(data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupShowsByTheatre = () => {
    const grouped = {};
    shows.forEach(show => {
      const theatreName = show.theatre?.name || 'Unknown Theatre';
      if (!grouped[theatreName]) grouped[theatreName] = [];
      grouped[theatreName].push(show);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const theatreShows = groupShowsByTheatre();

  return (
    <>
      <div className="animated-bg"></div>
      <div className="home-container">
        <div className="movie-details-card">
          <div className="movie-details-body">
            <img
              src={movie?.poster || 'https://via.placeholder.com/300x400'}
              alt={movie?.title}
              className="movie-details-poster"
            />
            <div className="movie-details-info">
              <h1 className="movie-details-title">{movie?.title}</h1>
              <div className="movie-details-meta">
                <span>⭐ 8.5/10</span>
                <span>🕐 {movie?.duration || '2h 30m'}</span>
                <span>🗣️ {movie?.language || 'English'}</span>
              </div>
              <p className="movie-details-description">
                {movie?.description || 'Experience this amazing movie in theatres near you. Book your tickets now!'}
              </p>
              <div className="movie-details-genres">
                <span className="genre-tag">Action</span>
                <span className="genre-tag">Adventure</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="shows-section-title">🎭 Available Shows</h2>

          {Object.keys(theatreShows).length === 0 ? (
            <div className="no-shows-placeholder">
              <h3>No shows available</h3>
              <p>Check back later for show timings</p>
            </div>
          ) : (
            Object.entries(theatreShows).map(([theatre, theatreShowList]) => (
              <div key={theatre} className="theatre-shows-card">
                <h3 className="theatre-shows-name">🏛️ {theatre}</h3>
                <div className="show-times-row">
                  {theatreShowList.map(show => (
                    <button
                      key={show._id}
                      onClick={() => navigate(`/seat-selection/${show._id}`)}
                      className="show-time-btn"
                    >
                      <div>{show.time}</div>
                      <div className="show-time-price">₹{show.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
