const mongoose = require("mongoose");

const diagnosisLogSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    history: { type: String },
    aiResponse: { type: Object },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    riskFlags: [{ type: String }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("DiagnosisLog", diagnosisLogSchema);
