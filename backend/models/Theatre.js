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
    enum: ["2D", "3D", "IMAX", "4DX"],
    default: "2D"
  },
  rows: {
    type: Number,
    default: 5
  },
  seatsPerRow: {
    type: Number,
    default: 10
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
  type: {
    type: String,
    enum: ["SINGLE_SCREEN", "MULTIPLEX"],
    default: "SINGLE_SCREEN"
  },
  screens: [screenSchema],
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
      seatsPerRow: 10
    });
  }
  next();
});

export default mongoose.model("Theatre", theatreSchema);
