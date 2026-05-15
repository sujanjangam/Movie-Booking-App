import React, { useState } from 'react';
import axios from '../api/axios';

const AdminTheatreCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/theatres', formData);
      setSuccess('Theatre added successfully!');
      setFormData({
        name: '',
        location: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add theatre');
    }
  };

  return (
    <div className="admin-container">
      <h1>Add Theatre</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Theatre Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn-primary">Add Theatre</button>
      </form>
    </div>
  );
};

export default AdminTheatreCreate;
