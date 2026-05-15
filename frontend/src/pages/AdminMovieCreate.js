import React, { useState } from 'react';
import axios from '../api/axios';

const AdminMovieCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    poster: '',
    duration: '',
    language: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
    }
  };

  return (
    <div className="admin-container">
      <h1>Add Movie</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Poster URL</label>
          <input
            type="url"
            value={formData.poster}
            onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            placeholder="e.g., 2h 30m"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Language</label>
          <input
            type="text"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn-primary">Add Movie</button>
      </form>
    </div>
  );
};

export default AdminMovieCreate;
