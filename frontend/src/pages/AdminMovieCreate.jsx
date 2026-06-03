import React, { useState } from 'react';
import axios from '../api/axios';
import '../styles/AdminForm.css';

const AdminMovieCreate = () => {
  const [formData, setFormData] = useState({ title: '', poster: '', duration: '', language: '' });
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
      setFormData({ title: '', poster: '', duration: '', language: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="animated-bg"></div>
      <div className="admin-form-page">
        <div className="admin-form-inner">
          <h1 className="admin-form-title">🎥 Add Movie</h1>

          {error && <div className="admin-alert error">{error}</div>}
          {success && <div className="admin-alert success">{success}</div>}

          <form onSubmit={handleSubmit} className="admin-form-card">
            <div className="admin-form-group">
              <label className="admin-form-label">Movie Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Poster URL</label>
              <input
                type="url"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                required
                placeholder="https://example.com/poster.jpg"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Duration</label>
              <input
                type="text"
                placeholder="e.g., 2h 30m"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                required
                placeholder="e.g., English, Hindi"
                className="admin-form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-book admin-form-btn">
              {loading ? '⏳ Adding Movie...' : '🎬 Add Movie'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminMovieCreate;
