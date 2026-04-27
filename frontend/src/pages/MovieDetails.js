import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Loader from '../components/Loader';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          axios.get(`/movies/${id}`),
          axios.get(`/shows/movie/${id}`)
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="movie-details-container">
      <div className="movie-header">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <p>Genre: {movie.genre}</p>
          <p>Duration: {movie.duration} mins</p>
        </div>
      </div>
      <div className="shows-section">
        <h2>Available Shows</h2>
        {shows.map((show) => (
          <div key={show._id} className="show-card" onClick={() => navigate(`/seat-selection/${show._id}`)}>
            <p>{show.theatre.name}</p>
            <p>{new Date(show.showTime).toLocaleString()}</p>
            <p>₹{show.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
