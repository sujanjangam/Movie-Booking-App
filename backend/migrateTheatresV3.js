import mongoose from "mongoose";
import dotenv from "dotenv";
import Theatre from "./models/Theatre.js";

dotenv.config();

const migrateTheatres = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for migration");

    const theatres = await Theatre.find();
    console.log(`Found ${theatres.length} theatres to migrate`);

    for (const theatre of theatres) {
      // Set default values for new fields
      if (!theatre.city) theatre.city = "Bangalore";
      if (!theatre.state) theatre.state = "Karnataka";
      if (!theatre.address) theatre.address = theatre.location;
      if (!theatre.facilities) theatre.facilities = ["Parking", "Restroom"];
      if (!theatre.cancellationAvailable) theatre.cancellationAvailable = false;
      if (!theatre.foodAndBeverageAvailable) theatre.foodAndBeverageAvailable = false;

      // Update screens with features
      if (theatre.screens && theatre.screens.length > 0) {
        theatre.screens = theatre.screens.map(screen => ({
          ...screen.toObject(),
          features: screen.features || ["Dolby Atmos", "M-Ticket"]
        }));
      }

      await theatre.save();
      console.log(`✓ Migrated: ${theatre.name}`);
    }

    console.log("\n✅ Theatre migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateTheatres();
