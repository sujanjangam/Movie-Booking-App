import mongoose from "mongoose";
import dotenv from "dotenv";
import Show from "./models/Show.js";

dotenv.config();

const migrateShows = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for migration");

    const shows = await Show.find().populate("movie");
    console.log(`Found ${shows.length} shows to migrate`);

    for (const show of shows) {
      // Set default values for new fields
      if (!show.format) show.format = "2D";
      if (!show.language) show.language = show.movie?.language?.[0] || "English";
      if (!show.basePrice) show.basePrice = show.price || 100;
      if (!show.convenienceFee) show.convenienceFee = 20;
      if (!show.gst) show.gst = 18;
      if (!show.isPrimeTime) show.isPrimeTime = false;
      if (!show.primeTimeCharge) show.primeTimeCharge = 0;
      if (!show.status) show.status = "ACTIVE";

      // Calculate available seats
      const availableCount = show.seats.filter(s => s.status === 'available').length;
      show.availableSeats = availableCount;
      show.totalSeats = show.seats.length;

      // Update status based on availability
      if (availableCount === 0) {
        show.status = 'SOLD_OUT';
      } else if (availableCount <= show.totalSeats * 0.2) {
        show.status = 'FAST_FILLING';
      }

      await show.save();
      console.log(`✓ Migrated show: ${show._id}`);
    }

    console.log("\n✅ Show migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateShows();
