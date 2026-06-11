import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";

dotenv.config();

const migrateMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for migration");

    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies to migrate`);

    for (const movie of movies) {
      // Convert language from string to array if needed
      if (typeof movie.language === 'string') {
        movie.language = [movie.language];
      }

      // Set default values for new fields
      if (!movie.description) movie.description = "Experience this amazing movie in theatres near you!";
      if (!movie.genre || movie.genre.length === 0) movie.genre = ["Drama"];
      if (!movie.rating) movie.rating = 8.0;
      if (!movie.votes) movie.votes = 1000;
      if (!movie.certificate) movie.certificate = "UA";
      if (!movie.releaseDate) movie.releaseDate = new Date();
      if (!movie.format || movie.format.length === 0) movie.format = ["2D"];
      if (!movie.status) movie.status = "NOW_SHOWING";
      if (!movie.cast) movie.cast = [];
      if (!movie.crew) movie.crew = [];

      await movie.save();
      console.log(`✓ Migrated: ${movie.title}`);
    }

    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateMovies();
