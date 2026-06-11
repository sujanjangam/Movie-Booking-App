import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  }
}, { timestamps: true });

// Ensure one review per user per movie
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
