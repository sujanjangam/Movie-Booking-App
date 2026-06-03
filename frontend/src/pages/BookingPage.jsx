import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/BookingPage.css';

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/bookings/user');
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
        <div className="booking-page-header">
          <h1 className="booking-page-title">🎫 My Bookings</h1>
          <p className="booking-page-subtitle">View all your movie bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="booking-empty">
            <h3>No bookings yet</h3>
            <p>Book your first movie ticket now!</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, index) => (
              <div
                key={booking._id}
                className={`booking-card delay-${index}`}
              >
                <div className="booking-card-top">
                  <div>
                    <h3 className="booking-movie-title">
                      {booking.show?.movie?.title || 'Movie Title'}
                    </h3>
                    <p className="booking-theatre-name">
                      🏛️ {booking.show?.theatre?.name || 'Theatre'}
                    </p>
                  </div>
                  <div className="booking-status-badge">✓ Confirmed</div>
                </div>

                <div className="booking-details-grid">
                  <div>
                    <p className="booking-detail-label">Date & Time</p>
                    <p className="booking-detail-value">
                      📅 {new Date(booking.show?.date).toLocaleDateString()}
                    </p>
                    <p className="booking-detail-value">🕐 {booking.show?.time}</p>
                  </div>
                  <div>
                    <p className="booking-detail-label">Seats</p>
                    <p className="booking-detail-value">💺 {booking.seats?.join(', ')}</p>
                  </div>
                  <div>
                    <p className="booking-detail-label">Total Amount</p>
                    <p className="booking-detail-value price">₹{booking.totalPrice}</p>
                  </div>
                  <div>
                    <p className="booking-detail-label">Booking ID</p>
                    <p className="booking-detail-value mono">
                      {booking._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="booking-confirm-banner">
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
