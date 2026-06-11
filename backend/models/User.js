import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: { 
      type: String, 
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: "Bangalore"
    },
    preferredLanguages: {
      type: [String],
      default: ["English"]
    },
    preferredGenres: {
      type: [String],
      default: []
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "TENANT_ADMIN", "QA_ADMIN", "USER"],
      default: "USER",
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
