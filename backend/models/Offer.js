import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ["PERCENTAGE", "FLAT"],
    default: "PERCENTAGE"
  },
  discountValue: {
    type: Number,
    required: true
  },
  maxDiscount: {
    type: Number,
    default: 0
  },
  minBookingAmount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTill: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableOn: {
    type: [String],
    enum: ["MOVIES", "FOOD", "ALL"],
    default: ["ALL"]
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "EXPIRED"],
    default: "ACTIVE"
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  }
}, { timestamps: true });

offerSchema.index({ code: 1, status: 1 });

export default mongoose.model("Offer", offerSchema);
