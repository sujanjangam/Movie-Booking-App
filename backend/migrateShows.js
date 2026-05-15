import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Show from './models/Show.js';
import Theatre from './models/Theatre.js';

dotenv.config();

const migrateShows = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Get all shows without screen field
    const shows = await Show.find({
      $or: [
        { screen: { $exists: false } },
        { screenName: { $exists: false } }
      ]
    });

    console.log(`Found ${shows.length} shows to migrate`);

    for (const show of shows) {
      // Get the theatre
      const theatre = await Theatre.findById(show.theatre);
      
      if (theatre && theatre.screens && theatre.screens.length > 0) {
        // Use the first screen (default screen)
        const firstScreen = theatre.screens[0];
        
        show.screen = firstScreen._id;
        show.screenName = firstScreen.name;
        
        await show.save();
        console.log(`✅ Updated show ${show._id} with screen ${firstScreen.name}`);
      } else {
        console.log(`⚠️ Theatre ${show.theatre} has no screens, skipping show ${show._id}`);
      }
    }

    console.log('✅ Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateShows();
