import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    enum: ["POPCORN", "BEVERAGE", "COMBO", "SNACKS", "MEALS"],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    enum: ["SMALL", "MEDIUM", "LARGE", "XL", "NA"],
    default: "NA"
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  available: {
    type: Boolean,
    default: true
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre"
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  }
}, { timestamps: true });

foodItemSchema.index({ category: 1, available: 1 });

export default mongoose.model("FoodItem", foodItemSchema);
