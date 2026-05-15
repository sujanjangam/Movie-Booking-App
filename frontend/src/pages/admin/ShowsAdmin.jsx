import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import '../styles/realtime.css';

const ShowsAdmin = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    movie: '',
    theatre: '',
    screen: '',
    date: '',
    time: '',
    price: 250
  });

  useEffect(() => {
    fetchShows();
    fetchMovies();
    fetchTheatres();
  }, []);

  const fetchShows = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/shows', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShows(data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    }
  };

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/movies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

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

  const handleTheatreChange = (theatreId) => {
    setFormData({ ...formData, theatre: theatreId, screen: '' });
    const selectedTheatre = theatres.find(t => t._id === theatreId);
    setScreens(selectedTheatre?.screens || []);
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/shows', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Show created successfully!');
      setFormData({ movie: '', theatre: '', screen: '', date: '', time: '', price: 250 });
      setShowForm(false);
      setScreens([]);
      fetchShows();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create show');
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
            🎬 Show Management
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Create and manage movie shows
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-book"
          style={{ width: 'auto', marginBottom: '2rem' }}
        >
          {showForm ? '❌ Cancel' : '➕ Create Show'}
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
            <h2 style={{ color: 'white', marginBottom: '2rem' }}>Create New Show</h2>
            <form onSubmit={handleCreateShow}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Select Movie
                </label>
                <select
                  value={formData.movie}
                  onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
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
                >
                  <option value="">Choose a movie</option>
                  {movies.map(movie => (
                    <option key={movie._id} value={movie._id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Select Theatre
                </label>
                <select
                  value={formData.theatre}
                  onChange={(e) => handleTheatreChange(e.target.value)}
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
                >
                  <option value="">Choose a theatre</option>
                  {theatres.map(theatre => (
                    <option key={theatre._id} value={theatre._id}>
                      {theatre.name} - {theatre.location}
                    </option>
                  ))}
                </select>
              </div>

              {formData.theatre && screens.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                    Select Screen
                  </label>
                  <select
                    value={formData.screen}
                    onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
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
                  >
                    <option value="">Choose a screen</option>
                    {screens.map(screen => (
                      <option key={screen._id} value={screen._id}>
                        {screen.name} ({screen.screenType}) - {screen.capacity} seats
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  required
                  min="50"
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
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  VIP seats will be 2x, Gold seats will be 1.5x this price
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.screen}
                className="btn-book"
              >
                {loading ? '⏳ Creating...' : '🎬 Create Show'}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '2rem' }}>
          {shows.map((show) => (
            <div
              key={show._id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                    {show.movie?.title || 'Movie'}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    🏛️ {show.theatre?.name || 'Theatre'}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
                    📽️ {show.screenName || 'Screen'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>
                    📅 {new Date(show.date).toLocaleDateString()}
                  </p>
                  <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>
                    🕐 {show.time}
                  </p>
                  <p style={{ color: 'var(--primary)', fontSize: '1.3rem', fontWeight: '700', marginTop: '0.5rem' }}>
                    ₹{show.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shows.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            <h3>No shows yet</h3>
            <p>Create your first show to get started!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowsAdmin;
