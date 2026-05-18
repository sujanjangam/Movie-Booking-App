import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/realtime.css';

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

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
            🎫 My Bookings
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            View all your movie bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>No bookings yet</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Book your first movie ticket now!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {bookings.map((booking, index) => (
              <div
                key={booking._id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '0.5rem'
                    }}>
                      {booking.show?.movie?.title || 'Movie Title'}
                    </h3>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1.1rem'
                    }}>
                      🏛️ {booking.show?.theatre?.name || 'Theatre'}
                    </p>
                  </div>
                  
                  <div style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, var(--success) 0%, #2ecc71 100%)',
                    borderRadius: '20px',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    ✓ Confirmed
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      marginBottom: '0.3rem'
                    }}>
                      Date & Time
                    </p>
                    <p style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>
                      📅 {new Date(booking.show?.date).toLocaleDateString()}
                    </p>
                    <p style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>
                      🕐 {booking.show?.time}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      marginBottom: '0.3rem'
                    }}>
                      Seats
                    </p>
                    <p style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>
                      💺 {booking.seats?.join(', ')}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      marginBottom: '0.3rem'
                    }}>
                      Total Amount
                    </p>
                    <p style={{
                      color: 'var(--primary)',
                      fontWeight: '700',
                      fontSize: '1.5rem'
                    }}>
                      ₹{booking.totalPrice}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      marginBottom: '0.3rem'
                    }}>
                      Booking ID
                    </p>
                    <p style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}>
                      {booking._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'rgba(70, 211, 105, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(70, 211, 105, 0.3)',
                  color: 'var(--success)',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}>
                  🎉 Booking confirmed! Show this at the theatre entrance
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BookingPage;
