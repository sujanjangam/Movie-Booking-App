import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import SeatGrid from '../components/SeatGrid';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const { data } = await axios.get(`/shows/${showId}`);
        setShow(data);
        setSeats(data.seats);
      } catch (error) {
        console.error('Error fetching show:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [showId]);

  const handleSeatSelect = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat.seatNumber)
        ? prev.filter((s) => s !== seat.seatNumber)
        : [...prev, seat.seatNumber]
    );
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('/bookings', {
        show: showId,
        seats: selectedSeats,
      });
      navigate('/booking');
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="seat-selection-container">
      <h1>Select Seats</h1>
      <div className="screen">SCREEN</div>
      <SeatGrid seats={seats} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
      <div className="booking-summary">
        <p>Selected: {selectedSeats.length} seats</p>
        <p>Total: ₹{selectedSeats.length * show.price}</p>
        <button onClick={handleBooking} disabled={selectedSeats.length === 0}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
