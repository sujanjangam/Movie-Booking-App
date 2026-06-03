import React, { useState } from 'react';
import axios from '../api/axios';
import '../styles/AdminForm.css';

const AdminTheatreCreate = () => {
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('/theatres', formData);
      setSuccess('Theatre added successfully!');
      setFormData({ name: '', location: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add theatre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="animated-bg"></div>
      <div className="admin-form-page">
        <div className="admin-form-inner">
          <h1 className="admin-form-title">🏛️ Add Theatre</h1>

          {error && <div className="admin-alert error">{error}</div>}
          {success && <div className="admin-alert success">{success}</div>}

          <form onSubmit={handleSubmit} className="admin-form-card">
            <div className="admin-form-group">
              <label className="admin-form-label">Theatre Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., PVR Cinemas"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g., Mumbai, Maharashtra"
                className="admin-form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-book admin-form-btn">
              {loading ? '⏳ Adding Theatre...' : '🏛️ Add Theatre'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminTheatreCreate;
