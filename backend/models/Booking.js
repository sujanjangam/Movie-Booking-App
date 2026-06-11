import mongoose from "mongoose";

const foodOrderSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem"
  },
  name: String,
  quantity: Number,
  price: Number
});

const bookingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    show: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Show",
      required: true
    },
    seats: [String],
    seatType: {
      type: String,
      default: "REGULAR"
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie"
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre"
    },
    screenName: String,
    showTime: String,
    showDate: String,
    ticketPrice: {
      type: Number,
      default: 0
    },
    convenienceFee: {
      type: Number,
      default: 0
    },
    foodOrders: [foodOrderSchema],
    foodAmount: {
      type: Number,
      default: 0
    },
    gst: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    offerCode: String,
    totalPrice: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD", "NETBANKING", "WALLET"],
      default: "UPI"
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING"
    },
    transactionId: String,
    bookingStatus: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "EXPIRED"],
      default: "CONFIRMED"
    },
    qrCode: String,
    cancellationReason: String,
    refundAmount: {
      type: Number,
      default: 0
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ show: 1 });
bookingSchema.index({ bookingStatus: 1, paymentStatus: 1 });

export default mongoose.model("Booking", bookingSchema);
