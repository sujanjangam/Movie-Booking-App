import Show from "../models/Show.js";
import Theatre from "../models/Theatre.js";
import Booking from "../models/Booking.js";
import generateSeats from "../utils/generateSeats.js";

export const createShow = async (req, res) => {
  const { movie, theatre, screen, time, date, price } = req.body;

  try {
    // Get theatre to find screen details
    const theatreDoc = await Theatre.findById(theatre);
    if (!theatreDoc) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    // Find the screen
    const screenDoc = theatreDoc.screens.id(screen);
    if (!screenDoc) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    const show = await Show.create({
      movie,
      theatre,
      screen: screenDoc._id,
      screenName: screenDoc.name,
      time,
      date,
      price: price || 100,
      tenantId: req.user.tenantId,
      seats: generateSeats(screenDoc.rows, screenDoc.seatsPerRow, price || 100),
    });

    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({
      movie: req.params.movieId,
      tenantId: req.user.tenantId,
    })
      .populate("theatre")
      .populate("movie");
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("theatre")
      .populate("movie");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({
      tenantId: req.user.tenantId,
    })
      .populate("movie")
      .populate("theatre")
      .sort({ date: 1, time: 1 });
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShowSeats = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // tenant safety
    if (show.tenantId && req.user && show.tenantId.toString() !== req.user.tenantId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ show, seats: show.seats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const lockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const now = new Date();
    let calculatedPrice = 0;

    for (let seat of show.seats) {
      if (seats.includes(seat.number)) {
        if (
          seat.status === "booked" ||
          (seat.status === "locked" && seat.lockExpiry > now)
        ) {
          return res.status(400).json({
            message: `Seat ${seat.number} not available`,
          });
        }

        seat.status = "locked";
        seat.lockedBy = req.user._id;
        seat.lockExpiry = new Date(now.getTime() + 5 * 60 * 1000); // 5 min
        calculatedPrice += seat.price;
      }
    }

    await show.save();

    if (global.io) {
      global.io.to(showId).emit("seatUpdate", show.seats);
    }

    res.json({ message: "Seats locked", totalPrice: calculatedPrice, lockExpiry: new Date(now.getTime() + 5 * 60 * 1000) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const now = new Date();
    let calculatedPrice = 0;

    for (let seat of show.seats) {
      if (seats.includes(seat.number)) {
        if (
          seat.status !== "locked" ||
          seat.lockedBy.toString() !== req.user._id.toString() ||
          seat.lockExpiry < now
        ) {
          return res.status(400).json({
            message: `Seat ${seat.number} lock expired`,
          });
        }

        seat.status = "booked";
        calculatedPrice += seat.price;
        seat.lockedBy = null;
        seat.lockExpiry = null;
      }
    }

    await show.save();

    if (global.io) {
      global.io.to(showId).emit("seatUpdate", show.seats);
    }

    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      totalPrice: calculatedPrice,
      tenantId: req.user.tenantId,
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
