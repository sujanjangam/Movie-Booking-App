import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import '../styles/realtime.css';

const TheatresAdmin = () => {
  const [theatres, setTheatres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showScreenForm, setShowScreenForm] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [loading, setLoading] = useState(false);

  const [theatreForm, setTheatreForm] = useState({
    name: '',
    location: '',
    type: 'SINGLE_SCREEN'
  });

  const [screenForm, setScreenForm] = useState({
    name: '',
    capacity: 50,
    screenType: '2D',
    rows: 5,
    seatsPerRow: 10
  });

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/theatres', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTheatres(data);
    } catch (error) {
      console.error('Error fetching theatres:', error);
    }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/theatres', theatreForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
      const token = localStorage.getItem('token');
      await axios.post(`/theatres/${selectedTheatre._id}/screens`, screenForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '0.5rem'
          }}>
            🏛️ Theatre Management
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Manage theatres and screens
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-book"
          style={{ width: 'auto', marginBottom: '2rem' }}
        >
          {showForm ? '❌ Cancel' : '➕ Add Theatre'}
        </button>

        {showForm && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '2rem' }}>Create New Theatre</h2>
            <form onSubmit={handleCreateTheatre}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Theatre Name
                </label>
                <input
                  type="text"
                  value={theatreForm.name}
                  onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                  required
                  placeholder="e.g., PVR Phoenix"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={theatreForm.location}
                  onChange={(e) => setTheatreForm({ ...theatreForm, location: e.target.value })}
                  required
                  placeholder="e.g., Mumbai, Maharashtra"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Theatre Type
                </label>
                <select
                  value={theatreForm.type}
                  onChange={(e) => setTheatreForm({ ...theatreForm, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="SINGLE_SCREEN">Single Screen (Default Screen 1)</option>
                  <option value="MULTIPLEX">Multiplex (Multiple Screens)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-book"
              >
                {loading ? '⏳ Creating...' : '🎬 Create Theatre'}
              </button>
            </form>
          </div>
        )}

        {showScreenForm && selectedTheatre && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '2rem' }}>
              Add Screen to {selectedTheatre.name}
            </h2>
            <form onSubmit={handleAddScreen}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Screen Name
                </label>
                <input
                  type="text"
                  value={screenForm.name}
                  onChange={(e) => setScreenForm({ ...screenForm, name: e.target.value })}
                  required
                  placeholder="e.g., Screen 2"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                    Rows
                  </label>
                  <input
                    type="number"
                    value={screenForm.rows}
                    onChange={(e) => setScreenForm({ ...screenForm, rows: parseInt(e.target.value) })}
                    min="1"
                    max="26"
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                    Seats Per Row
                  </label>
                  <input
                    type="number"
                    value={screenForm.seatsPerRow}
                    onChange={(e) => setScreenForm({ ...screenForm, seatsPerRow: parseInt(e.target.value) })}
                    min="1"
                    max="30"
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Screen Type
                </label>
                <select
                  value={screenForm.screenType}
                  onChange={(e) => setScreenForm({ ...screenForm, screenType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-book"
                  style={{ flex: 1 }}
                >
                  {loading ? '⏳ Adding...' : '➕ Add Screen'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowScreenForm(false);
                    setSelectedTheatre(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '2rem' }}>
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                    {theatre.name}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                    📍 {theatre.location}
                  </p>
                  <p style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: theatre.type === 'MULTIPLEX' 
                      ? 'rgba(33, 150, 243, 0.2)' 
                      : 'rgba(70, 211, 105, 0.2)',
                    borderRadius: '20px',
                    display: 'inline-block',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}>
                    {theatre.type === 'MULTIPLEX' ? '🎭 Multiplex' : '🎬 Single Screen'}
                  </p>
                </div>

                {theatre.type === 'MULTIPLEX' && (
                  <button
                    onClick={() => {
                      setSelectedTheatre(theatre);
                      setShowScreenForm(true);
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    ➕ Add Screen
                  </button>
                )}
              </div>

              <div>
                <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  📽️ Screens ({theatre.screens?.length || 0})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {theatre.screens?.map((screen) => (
                    <div
                      key={screen._id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <h5 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                        {screen.name}
                      </h5>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
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
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            <h3>No theatres yet</h3>
            <p>Create your first theatre to get started!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TheatresAdmin;
