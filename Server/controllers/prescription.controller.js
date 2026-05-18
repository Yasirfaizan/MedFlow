const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const User = require("../models/User");
const { success, error } = require("../utils/response");
const { generatePDF } = require("../services/pdf.service");

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, medicines } = req.body;
    if (!patientId || !Array.isArray(medicines) || medicines.length < 1) {
      return error(res, "Patient and at least one medicine required", 400);
    }
    const prescription = await Prescription.create({
      ...req.body,
      doctorId: req.user.userId,
    });
    return success(res, prescription, "Prescription created", 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Patient fetches their own prescriptions (resolved by createdBy → phone fallback)
exports.getMyPrescriptions = async (req, res) => {
  try {
    const userDoc = await User.findById(req.user.userId);
    if (!userDoc) return error(res, "User not found", 404);

    let clinicalPatient = await Patient.findOne({
      createdBy: req.user.userId,
    });

    if (!clinicalPatient && userDoc.phone) {
      clinicalPatient = await Patient.findOne({ phone: userDoc.phone });
    }

    if (!clinicalPatient) {
      return success(res, []);
    }

    const prescriptions = await Prescription.find({
      patientId: clinicalPatient._id,
    })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    return success(res, prescriptions);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.patientId,
    })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });
    return success(res, prescriptions);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patientId", "name age gender")
      .populate("doctorId", "name specialization phone");
    if (!prescription) return error(res, "Prescription not found", 404);
    return success(res, prescription);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getAllPrescriptionsForAdmin = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patientId", "name age gender")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    return success(res, prescriptions);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patientId", "name age gender")
      .populate("doctorId", "name specialization phone");
    if (!prescription) return error(res, "Not found", 404);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=prescription-${req.params.id}.pdf`,
    );
    generatePDF(prescription, res);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
