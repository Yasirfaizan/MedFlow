import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getDoctorSchedule,
  updateAppointmentStatus,
} from "../../api/appointment.api";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";
import { Check, X, AlertTriangle, FileText } from "lucide-react";

const statusColor = {
  pending: "yellow",
  confirmed: "green",
  completed: "blue",
  cancelled: "red",
};

// Helper to determine if an appointment slot has already passed
const getAppTimeStatus = (dateStr, timeSlotStr, currentStatus) => {
  if (currentStatus === "completed" || currentStatus === "cancelled") {
    return { isPassed: false, isWasted: false };
  }

  try {
    if (!dateStr || !timeSlotStr) return { isPassed: false, isWasted: false };

    // Parse Date: YYYY-MM-DD
    const [year, month, day] = dateStr.split("-").map(Number);

    // Parse Time: "09:00 AM" or "12:00 PM"
    const match = timeSlotStr.match(/^(\d{2}|\d{1}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return { isPassed: false, isWasted: false };

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const ampm = match[3].toUpperCase();

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    // Add 1 hour buffer (assume each slot is 1 hour)
    const apptDate = new Date(year, month - 1, day, hours, minutes);
    const bufferApptDate = new Date(apptDate.getTime() + 60 * 60 * 1000); // 1 hour buffer

    const now = new Date();
    const isPassed = bufferApptDate < now;
    const isWasted =
      isPassed &&
      (currentStatus === "pending" || currentStatus === "confirmed");

    return { isPassed, isWasted };
  } catch (e) {
    return { isPassed: false, isWasted: false };
  }
};

export default function MySchedule() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [schedule, setSchedule] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    appt: null,
    note: "",
  });

  const loadSchedule = async (selected) => {
    const res = await getDoctorSchedule(selected);
    setSchedule(res.data.data);
  };

  useEffect(() => {
    loadSchedule(date).catch(() => toast.error("Unable to load schedule"));
  }, [date]);

  const handleStatusUpdate = async (apptId, nextStatus) => {
    setUpdating(true);
    try {
      await updateAppointmentStatus(apptId, nextStatus);
      toast.success(`Appointment updated to ${nextStatus}.`);
      await loadSchedule(date);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update appointment status",
      );
    } finally {
      setUpdating(false);
    }
  };

  const openConfirmModal = (appt) => {
    setConfirmModal({ open: true, appt, note: "" });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, appt: null, note: "" });
  };

  const confirmOnly = async () => {
    if (!confirmModal.appt) return;
    await handleStatusUpdate(confirmModal.appt._id, "confirmed");
    closeConfirmModal();
  };

  const confirmAndPrescribe = async () => {
    if (!confirmModal.appt) return;
    await handleStatusUpdate(confirmModal.appt._id, "confirmed");
    closeConfirmModal();
    navigate(`/doctor/prescription/${confirmModal.appt.patientId?._id}`, {
      state: { note: confirmModal.note },
    });
  };

  return (
    <PageWrapper title="My Schedule" breadcrumb={["Doctor", "Schedule"]}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="card">
          <label className="text-sm font-semibold text-gray-600">
            Schedule date
          </label>
          <input
            className="input-field mt-2 max-w-xs"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.keys(schedule?.grouped || {}).map((status) => {
            const list = schedule.grouped[status] || [];
            return (
              <div key={status} className="card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-gray-800 capitalize flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          status === "pending"
                            ? "bg-yellow-500"
                            : status === "confirmed"
                              ? "bg-green-500"
                              : status === "completed"
                                ? "bg-blue-500"
                                : "bg-red-500"
                        }`}
                      />
                      {status}
                    </h3>
                    <Badge color={statusColor[status]}>{list.length}</Badge>
                  </div>

                  <div className="space-y-3">
                    {list.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">
                        No appointments in this category.
                      </p>
                    ) : (
                      list.map((appt) => {
                        const timeStatus = getAppTimeStatus(
                          appt.date || date,
                          appt.timeSlot,
                          appt.status,
                        );
                        return (
                          <div
                            key={appt._id}
                            className="p-3 bg-gray-50/60 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {appt.patientId?.name || "Unnamed patient"}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                                <span className="font-medium text-gray-700">
                                  {appt.timeSlot}
                                </span>
                                {appt.patientId?.gender && (
                                  <>
                                    <span>•</span>
                                    <span className="capitalize">
                                      {appt.patientId.gender}
                                    </span>
                                  </>
                                )}
                                {appt.patientId?.age && (
                                  <>
                                    <span>•</span>
                                    <span>{appt.patientId.age} years</span>
                                  </>
                                )}
                              </div>
                              {appt.notes && (
                                <p className="text-xs text-gray-400 bg-white border border-gray-100 p-1.5 rounded mt-1 italic">
                                  "{appt.notes}"
                                </p>
                              )}
                              {timeStatus.isWasted && (
                                <div className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 bg-red-50 border border-red-100 px-2 py-0.5 rounded w-max">
                                  <AlertTriangle size={10} />
                                  No-show recorded
                                </div>
                              )}
                            </div>

                            {/* Action Buttons for Doctor */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              {status === "pending" && (
                                <>
                                  <button
                                    onClick={() => openConfirmModal(appt)}
                                    disabled={updating}
                                    title="Confirm appointment"
                                    className="p-1.5 bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(appt._id, "cancelled")
                                    }
                                    disabled={updating}
                                    title="Cancel appointment"
                                    className="p-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}

                              {status === "confirmed" && (
                                <>
                                  <Link
                                    to={`/doctor/prescription/${appt.patientId?._id}`}
                                    title="Issue prescription"
                                    className="py-1 px-2.5 bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    <FileText size={13} />
                                    Issue prescription
                                  </Link>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(appt._id, "completed")
                                    }
                                    disabled={updating}
                                    title="Complete appointment"
                                    className="py-1 px-2.5 bg-green-600 text-white font-medium text-xs hover:bg-green-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                  >
                                    <Check size={14} className="stroke-[3]" />
                                    Complete visit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(appt._id, "cancelled")
                                    }
                                    disabled={updating}
                                    title="Cancel appointment"
                                    className="p-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}

                              {status === "completed" && (
                                <Link
                                  to={`/doctor/prescription/${appt.patientId?._id}`}
                                  title="Issue prescription"
                                  className="py-1 px-2.5 bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <FileText size={13} />
                                  Issue prescription
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        open={confirmModal.open}
        title="Confirm appointment"
        onClose={closeConfirmModal}
      >
        <p className="text-sm text-gray-600 mb-3">
          Add a brief clinical note or proceed to prescription.
        </p>
        <textarea
          className="input-field"
          rows={3}
          placeholder="Clinical note (optional)"
          value={confirmModal.note}
          onChange={(e) =>
            setConfirmModal((prev) => ({ ...prev, note: e.target.value }))
          }
        />
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={closeConfirmModal}>
            Cancel
          </button>
          <button className="btn-secondary" onClick={confirmOnly}>
            Confirm visit
          </button>
          <button className="btn-primary" onClick={confirmAndPrescribe}>
            Confirm and issue prescription
          </button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
