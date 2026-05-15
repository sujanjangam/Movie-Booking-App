import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  number: String, // A1, A2...
  type: {
    type: String,
    enum: ["REGULAR", "GOLD", "VIP"],
    default: "REGULAR",
  },
  price: Number,
  status: {
    type: String,
    enum: ["available", "locked", "booked"],
    default: "available",
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lockExpiry: Date,
});

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
    },
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      required: false  // Changed to false for backward compatibility
    },
    screenName: {
      type: String,
      required: false,  // Changed to false for backward compatibility
      default: 'Screen 1'
    },
    time: String,
    date: String,
    price: {
      type: Number,
      default: 100,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },

    seats: [seatSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Show", showSchema);
