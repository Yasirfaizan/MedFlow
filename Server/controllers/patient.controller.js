const Patient = require("../models/Patient");
const { success, error } = require("../utils/response");

exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, phone } = req.body;
    if (!name || !age || !gender || !phone)
      return error(res, "Missing required patient fields", 400);
    if (req.user.subscriptionPlan === "free") {
      // Spec: limit per clinic
      const clinicId = req.user.clinicId;
      const count = await Patient.countDocuments({ clinicId });
      if (count >= 20) {
        return error(
          res,
          "Free plan limit of 20 patients reached. Upgrade to Pro.",
          403,
        );
      }
    }
    const patient = await Patient.create({
      ...req.body,
      createdBy: req.user.userId,
      clinicId: req.user.clinicId,
    });
    return success(res, patient, "Patient registered", 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const filter = {};
    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    return success(res, patients);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return error(res, "Patient not found", 404);
    return success(res, patient);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!patient) return error(res, "Patient not found", 404);
    return success(res, patient, "Patient updated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getPatientHistory = async (req, res) => {
  try {
    const Appointment = require("../models/Appointment");
    const Prescription = require("../models/Prescription");
    const DiagnosisLog = require("../models/DiagnosisLog");
    const { id } = req.params;

    const [appointments, prescriptions, diagnoses] = await Promise.all([
      Appointment.find({ patientId: id }).populate(
        "doctorId",
        "name specialization",
      ),
      Prescription.find({ patientId: id }).populate("doctorId", "name"),
      DiagnosisLog.find({ patientId: id }).populate("doctorId", "name"),
    ]);

    const timeline = [
      ...appointments.map((a) => ({ ...a.toObject(), type: "appointment" })),
      ...prescriptions.map((p) => ({ ...p.toObject(), type: "prescription" })),
      ...diagnoses.map((d) => ({ ...d.toObject(), type: "diagnosis" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return success(res, { appointments, prescriptions, diagnoses, timeline });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
