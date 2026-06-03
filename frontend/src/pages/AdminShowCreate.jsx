import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/AdminForm.css';

const AdminShowCreate = () => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [formData, setFormData] = useState({
    movie: '', theatre: '', date: '', time: '', price: 100
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatresRes] = await Promise.all([
          axios.get('/movies'),
          axios.get('/theatres'),
        ]);
        setMovies(moviesRes.data);
        setTheatres(theatresRes.data);
      } catch {
        setError('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('/shows', formData);
      setSuccess('Show created successfully!');
      setFormData({ movie: '', theatre: '', date: '', time: '', price: 100 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create show');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="animated-bg"></div>
      <div className="admin-form-page">
        <div className="admin-form-inner">
          <h1 className="admin-form-title">🎭 Create Show</h1>

          {error && <div className="admin-alert error">{error}</div>}
          {success && <div className="admin-alert success">{success}</div>}

          <form onSubmit={handleSubmit} className="admin-form-card">
            <div className="admin-form-group">
              <label className="admin-form-label">Movie</label>
              <select
                value={formData.movie}
                onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
                required
                className="admin-form-select"
              >
                <option value="">Select Movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Theatre</label>
              <select
                value={formData.theatre}
                onChange={(e) => setFormData({ ...formData, theatre: e.target.value })}
                required
                className="admin-form-select"
              >
                <option value="">Select Theatre</option>
                {theatres.map((theatre) => (
                  <option key={theatre._id} value={theatre._id}>
                    {theatre.name} - {theatre.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                placeholder="100"
                className="admin-form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-book admin-form-btn">
              {loading ? '⏳ Creating Show...' : '🎭 Create Show'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminShowCreate;
