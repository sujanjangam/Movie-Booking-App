import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Theatre from './models/Theatre.js';

dotenv.config();

const migrateTheatres = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Get all theatres without screens
    const theatres = await Theatre.find({
      $or: [
        { screens: { $exists: false } },
        { screens: { $size: 0 } },
        { type: { $exists: false } }
      ]
    });

    console.log(`Found ${theatres.length} theatres to migrate`);

    for (const theatre of theatres) {
      // Set type if not exists
      if (!theatre.type) {
        theatre.type = 'SINGLE_SCREEN';
      }

      // Add default screen if no screens exist
      if (!theatre.screens || theatre.screens.length === 0) {
        theatre.screens = [{
          name: 'Screen 1',
          capacity: 50,
          screenType: '2D',
          rows: 5,
          seatsPerRow: 10
        }];
      }

      await theatre.save();
      console.log(`✅ Updated theatre ${theatre.name} with default screen`);
    }

    console.log('✅ Theatre migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateTheatres();
