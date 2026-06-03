import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/realtime.css';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [lockExpiry, setLockExpiry] = useState(null);

  useEffect(() => {
    fetchShowDetails();
    const interval = setInterval(fetchShowDetails, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, [showId]);

  useEffect(() => {
    if (lockExpiry) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(lockExpiry).getTime();
        const remaining = Math.floor((expiry - now) / 1000);
        
        if (remaining <= 0) {
          setTimeLeft(0);
          setSelectedSeats([]);
          clearInterval(timer);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [lockExpiry]);

  const fetchShowDetails = async () => {
    try {
      const { data } = await axios.get(`/shows/${showId}/seats`);
      setShow(data.show);
      setSeats(data.seats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching show:', error);
      setLoading(false);
    }
  };

  const handleSeatClick = async (seat) => {
    if (seat.status === 'booked') return;

    const isSelected = selectedSeats.includes(seat.number);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.number));
    } else {
      const newSelected = [...selectedSeats, seat.number];
      setSelectedSeats(newSelected);
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/shows/lock', {
          showId,
          seats: newSelected
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setLockExpiry(response.data.lockExpiry);
        fetchShowDetails();
      } catch (error) {
        console.error('Error locking seats:', error);
        setSelectedSeats(selectedSeats);
        alert(error.response?.data?.message || 'Failed to lock seats');
      }
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      
      await axios.post('/shows/book', {
        showId,
        seats: selectedSeats
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('🎉 Booking Successful!');
      navigate('/booking');
    } catch (error) {
      console.error('Error booking:', error);
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  const groupSeatsByRow = () => {
    const rows = {};
    seats.forEach(seat => {
      const row = seat.number.charAt(0);
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });
    
    // Sort seats within each row
    Object.keys(rows).forEach(row => {
      rows[row].sort((a, b) => {
        const numA = parseInt(a.number.slice(1));
        const numB = parseInt(b.number.slice(1));
        return numA - numB;
      });
    });
    
    return rows;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const seatRows = groupSeatsByRow();
  const totalPrice = selectedSeats.reduce((sum, seatNum) => {
    const seat = seats.find(s => s.number === seatNum);
    return sum + (seat?.price || show?.price || 250);
  }, 0);

  return (
    <>
      <div className="animated-bg"></div>
      <div className="seat-selection-container">
        <div className="show-info">
          <h1 className="show-title">{show?.movie?.title || 'Movie Title'}</h1>
          <div className="show-details">
            <span>🎭 {show?.theatre?.name || 'Theatre'}</span>
            <span>📅 {new Date(show?.date).toLocaleDateString()}</span>
            <span>🕐 {show?.time}</span>
            <span>💰 ₹{show?.price || 250}</span>
          </div>
        </div>

        <div className="screen-container">
          <div className="screen">🎬 SCREEN THIS WAY 🎬</div>
        </div>

        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-box available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box locked"></div>
            <span>Locked</span>
          </div>
          <div className="legend-item">
            <div className="legend-box booked"></div>
            <span>Booked</span>
          </div>
        </div>

        <div className="seats-container">
          {Object.keys(seatRows).sort().map(row => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>
              <div className="seats-row">
                {seatRows[row].map((seat, index) => (
                  <React.Fragment key={seat.number}>
                    {/* Add aisle gap after 5th seat */}
                    {index === 5 && <div className="aisle-gap"></div>}
                    <div
                      className={`seat ${seat.status} ${
                        selectedSeats.includes(seat.number) ? 'selected' : ''
                      }`}
                      onClick={() => handleSeatClick(seat)}
                      title={`Seat ${seat.number} - ${seat.status.toUpperCase()}`}
                    >
                      <span className="seat-number">{seat.number}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <span className="row-label">{row}</span>
            </div>
          ))}
        </div>

        {selectedSeats.length > 0 && (
          <div className="booking-summary success-animation">
            <h3 className="summary-header">🎫 Booking Summary</h3>
            
            {lockExpiry && timeLeft > 0 && (
              <div className="booking-timer">
                <p className="timer-text">
                  ⏰ Time Remaining: {formatTime(timeLeft)}
                </p>
              </div>
            )}

            <div className="summary-details">
              <div className="summary-row">
                <span className="summary-label">Selected Seats:</span>
                <span className="summary-value">{selectedSeats.join(', ')}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Number of Seats:</span>
                <span className="summary-value">{selectedSeats.length}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Price per Seat:</span>
                <span className="summary-value">₹{show?.price || 250}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Total Amount:</span>
                <span className="summary-value summary-total">₹{totalPrice}</span>
              </div>
            </div>

            <button
              className="btn-book"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || timeLeft === 0}
            >
              {timeLeft === 0 ? '⏰ Time Expired' : '🎉 Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SeatSelection;
