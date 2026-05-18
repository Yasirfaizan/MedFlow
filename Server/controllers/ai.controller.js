const DiagnosisLog = require("../models/DiagnosisLog");
const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const { success, error } = require("../utils/response");
const {
  checkSymptoms,
  explainPrescription,
  translateToUrdu,
} = require("../services/ai.service");

exports.symptomCheck = async (req, res) => {
  try {
    const { patientId, symptoms, age, gender, history } = req.body;
    const aiResult = await checkSymptoms(symptoms, age, gender, history);

    if (!aiResult.success) {
      return res.status(200).json({
        success: false,
        message: aiResult.message,
        fallback: true,
        data: null,
      });
    }

    const log = await DiagnosisLog.create({
      patientId,
      doctorId: req.user.userId,
      symptoms,
      age,
      gender,
      history,
      aiResponse: aiResult.data || null,
      riskLevel: aiResult.data?.riskLevel?.toLowerCase() || "low",
      riskFlags: [],
    });

    return success(res, { log, aiResult });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.explainPrescription = async (req, res) => {
  try {
    const { prescriptionId, urduMode } = req.body;
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) return error(res, "Prescription not found", 404);

    const explanation = await explainPrescription(
      prescription.medicines,
      prescription.instructions,
    );
    prescription.aiExplanation = explanation;

    if (urduMode) {
      const urdu = await translateToUrdu(explanation);
      prescription.aiExplanationUrdu = urdu;
    }

    await prescription.save();
    return success(res, prescription, "Explanation generated");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getRiskFlags = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const logs = await DiagnosisLog.find({
      patientId,
      createdAt: { $gte: sixMonthsAgo },
    });

    const conditionCount = {};
    logs.forEach((log) => {
      log.aiResponse?.conditions?.forEach((c) => {
        const name = c.name;
        conditionCount[name] = (conditionCount[name] || 0) + 1;
      });
    });

    const riskFlags = [];
    Object.keys(conditionCount).forEach((condition) => {
      if (conditionCount[condition] >= 3)
        riskFlags.push(
          `Recurring ${condition} detected (${conditionCount[condition]} times in 6 months)`,
        );
    });

    const all = Object.keys(conditionCount);
    if (all.includes("Diabetes") && all.includes("Hypertension"))
      riskFlags.push(
        "High cardiovascular risk: Diabetes + Hypertension combination",
      );
    if (patient?.age > 60 && (conditionCount["Pneumonia"] || 0) >= 2)
      riskFlags.push("Elderly patient with recurring respiratory infection");

    const latestLog = await DiagnosisLog.findOne({ patientId }).sort({
      createdAt: -1,
    });
    if (latestLog) {
      latestLog.riskFlags = riskFlags;
      await latestLog.save();
    }

    return success(res, { riskFlags, conditionCount });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
