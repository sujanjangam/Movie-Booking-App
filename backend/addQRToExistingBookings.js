import mongoose from 'mongoose';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';

dotenv.config();

const addQRToExistingBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const bookings = await Booking.find({ qrCode: { $exists: false } });
    console.log(`Found ${bookings.length} bookings without QR codes`);

    for (const booking of bookings) {
      const qrData = JSON.stringify({
        bookingId: booking._id,
        seats: booking.seats,
        showId: booking.show,
        userId: booking.user
      });
      
      const qrCode = await QRCode.toDataURL(qrData);
      booking.qrCode = qrCode;
      await booking.save();
      console.log(`Added QR code to booking ${booking._id}`);
    }

    console.log('Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addQRToExistingBookings();
