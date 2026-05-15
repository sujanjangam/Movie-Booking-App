import React from "react";
import "../styles/SeatLayout.css";

const SeatLayout = ({ seats, selected, toggleSeat }) => {
  const grouped = {};

  seats.forEach((seat) => {
    const row = seat.number[0];
    if (!grouped[row]) grouped[row] = [];
    grouped[row].push(seat);
  });

  return (
    <div className="theatre-layout">
      <div className="screen">SCREEN</div>

      <div className="seats-container">
        {Object.keys(grouped).sort().map((row) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>

            <div className="seats">
              {grouped[row].map((seat) => (
                <button
                  key={seat.number}
                  onClick={() => toggleSeat(seat)}
                  disabled={seat.status !== "available"}
                  className={`seat ${seat.type?.toLowerCase() || "regular"} ${seat.status} ${
                    selected.includes(seat.number) ? "selected" : ""
                  }`}
                  title={`${seat.number} - ${seat.type || "REGULAR"} - ₹${seat.price || 150}`}
                >
                  {seat.number.slice(1)}
                </button>
              ))}
            </div>

            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-box vip"></span>
          <span>VIP - ₹300</span>
        </div>
        <div className="legend-item">
          <span className="legend-box gold"></span>
          <span>Gold - ₹220</span>
        </div>
        <div className="legend-item">
          <span className="legend-box regular"></span>
          <span>Regular - ₹150</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
