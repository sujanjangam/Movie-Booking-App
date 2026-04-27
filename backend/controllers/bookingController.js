import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const createBooking = async (req, res) => {
  const { showId, seats, totalPrice } = req.body;

  const show = await Show.findById(showId);

  // Check if seats available
  const unavailable = show.seats.filter(
    (s) => seats.includes(s.number) && s.status === "booked"
  );

  if (unavailable.length > 0) {
    return res.status(400).json({ message: "Seats already booked" });
  }

  // Mark seats booked
  show.seats.forEach((s) => {
    if (seats.includes(s.number)) {
      s.status = "booked";
    }
  });

  await show.save();

  const booking = await Booking.create({
    user: req.user._id,
    show: showId,
    seats,
    totalPrice,
  });

  res.json(booking);
};
