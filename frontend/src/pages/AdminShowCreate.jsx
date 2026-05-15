import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const AdminShowCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [formData, setFormData] = useState({
    movie: '',
    theatre: '',
    date: '',
    time: '',
    price: 100
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesRes, theatresRes] = await Promise.all([
        axios.get('/movies'),
        axios.get('/theatres')
      ]);
      setMovies(moviesRes.data);
      setTheatres(theatresRes.data);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/shows', formData);
      setSuccess('Show created successfully!');
      setFormData({
        movie: '',
        theatre: '',
        date: '',
        time: '',
        price: 100
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create show');
    }
  };

  return (
    <div className="admin-container">
      <h1>Create Show</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Movie</label>
          <select
            value={formData.movie}
            onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
            required
          >
            <option value="">Select Movie</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Theatre</label>
          <select
            value={formData.theatre}
            onChange={(e) => setFormData({ ...formData, theatre: e.target.value })}
            required
          >
            <option value="">Select Theatre</option>
            {theatres.map((theatre) => (
              <option key={theatre._id} value={theatre._id}>
                {theatre.name} - {theatre.location}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
          />
        </div>

        <button type="submit" className="btn-primary">Create Show</button>
      </form>
    </div>
  );
};

export default AdminShowCreate;
