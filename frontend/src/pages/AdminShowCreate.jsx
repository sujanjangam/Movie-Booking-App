import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import '../styles/realtime.css';

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '1rem',
    color: '#111',
    background: '#fff'
  };

  return (
    <>
      <div className="animated-bg"></div>
      <div className="admin-container" style={{
        minHeight: '100vh',
        padding: '4rem 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            🎭 Create Show
          </h1>

          {error && (
            <div style={{
              background: 'rgba(220, 53, 69, 0.2)',
              color: '#ff6b6b',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              border: '1px solid rgba(220, 53, 69, 0.3)'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(70, 211, 105, 0.2)',
              color: 'var(--success)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              border: '1px solid rgba(70, 211, 105, 0.3)'
            }}>
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#222',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Movie</label>
              <select
                value={formData.movie}
                onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
                required
                style={inputStyle}
              >
                <option value="">Select Movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#222',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Theatre</label>
              <select
                value={formData.theatre}
                onChange={(e) => setFormData({ ...formData, theatre: e.target.value })}
                required
                style={inputStyle}
              >
                <option value="">Select Theatre</option>
                {theatres.map((theatre) => (
                  <option key={theatre._id} value={theatre._id}>
                    {theatre.name} - {theatre.location}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#222',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#222',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#222',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                placeholder="100"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-book"
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Creating Show...' : '🎭 Create Show'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminShowCreate;
