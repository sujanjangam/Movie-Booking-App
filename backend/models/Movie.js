import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  duration: String,
  language: String,
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);
