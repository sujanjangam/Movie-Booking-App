import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Offer from "../models/Offer.js";
import QRCode from "qrcode";
import redisClient from "../config/redis.js";

// Lock seat temporarily
export const lockSeat = async (req, res) => {
  try {
    const { showId, seatNumber, userId } = req.body;
    const key = `seat:${showId}:${seatNumber}`;

    const exists = await redisClient.get(key);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Seat already locked"
      });
    }

    await redisClient.set(key, userId, { EX: 300 }); // 5 minutes
    res.json({ success: true, message: "Seat locked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { 
      showId, 
      seats, 
      foodOrders = [],
      offerCode,
      paymentMethod = "UPI"
    } = req.body;

    if (!showId || !seats || seats.length === 0) {
      return res.status(400).json({ message: "Show and seats are required" });
    }

    const show = await Show.findById(showId)
      .populate("movie")
      .populate("theatre");
    if (!show) return res.status(404).json({ message: "Show not found" });

    // Verify Redis seat locks
    for (const seat of seats) {
      const lockKey = `seat:${showId}:${seat}`;
      const lockedBy = await redisClient.get(lockKey);
      if (lockedBy && lockedBy !== req.user._id.toString()) {
        return res.status(400).json({ message: "Seat lock expired or locked by another user" });
      }
    }

    const unavailable = show.seats.filter(
      (s) => seats.includes(s.number) && s.status === "booked"
    );

    if (unavailable.length > 0) {
      return res.status(400).json({ 
        message: "Some seats are already booked",
        unavailableSeats: unavailable.map(s => s.number)
      });
    }

    // Calculate pricing
    const selectedSeats = show.seats.filter(s => seats.includes(s.number));
    const seatType = selectedSeats[0]?.type || "REGULAR";
    const ticketPrice = selectedSeats.reduce((sum, s) => sum + (s.price || show.basePrice), 0);
    const convenienceFee = show.convenienceFee * seats.length;
    let foodAmount = 0;
    
    if (foodOrders.length > 0) {
      foodAmount = foodOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    const subtotal = ticketPrice + convenienceFee + foodAmount;
    const gst = (subtotal * show.gst) / 100;
    
    let discount = 0;
    let appliedOffer = null;

    // Apply offer if provided
    if (offerCode) {
      const offer = await Offer.findOne({
        code: offerCode.toUpperCase(),
        tenantId: req.user.tenantId,
        status: "ACTIVE",
        validFrom: { $lte: new Date() },
        validTill: { $gte: new Date() }
      });

      if (offer && offer.usedCount < offer.usageLimit && subtotal >= offer.minBookingAmount) {
        if (offer.discountType === "PERCENTAGE") {
          discount = (subtotal * offer.discountValue) / 100;
          if (offer.maxDiscount > 0 && discount > offer.maxDiscount) {
            discount = offer.maxDiscount;
          }
        } else {
          discount = offer.discountValue;
        }
        appliedOffer = offerCode;
        
        // Increment offer usage
        offer.usedCount += 1;
        await offer.save();
      }
    }

    const totalPrice = subtotal + gst - discount;

    // Mark seats as booked and remove Redis locks
    show.seats.forEach((s) => {
      if (seats.includes(s.number)) {
        s.status = "booked";
        s.lockedBy = null;
        s.lockExpiry = null;
      }
    });
    await show.save();

    // Remove Redis locks
    for (const seat of seats) {
      await redisClient.del(`seat:${showId}:${seat}`);
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      seatType,
      movie: show.movie._id,
      theatre: show.theatre._id,
      screenName: show.screenName,
      showTime: show.time,
      showDate: show.date,
      ticketPrice,
      convenienceFee,
      foodOrders,
      foodAmount,
      gst,
      discount,
      offerCode: appliedOffer,
      totalPrice,
      paymentMethod,
      paymentStatus: "SUCCESS",
      transactionId: `TXN${Date.now()}`,
      bookingStatus: "CONFIRMED",
      tenantId: req.user.tenantId
    });

    // Generate QR code
    const qrData = JSON.stringify({
      bookingId: booking._id,
      seats: booking.seats,
      showId: booking.show,
      userId: booking.user,
      movie: show.movie.title,
      theatre: show.theatre.name,
      showTime: show.time,
      showDate: show.date
    });
    const qrCode = await QRCode.toDataURL(qrData);
    booking.qrCode = qrCode;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("movie")
      .populate("theatre")
      .populate("show");

    // Emit socket event for real-time seat updates
    if (global.io) {
      global.io.to(showId.toString()).emit("seatUpdate", show.seats);
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("movie")
      .populate("theatre")
      .populate("show")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
      bookingStatus: "CONFIRMED"
    }).populate("show").populate("theatre");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or already cancelled" });
    }

    // Check if theatre allows cancellation
    if (!booking.theatre.cancellationAvailable) {
      return res.status(400).json({ message: "This theatre does not allow cancellations" });
    }

    // Check if show time has passed
    const showDateTime = new Date(`${booking.showDate} ${booking.showTime}`);
    const now = new Date();
    if (showDateTime <= now) {
      return res.status(400).json({ message: "Cannot cancel booking after show time" });
    }

    // Calculate refund (deduct cancellation charges if any)
    const refundAmount = booking.totalPrice * 0.8; // 20% cancellation charge

    // Update booking status
    booking.bookingStatus = "CANCELLED";
    booking.paymentStatus = "REFUNDED";
    booking.cancellationReason = cancellationReason;
    booking.refundAmount = refundAmount;
    await booking.save();

    // Release seats in show
    const show = await Show.findById(booking.show._id);
    if (show) {
      show.seats.forEach(seat => {
        if (booking.seats.includes(seat.number)) {
          seat.status = "available";
        }
      });
      await show.save();

      // Emit socket event
      if (global.io) {
        global.io.to(booking.show._id.toString()).emit("seatUpdate", show.seats);
      }
    }

    res.json({ 
      message: "Booking cancelled successfully",
      refundAmount,
      booking 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate("movie")
      .populate("theatre")
      .populate("show");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
