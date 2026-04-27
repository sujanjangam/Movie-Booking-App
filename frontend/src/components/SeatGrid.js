import React from 'react';

const SeatGrid = ({ seats, selectedSeats, onSeatSelect }) => {
  const handleSeatClick = (seat) => {
    if (seat.status === 'available') {
      onSeatSelect(seat);
    }
  };

  return (
    <div className="seat-grid">
      {seats.map((seat) => (
        <div
          key={seat.seatNumber}
          className={`seat ${seat.status} ${
            selectedSeats.includes(seat.seatNumber) ? 'selected' : ''
          }`}
          onClick={() => handleSeatClick(seat)}
        >
          {seat.seatNumber}
        </div>
      ))}
    </div>
  );
};

export default SeatGrid;
