import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  poster: {
    type: String,
    default: ""
  },
  banner: {
    type: String,
    default: ""
  },
  trailer: {
    type: String,
    default: ""
  },
  duration: {
    type: String,
    default: "2h 30m"
  },
  language: {
    type: [String],
    default: ["English"]
  },
  genre: {
    type: [String],
    enum: ["Action", "Adventure", "Comedy", "Drama", "Horror", "Thriller", "Romance", "Sci-Fi", "Fantasy", "Animation", "Crime", "Mystery", "Biography", "Musical", "Documentary"],
    default: ["Drama"]
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  votes: {
    type: Number,
    default: 0
  },
  certificate: {
    type: String,
    enum: ["U", "UA", "A", "S"],
    default: "UA"
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  format: {
    type: [String],
    enum: ["2D", "3D", "IMAX", "4DX", "IMAX 3D"],
    default: ["2D"]
  },
  cast: [{
    name: String,
    role: String,
    image: String
  }],
  crew: [{
    name: String,
    role: String,
    image: String
  }],
  status: {
    type: String,
    enum: ["NOW_SHOWING", "COMING_SOON", "ENDED"],
    default: "NOW_SHOWING"
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  }
}, { timestamps: true });

// Index for search and filtering
movieSchema.index({ title: "text", description: "text" });
movieSchema.index({ status: 1, releaseDate: -1 });
movieSchema.index({ genre: 1, language: 1 });

export default mongoose.model("Movie", movieSchema);
