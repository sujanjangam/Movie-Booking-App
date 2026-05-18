import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import socket from "../socket";
import SeatLayout from "./SeatLayout";

const SeatGrid = ({ showId, token }) => {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`/shows/${showId}/seats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSeats(res.data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchSeats();

    socket.emit("joinShow", showId);
    socket.on("seatUpdate", (updatedSeats) => {
      setSeats(updatedSeats);
    });

    return () => socket.off("seatUpdate");
  }, [showId, token]);

  const toggleSeat = (seat) => {
    if (seat.status !== "available") return;
    setSelected((prev) =>
      prev.includes(seat.number)
        ? prev.filter((s) => s !== seat.number)
        : [...prev, seat.number]
    );
  };

  const lockSeats = async () => {
    if (selected.length === 0) return alert("Please select seats");
    setLoading(true);
    try {
      await axios.post(
        "/shows/lock",
        { showId, seats: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Seats locked for 5 minutes!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to lock seats");
    } finally {
      setLoading(false);
    }
  };

  const bookSeats = async () => {
    if (selected.length === 0) return alert("Please select seats");
    setLoading(true);
    try {
      await axios.post(
        "/shows/book",
        { showId, seats: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking confirmed!");
      setSelected([]);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to book seats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seat-container">
      <h2>Select Seats</h2>
      <div className="legend">
        <span className="legend-item"><span className="box available"></span> Available</span>
        <span className="legend-item"><span className="box locked"></span> Locked</span>
        <span className="legend-item"><span className="box booked"></span> Booked</span>
        <span className="legend-item"><span className="box selected"></span> Selected</span>
      </div>

      <SeatLayout seats={seats} selected={selected} toggleSeat={toggleSeat} />

      <div className="booking-actions">
        <p>Selected: {selected.join(", ") || "None"}</p>
        <p>Total: ₹{selected.length * 150}</p>
        <button onClick={lockSeats} disabled={loading || selected.length === 0}>
          {loading ? "Processing..." : "Lock Seats"}
        </button>
        <button onClick={bookSeats} disabled={loading || selected.length === 0}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default SeatGrid;
