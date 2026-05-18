const User = require("../models/User");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const DiagnosisLog = require("../models/DiagnosisLog");
const { success, error } = require("../utils/response");

exports.adminStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalPatients,
      totalDoctors,
      totalReceptionists,
      monthlyAppointments,
      appointmentsByStatus,
      topDiagnoses,
    ] = await Promise.all([
      Patient.countDocuments(),
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "receptionist" }),
      Appointment.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Appointment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      DiagnosisLog.aggregate([
        { $unwind: "$aiResponse.conditions" },
        { $group: { _id: "$aiResponse.conditions.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return success(res, {
      totalPatients,
      totalDoctors,
      totalReceptionists,
      monthlyAppointments,
      appointmentsByStatus,
      topDiagnoses,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.doctorStats = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayAppts, monthlyAppts, totalPrescriptions, totalAIChecks] =
      await Promise.all([
        Appointment.countDocuments({ doctorId, date: today }),
        Appointment.countDocuments({
          doctorId,
          createdAt: { $gte: startOfMonth },
        }),
        Prescription.countDocuments({ doctorId }),
        DiagnosisLog.countDocuments({ doctorId }),
      ]);

    const monthlyTrend = await Appointment.aggregate([
      { $match: { doctorId: require("mongoose").Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    return success(res, {
      todayAppts,
      monthlyAppts,
      totalPrescriptions,
      totalAIChecks,
      monthlyTrend,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.predictiveAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const topDiseases = await DiagnosisLog.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $unwind: "$aiResponse.conditions" },
      { $group: { _id: "$aiResponse.conditions.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const weeklyLoad = await Appointment.aggregate([
      { $match: { createdAt: { $gte: threeMonthsAgo } } },
      {
        $group: {
          _id: { week: { $week: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
    ]);

    const actualSeries = weeklyLoad.map((w, idx) => ({
      index: idx + 1,
      week: `${w._id.year}-W${w._id.week}`,
      count: w.count,
      type: "actual",
    }));

    const n = actualSeries.length;
    const sumX = actualSeries.reduce((s, p) => s + p.index, 0);
    const sumY = actualSeries.reduce((s, p) => s + p.count, 0);
    const sumXY = actualSeries.reduce((s, p) => s + p.index * p.count, 0);
    const sumXX = actualSeries.reduce((s, p) => s + p.index * p.index, 0);
    const slope =
      n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) : 0;
    const intercept = n ? (sumY - slope * sumX) / n : 0;

    const projectedSeries = Array.from({ length: 4 }).map((_, i) => {
      const index = n + i + 1;
      const projected = Math.max(0, Math.round(intercept + slope * index));
      return {
        index,
        week: `Projected-${i + 1}`,
        count: projected,
        type: "projected",
      };
    });

    const [completedStats, prescriptionStats, avgDailyStats] =
      await Promise.all([
        Appointment.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: "$doctorId", completed: { $sum: 1 } } },
        ]),
        Prescription.aggregate([
          { $group: { _id: "$doctorId", totalPrescriptions: { $sum: 1 } } },
        ]),
        Appointment.aggregate([
          { $match: { status: "completed" } },
          {
            $group: {
              _id: { doctorId: "$doctorId", date: "$date" },
              dailyCount: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: "$_id.doctorId",
              avgPatientsPerDay: { $avg: "$dailyCount" },
            },
          },
        ]),
      ]);

    const doctorIds = completedStats.map((d) => d._id);
    const doctors = await User.find({ _id: { $in: doctorIds } })
      .select("name specialization")
      .lean();

    const prescMap = new Map(
      prescriptionStats.map((p) => [String(p._id), p.totalPrescriptions]),
    );
    const avgMap = new Map(
      avgDailyStats.map((d) => [String(d._id), d.avgPatientsPerDay || 0]),
    );

    const doctorPerformance = completedStats
      .map((stat) => {
        const doc = doctors.find((d) => String(d._id) === String(stat._id));
        return {
          doctorId: stat._id,
          name: doc?.name || "Unknown",
          specialization: doc?.specialization || "N/A",
          completed: stat.completed,
          totalPrescriptions: prescMap.get(String(stat._id)) || 0,
          avgPatientsPerDay: Number(avgMap.get(String(stat._id)) || 0).toFixed(
            1,
          ),
        };
      })
      .sort((a, b) => b.completed - a.completed);

    return success(res, {
      topDiseases,
      patientLoad: {
        actual: actualSeries,
        projected: projectedSeries,
      },
      doctorPerformance,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
