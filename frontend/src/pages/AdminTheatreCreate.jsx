import React, { useState } from 'react';
import axios from '../api/axios';
import '../styles/realtime.css';

const AdminTheatreCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: ''
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
      await axios.post('/theatres', formData);
      setSuccess('Theatre added successfully!');
      setFormData({
        name: '',
        location: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add theatre');
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
            🏛️ Add Theatre
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
              }}>Theatre Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., PVR Cinemas"
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
              }}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g., Mumbai, Maharashtra"
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
              {loading ? '⏳ Adding Theatre...' : '🏛️ Add Theatre'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminTheatreCreate;
