const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const { success, error } = require("../utils/response");

exports.bookAppointment = async (req, res) => {
  try {
    let { patientId, doctorId, date, timeSlot, notes } = req.body;

    // If the booking user is a Patient client, auto-resolve or auto-create their clinical profile
    if (req.user.role === "patient") {
      const userDoc = await User.findById(req.user.userId);

      // Use createdBy as the primary link (this is what getAllAppointments expects).
      // Fallback to phone for legacy records.
      let clinicalPatient = await Patient.findOne({
        createdBy: req.user.userId,
      });

      if (!clinicalPatient && userDoc?.phone) {
        clinicalPatient = await Patient.findOne({ phone: userDoc.phone });
      }

      if (!clinicalPatient) {
        // Auto-create standard clinical record so the patient can start booking immediately
        clinicalPatient = await Patient.create({
          name: userDoc.name,
          phone: userDoc.phone || "Not Provided",
          age: userDoc.age || 30,
          gender: "other", // Default fallback
          createdBy: req.user.userId,
          clinicId: userDoc.clinicId || null,
        });
      }

      // Ensure createdBy is set for consistency
      if (!clinicalPatient.createdBy) {
        clinicalPatient.createdBy = req.user.userId;
        await clinicalPatient.save();
      }

      patientId = clinicalPatient._id;
    }

    if (!patientId || !doctorId || !date || !timeSlot)
      return error(res, "Missing required appointment fields", 400);

    // Doctor must be approved by admin
    const doctor = await User.findById(doctorId);
    if (!doctor) return error(res, "Doctor not found", 404);
    if (
      doctor.doctorApprovalStatus !== "approved" ||
      doctor.isActive !== true
    ) {
      return error(res, "Doctor not approved by admin", 403);
    }

    const conflict = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });
    if (conflict)
      return res.status(400).json({
        success: false,
        message: "Slot not available",
      });

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      notes,
    });
    return success(res, appointment, "Appointment booked", 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "doctor") filter.doctorId = req.user.userId;
    if (req.user.role === "patient") {
      const userDoc = await User.findById(req.user.userId);

      // Prefer the linked clinical profile created for this patient user
      let clinicalPatient = await Patient.findOne({
        createdBy: req.user.userId,
      });

      // Fallback to phone match for legacy records
      if (!clinicalPatient && userDoc?.phone) {
        clinicalPatient = await Patient.findOne({ phone: userDoc.phone });
      }

      if (clinicalPatient) {
        filter.patientId = clinicalPatient._id;
      } else {
        return success(res, []);
      }
    }
    const appointments = await Appointment.find(filter)
      .populate("patientId", "name age gender phone")
      .populate("doctorId", "name specialization")
      .sort({ date: 1, timeSlot: 1 });
    return success(res, appointments);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return error(res, "Appointment not found", 404);

    const role = req.user.role;
    const current = appointment.status;

    const allowedByRole = {
      doctor: ["confirmed", "completed", "cancelled"],
      receptionist: ["confirmed", "cancelled"],
      patient: ["cancelled"],
    };

    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    if (!allowedByRole[role]?.includes(status)) {
      return error(res, "Status transition not allowed for your role", 403);
    }

    if (!validTransitions[current]?.includes(status)) {
      return error(res, "Invalid status transition", 400);
    }

    if (role === "patient") {
      if (current !== "pending") {
        return error(res, "You can only cancel pending appointments", 400);
      }

      // Patient can only cancel their own pending appointments
      const Patient = require("../models/Patient");
      const User = require("../models/User");
      const userDoc = await User.findById(req.user.userId);
      const clinicalPatient = await Patient.findOne({ phone: userDoc.phone });

      if (
        !clinicalPatient ||
        String(appointment.patientId) !== String(clinicalPatient._id)
      ) {
        return error(res, "You can only cancel your own appointments", 403);
      }
    }

    appointment.status = status;
    await appointment.save();
    return success(res, appointment, "Status updated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getDoctorSchedule = async (req, res) => {
  try {
    const { date } = req.query;
    const appointments = await Appointment.find({
      doctorId: req.user.userId,
      date,
    })
      .populate("patientId", "name age gender")
      .sort({ timeSlot: 1 });

    const grouped = appointments.reduce(
      (acc, appt) => {
        acc[appt.status] = acc[appt.status] || [];
        acc[appt.status].push(appt);
        return acc;
      },
      { pending: [], confirmed: [], completed: [], cancelled: [] },
    );

    return success(res, { date, grouped, appointments });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
