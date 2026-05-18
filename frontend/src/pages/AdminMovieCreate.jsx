import React, { useState } from 'react';
import axios from '../api/axios';
import '../styles/realtime.css';

const AdminMovieCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    poster: '',
    duration: '',
    language: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/movies', formData);
      setSuccess('Movie added successfully!');
      setFormData({
        title: '',
        poster: '',
        duration: '',
        language: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
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
            🎥 Add Movie
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
              }}>Movie Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: '#111',
                  background: '#fff',
                  transition: 'border 0.3s ease'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#222',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Poster URL</label>
              <input
                type="url"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                required
                placeholder="https://example.com/poster.jpg"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: '#111',
                  background: '#fff'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#222',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Duration</label>
              <input
                type="text"
                placeholder="e.g., 2h 30m"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: '#111',
                  background: '#fff'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#222',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                required
                placeholder="e.g., English, Hindi"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: '#111',
                  background: '#fff'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-book"
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Adding Movie...' : '🎬 Add Movie'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminMovieCreate;
