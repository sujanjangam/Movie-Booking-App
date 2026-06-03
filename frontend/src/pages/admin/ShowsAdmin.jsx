import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import '../../styles/realtime.css';
import '../../styles/ShowsAdmin.css';

const ShowsAdmin = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    movie: '', theatre: '', screen: '', date: '', time: '', price: 250
  });

  useEffect(() => {
    fetchShows();
    fetchMovies();
    fetchTheatres();
  }, []);

  const fetchShows = async () => {
    try {
      const { data } = await axios.get('/shows');
      setShows(data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    }
  };

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get('/movies');
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchTheatres = async () => {
    try {
      const { data } = await axios.get('/theatres');
      setTheatres(data);
    } catch (error) {
      console.error('Error fetching theatres:', error);
    }
  };

  const handleTheatreChange = (theatreId) => {
    setFormData({ ...formData, theatre: theatreId, screen: '' });
    const selected = theatres.find(t => t._id === theatreId);
    setScreens(selected?.screens || []);
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/shows', formData);
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
        <div className="admin-page-header">
          <h1 className="admin-page-title">🎬 Show Management</h1>
          <p className="admin-page-subtitle">Create and manage movie shows</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn-book btn-book-auto">
          {showForm ? '❌ Cancel' : '➕ Create Show'}
        </button>

        {showForm && (
          <div className="glass-card">
            <h2 className="glass-card-title">Create New Show</h2>
            <form onSubmit={handleCreateShow}>
              <div className="form-field">
                <label className="form-label">Select Movie</label>
                <select
                  value={formData.movie}
                  onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
                  required
                  className="dark-select"
                >
                  <option value="">Choose a movie</option>
                  {movies.map(movie => (
                    <option key={movie._id} value={movie._id}>{movie.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Select Theatre</label>
                <select
                  value={formData.theatre}
                  onChange={(e) => handleTheatreChange(e.target.value)}
                  required
                  className="dark-select"
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
                <div className="form-field">
                  <label className="form-label">Select Screen</label>
                  <select
                    value={formData.screen}
                    onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
                    required
                    className="dark-select"
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

              <div className="form-grid-2">
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="dark-input"
                  />
                </div>
                <div>
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="dark-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Base Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  required
                  min="50"
                  className="dark-input"
                />
                <p className="form-hint">VIP seats will be 2x, Gold seats will be 1.5x this price</p>
              </div>

              <button type="submit" disabled={loading || !formData.screen} className="btn-book">
                {loading ? '⏳ Creating...' : '🎬 Create Show'}
              </button>
            </form>
          </div>
        )}

        <div className="items-list">
          {shows.map((show) => (
            <div key={show._id} className="item-card">
              <div className="item-card-row">
                <div>
                  <h3 className="item-card-title">{show.movie?.title || 'Movie'}</h3>
                  <p className="item-card-meta">🏛️ {show.theatre?.name || 'Theatre'}</p>
                  <p className="item-card-meta">📽️ {show.screenName || 'Screen'}</p>
                </div>
                <div className="item-card-right">
                  <p className="item-card-detail">📅 {new Date(show.date).toLocaleDateString()}</p>
                  <p className="item-card-detail">🕐 {show.time}</p>
                  <p className="item-card-price">₹{show.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shows.length === 0 && (
          <div className="empty-state">
            <h3>No shows yet</h3>
            <p>Create your first show to get started!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowsAdmin;
