import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    default: 50
  },
  screenType: {
    type: String,
    enum: ["2D", "3D", "IMAX", "4DX", "IMAX 3D"],
    default: "2D"
  },
  rows: {
    type: Number,
    default: 5
  },
  seatsPerRow: {
    type: Number,
    default: 10
  },
  features: {
    type: [String],
    enum: ["Dolby Atmos", "Dolby 7.1", "M-Ticket", "Food & Beverage", "Wheelchair Accessible", "Parking"],
    default: []
  }
});

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    required: true,
    default: "Bangalore"
  },
  state: {
    type: String,
    default: "Karnataka"
  },
  pincode: {
    type: String,
    default: ""
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ["SINGLE_SCREEN", "MULTIPLEX"],
    default: "SINGLE_SCREEN"
  },
  screens: [screenSchema],
  facilities: {
    type: [String],
    enum: ["Parking", "Food Court", "Wheelchair Accessible", "Restroom", "ATM", "Lift"],
    default: []
  },
  cancellationAvailable: {
    type: Boolean,
    default: false
  },
  foodAndBeverageAvailable: {
    type: Boolean,
    default: false
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  }
}, { timestamps: true });

// Auto-create default screen for single screen theatres
theatreSchema.pre('save', function(next) {
  if (this.type === 'SINGLE_SCREEN' && this.screens.length === 0) {
    this.screens.push({
      name: 'Screen 1',
      capacity: 50,
      screenType: '2D',
      rows: 5,
      seatsPerRow: 10,
      features: []
    });
  }
  next();
});

// Index for city-based search
theatreSchema.index({ city: 1, name: 1 });
theatreSchema.index({ location: "text", name: "text" });

export default mongoose.model("Theatre", theatreSchema);
