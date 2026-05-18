import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Show from './models/Show.js';

dotenv.config();

const fixSeatPrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const shows = await Show.find({});
    console.log(`Found ${shows.length} shows`);

    let fixedCount = 0;

    for (const show of shows) {
      let needsUpdate = false;
      const basePrice = show.price || 100;

      for (const seat of show.seats) {
        if (!seat.price || isNaN(seat.price)) {
          needsUpdate = true;
          
          // Set price based on seat type
          if (seat.type === 'VIP') {
            seat.price = basePrice * 2;
          } else if (seat.type === 'GOLD') {
            seat.price = Math.floor(basePrice * 1.5);
          } else {
            seat.price = basePrice;
          }
          
          console.log(`Fixed seat ${seat.number} in show ${show._id}: price=${seat.price}`);
        }
      }

      if (needsUpdate) {
        await show.save();
        fixedCount++;
        console.log(`✅ Fixed show ${show._id}`);
      }
    }

    console.log(`\n✅ Migration complete! Fixed ${fixedCount} shows`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

fixSeatPrices();
