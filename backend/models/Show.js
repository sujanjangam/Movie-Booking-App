import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  number: String, // A1, A2...
  type: {
    type: String,
    enum: ["REGULAR", "GOLD", "VIP", "PREMIUM", "RECLINER"],
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
      required: true
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true
    },
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    screenName: {
      type: String,
      required: false,
      default: 'Screen 1'
    },
    time: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    format: {
      type: String,
      enum: ["2D", "3D", "IMAX", "4DX", "IMAX 3D"],
      default: "2D"
    },
    language: {
      type: String,
      default: "English"
    },
    price: {
      type: Number,
      default: 100,
    },
    basePrice: {
      type: Number,
      default: 100,
    },
    convenienceFee: {
      type: Number,
      default: 20,
    },
    gst: {
      type: Number,
      default: 18, // percentage
    },
    isPrimeTime: {
      type: Boolean,
      default: false
    },
    primeTimeCharge: {
      type: Number,
      default: 0
    },
    availableSeats: {
      type: Number,
      default: 0
    },
    totalSeats: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "COMPLETED", "FAST_FILLING", "SOLD_OUT"],
      default: "ACTIVE"
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },
    seats: [seatSchema],
  },
  { timestamps: true }
);

// Calculate show status based on seat availability
showSchema.pre('save', function(next) {
  const availableCount = this.seats.filter(s => s.status === 'available').length;
  this.availableSeats = availableCount;
  this.totalSeats = this.seats.length;
  
  if (availableCount === 0) {
    this.status = 'SOLD_OUT';
  } else if (availableCount <= this.totalSeats * 0.2) {
    this.status = 'FAST_FILLING';
  } else if (this.status !== 'CANCELLED' && this.status !== 'COMPLETED') {
    this.status = 'ACTIVE';
  }
  
  next();
});

// Index for efficient queries
showSchema.index({ movie: 1, date: 1, time: 1 });
showSchema.index({ theatre: 1, date: 1 });
showSchema.index({ status: 1 });

export default mongoose.model("Show", showSchema);
