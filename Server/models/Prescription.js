const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
});

const prescriptionSchema = new mongoose.Schema(
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
    medicines: [medicineSchema],
    diagnosisNotes: { type: String },
    instructions: { type: String },
    followUpDate: { type: String },
    aiExplanation: { type: String },
    aiExplanationUrdu: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
