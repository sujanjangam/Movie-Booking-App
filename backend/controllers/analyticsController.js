import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    // Total bookings
    const totalBookings = await Booking.countDocuments({ tenantId });

    // Total revenue
    const revenue = await Booking.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Bookings per day (last 7 days)
    const bookingsTrend = await Booking.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    // Top movies by bookings
    const topMovies = await Booking.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
      {
        $lookup: {
          from: "shows",
          localField: "show",
          foreignField: "_id",
          as: "showData",
        },
      },
      { $unwind: "$showData" },
      {
        $lookup: {
          from: "movies",
          localField: "showData.movie",
          foreignField: "_id",
          as: "movieData",
        },
      },
      { $unwind: "$movieData" },
      {
        $group: {
          _id: "$movieData._id",
          title: { $first: "$movieData.title" },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
    ]);

    // Occupancy rate
    const shows = await Show.find({ tenantId });
    let totalSeats = 0;
    let bookedSeats = 0;

    shows.forEach((show) => {
      totalSeats += show.seats.length;
      bookedSeats += show.seats.filter((s) => s.status === "booked").length;
    });

    const occupancyRate = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

    res.json({
      totalBookings,
      revenue: revenue[0]?.total || 0,
      occupancyRate: occupancyRate.toFixed(2),
      bookingsTrend,
      topMovies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
