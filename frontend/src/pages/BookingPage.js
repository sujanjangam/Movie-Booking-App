import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const BookingPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="booking-page-container">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h3>{booking.show.movie.title}</h3>
              <p>Theatre: {booking.show.theatre.name}</p>
              <p>Show Time: {new Date(booking.show.showTime).toLocaleString()}</p>
              <p>Seats: {booking.seats.join(', ')}</p>
              <p>Total: ₹{booking.totalPrice}</p>
              <p>Status: {booking.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
