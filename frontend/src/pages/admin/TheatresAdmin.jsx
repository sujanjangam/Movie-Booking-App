import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import '../../styles/realtime.css';
import '../../styles/ShowsAdmin.css';
import '../../styles/TheatresAdmin.css';

const TheatresAdmin = () => {
  const [theatres, setTheatres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showScreenForm, setShowScreenForm] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theatreForm, setTheatreForm] = useState({ name: '', location: '', type: 'SINGLE_SCREEN' });
  const [screenForm, setScreenForm] = useState({
    name: '', capacity: 50, screenType: '2D', rows: 5, seatsPerRow: 10
  });

  useEffect(() => { fetchTheatres(); }, []);

  const fetchTheatres = async () => {
    try {
      const { data } = await axios.get('/theatres');
      setTheatres(data);
    } catch (error) {
      console.error('Error fetching theatres:', error);
    }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/theatres', theatreForm);
      alert('✅ Theatre created successfully!');
      setTheatreForm({ name: '', location: '', type: 'SINGLE_SCREEN' });
      setShowForm(false);
      fetchTheatres();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create theatre');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScreen = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/theatres/${selectedTheatre._id}/screens`, screenForm);
      alert('✅ Screen added successfully!');
      setScreenForm({ name: '', capacity: 50, screenType: '2D', rows: 5, seatsPerRow: 10 });
      setShowScreenForm(false);
      setSelectedTheatre(null);
      fetchTheatres();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add screen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="animated-bg"></div>
      <div className="home-container">
        <div className="admin-page-header">
          <h1 className="admin-page-title">🏛️ Theatre Management</h1>
          <p className="admin-page-subtitle">Manage theatres and screens</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn-book btn-book-auto">
          {showForm ? '❌ Cancel' : '➕ Add Theatre'}
        </button>

        {showForm && (
          <div className="glass-card">
            <h2 className="glass-card-title">Create New Theatre</h2>
            <form onSubmit={handleCreateTheatre}>
              <div className="form-field">
                <label className="form-label">Theatre Name</label>
                <input
                  type="text"
                  value={theatreForm.name}
                  onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                  required
                  placeholder="e.g., PVR Phoenix"
                  className="dark-input"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={theatreForm.location}
                  onChange={(e) => setTheatreForm({ ...theatreForm, location: e.target.value })}
                  required
                  placeholder="e.g., Mumbai, Maharashtra"
                  className="dark-input"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Theatre Type</label>
                <select
                  value={theatreForm.type}
                  onChange={(e) => setTheatreForm({ ...theatreForm, type: e.target.value })}
                  className="dark-select"
                >
                  <option value="SINGLE_SCREEN">Single Screen (Default Screen 1)</option>
                  <option value="MULTIPLEX">Multiplex (Multiple Screens)</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="btn-book">
                {loading ? '⏳ Creating...' : '🎬 Create Theatre'}
              </button>
            </form>
          </div>
        )}

        {showScreenForm && selectedTheatre && (
          <div className="glass-card">
            <h2 className="glass-card-title">Add Screen to {selectedTheatre.name}</h2>
            <form onSubmit={handleAddScreen}>
              <div className="form-field">
                <label className="form-label">Screen Name</label>
                <input
                  type="text"
                  value={screenForm.name}
                  onChange={(e) => setScreenForm({ ...screenForm, name: e.target.value })}
                  required
                  placeholder="e.g., Screen 2"
                  className="dark-input"
                />
              </div>
              <div className="form-grid-2">
                <div>
                  <label className="form-label">Rows</label>
                  <input
                    type="number"
                    value={screenForm.rows}
                    onChange={(e) => setScreenForm({ ...screenForm, rows: parseInt(e.target.value) })}
                    min="1" max="26" required
                    className="dark-input"
                  />
                </div>
                <div>
                  <label className="form-label">Seats Per Row</label>
                  <input
                    type="number"
                    value={screenForm.seatsPerRow}
                    onChange={(e) => setScreenForm({ ...screenForm, seatsPerRow: parseInt(e.target.value) })}
                    min="1" max="30" required
                    className="dark-input"
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Screen Type</label>
                <select
                  value={screenForm.screenType}
                  onChange={(e) => setScreenForm({ ...screenForm, screenType: e.target.value })}
                  className="dark-select"
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>
              </div>
              <div className="form-actions-row">
                <button type="submit" disabled={loading} className="btn-book btn-submit-flex">
                  {loading ? '⏳ Adding...' : '➕ Add Screen'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowScreenForm(false); setSelectedTheatre(null); }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-list">
          {theatres.map((theatre) => (
            <div key={theatre._id} className="item-card">
              <div className="item-card-row">
                <div>
                  <h3 className="item-card-title">{theatre.name}</h3>
                  <p className="item-card-meta">📍 {theatre.location}</p>
                  <span className={`theatre-type-badge ${theatre.type === 'MULTIPLEX' ? 'multiplex' : 'single'}`}>
                    {theatre.type === 'MULTIPLEX' ? '🎭 Multiplex' : '🎬 Single Screen'}
                  </span>
                </div>
                {theatre.type === 'MULTIPLEX' && (
                  <button
                    onClick={() => { setSelectedTheatre(theatre); setShowScreenForm(true); }}
                    className="btn-add-screen"
                  >
                    ➕ Add Screen
                  </button>
                )}
              </div>

              <div>
                <h4 className="screens-section-title">📽️ Screens ({theatre.screens?.length || 0})</h4>
                <div className="screens-grid">
                  {theatre.screens?.map((screen) => (
                    <div key={screen._id} className="screen-card">
                      <h5 className="screen-card-title">{screen.name}</h5>
                      <div className="screen-card-info">
                        <p>🎥 {screen.screenType}</p>
                        <p>💺 {screen.capacity} seats</p>
                        <p>📐 {screen.rows} rows × {screen.seatsPerRow} seats</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {theatres.length === 0 && (
          <div className="empty-state">
            <h3>No theatres yet</h3>
            <p>Create your first theatre to get started!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TheatresAdmin;
