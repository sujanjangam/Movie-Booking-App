import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/realtime.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
    fetchShows();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const { data } = await axios.get(`/movies/${id}`);
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get(`/shows?movie=${id}`);
      setShows(data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupShowsByTheatre = () => {
    const grouped = {};
    shows.forEach(show => {
      const theatreName = show.theatre?.name || 'Unknown Theatre';
      if (!grouped[theatreName]) {
        grouped[theatreName] = [];
      }
      grouped[theatreName].push(show);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const theatreShows = groupShowsByTheatre();

  return (
    <>
      <div className="animated-bg"></div>
      <div className="home-container">
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
            <img
              src={movie?.poster || 'https://via.placeholder.com/300x400'}
              alt={movie?.title}
              style={{
                width: '300px',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)'
              }}
            />
            
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '1rem'
              }}>
                {movie?.title}
              </h1>
              
              <div style={{
                display: 'flex',
                gap: '2rem',
                marginBottom: '2rem',
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <span>⭐ 8.5/10</span>
                <span>🕐 {movie?.duration || '2h 30m'}</span>
                <span>🗣️ {movie?.language || 'English'}</span>
              </div>

              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '2rem'
              }}>
                {movie?.description || 'Experience this amazing movie in theatres near you. Book your tickets now!'}
              </p>

              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(229, 9, 20, 0.2)',
                  borderRadius: '20px',
                  border: '1px solid rgba(229, 9, 20, 0.3)',
                  color: 'white'
                }}>
                  Action
                </span>
                <span style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(229, 9, 20, 0.2)',
                  borderRadius: '20px',
                  border: '1px solid rgba(229, 9, 20, 0.3)',
                  color: 'white'
                }}>
                  Adventure
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '2rem'
          }}>
            🎭 Available Shows
          </h2>

          {Object.keys(theatreShows).length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              <h3>No shows available</h3>
              <p>Check back later for show timings</p>
            </div>
          ) : (
            Object.entries(theatreShows).map(([theatre, theatreShowList]) => (
              <div
                key={theatre}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '1.5rem'
                }}>
                  🏛️ {theatre}
                </h3>
                
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  {theatreShowList.map(show => (
                    <button
                      key={show._id}
                      onClick={() => navigate(`/seat-selection/${show._id}`)}
                      style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.2) 0%, rgba(229, 9, 20, 0.1) 100%)',
                        border: '1px solid rgba(229, 9, 20, 0.3)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(229, 9, 20, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div>{show.time}</div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginTop: '0.3rem'
                      }}>
                        ₹{show.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
