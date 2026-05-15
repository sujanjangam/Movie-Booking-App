import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const createBooking = async (req, res) => {
  try {
    const { showId, seats, totalPrice } = req.body;

    if (!showId || !seats || seats.length === 0) {
      return res.status(400).json({ message: "Show and seats are required" });
    }

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const unavailable = show.seats.filter(
      (s) => seats.includes(s.number) && s.status === "booked"
    );

    if (unavailable.length > 0) {
      return res.status(400).json({ 
        message: "Some seats are already booked",
        unavailableSeats: unavailable.map(s => s.number)
      });
    }

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
      totalPrice: totalPrice || seats.length * show.price,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "show",
        populate: [
          { path: "movie" },
          { path: "theatre" }
        ]
      });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "show",
        populate: [
          { path: "movie" },
          { path: "theatre" }
        ]
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
