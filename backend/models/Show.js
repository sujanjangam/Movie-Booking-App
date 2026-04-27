import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  number: String,
  status: { type: String, default: "available" }, // available, booked
});

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
  time: String,
  seats: [seatSchema],
});

export default mongoose.model("Show", showSchema);
