const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "doctor", "receptionist", "patient"],
      required: true,
    },
    subscriptionPlan: { type: String, enum: ["free", "pro"], default: "free" },
    specialization: { type: String },
    age: { type: Number },
    phone: { type: String },
    // Admin controls approval for doctors & receptionists
    doctorApprovalStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    receptionistApprovalStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },

    // Legacy/usage for enabling/disabling user (admin can still toggle)
    isActive: { type: Boolean, default: true },
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
