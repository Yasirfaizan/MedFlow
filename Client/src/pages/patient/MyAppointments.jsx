import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getAppointments,
  bookAppointment,
  updateAppointmentStatus,
} from "../../api/appointment.api";
import Badge from "../../components/common/Badge";
import SlotPicker from "../../components/appointments/SlotPicker";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { CalendarPlus, Loader2, AlertTriangle } from "lucide-react";

const statusColor = {
  pending: "yellow",
  confirmed: "green",
  completed: "blue",
  cancelled: "red",
};

const initialForm = {
  doctorId: "",
  date: "",
  timeSlot: "",
  notes: "",
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

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [doctors, setDoctors] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadAppointments = async () => {
    const res = await getAppointments();
    setAppointments(res.data.data || []);
  };

  useEffect(() => {
    loadAppointments().catch(() => toast.error("Failed to load appointments"));

    api
      .get("/users?role=doctor")
      .then((res) => setDoctors(res.data.data || []))
      .catch(() => toast.error("Failed to load doctors"));
  }, []);

  const cancelAppointment = async (id) => {
    try {
      await updateAppointmentStatus(id, "cancelled");
      toast.success("Appointment cancelled");
      loadAppointments();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel appointment",
      );
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.date || !form.timeSlot) {
      toast.error("Please select a doctor, date, and time slot.");
      return;
    }
    setBookingLoading(true);
    try {
      await bookAppointment(form);
      toast.success("Appointment booked successfully!");
      setForm(initialForm);
      setShowBookingForm(false);
      loadAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <PageWrapper
      title="My Appointments"
      breadcrumb={["Patient", "Appointments"]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Booking Form Card */}
        {showBookingForm && (
          <div className="card bg-white border border-gray-150 rounded-2xl p-6 shadow-sm transition-all">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarPlus size={18} className="text-green-600" />
              Schedule appointment
            </h3>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Select Doctor
                  </label>
                  <select
                    className="input-field"
                    value={form.doctorId}
                    onChange={(e) =>
                      setForm({ ...form, doctorId: e.target.value })
                    }
                  >
                    <option value="">Select clinician</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        Dr. {d.name} ({d.specialization || "General"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Appointment date
                  </label>
                  <input
                    className="input-field"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-2">
                  Select available time slot
                </label>
                <SlotPicker
                  value={form.timeSlot}
                  onChange={(slot) => setForm({ ...form, timeSlot: slot })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  Reason / Notes (optional)
                </label>
                <textarea
                  className="input-field"
                  placeholder="Specify symptoms or booking notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingForm(false);
                    setForm(initialForm);
                  }}
                  className="py-2 px-4 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="py-2 px-5 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {bookingLoading ? "Scheduling..." : "Schedule appointment"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Appointment History
              </h2>
              <p className="text-sm text-gray-500">
                Review upcoming and completed visits.
              </p>
            </div>
            {!showBookingForm && (
              <button
                onClick={() => setShowBookingForm(true)}
                className="py-2 px-4 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <CalendarPlus size={16} />
                Schedule appointment
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 pb-2">
                  <th className="py-3 font-semibold">Doctor</th>
                  <th className="py-3 font-semibold">Date</th>
                  <th className="py-3 font-semibold">Time</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((appt) => {
                  const timeStatus = getAppTimeStatus(
                    appt.date,
                    appt.timeSlot,
                    appt.status,
                  );
                  return (
                    <tr
                      key={appt._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3.5 font-medium text-gray-900">
                        Dr. {appt.doctorId?.name || "Unassigned"}
                        <span className="block text-xs text-gray-400 font-normal">
                          {appt.doctorId?.specialization || "General Medicine"}
                        </span>
                      </td>
                      <td className="py-3.5 text-gray-600">{appt.date}</td>
                      <td className="py-3.5 text-gray-600 font-medium">
                        {appt.timeSlot}
                      </td>
                      <td className="py-3.5">
                        {timeStatus.isWasted ? (
                          <div className="flex flex-col gap-0.5">
                            <Badge color="red">Missed</Badge>
                            <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
                              <AlertTriangle size={10} />
                              No-show recorded
                            </span>
                          </div>
                        ) : (
                          <Badge color={statusColor[appt.status]}>
                            {appt.status}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        {appt.status === "pending" && !timeStatus.isWasted && (
                          <button
                            className="py-1 px-3 rounded-lg text-xs font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors"
                            onClick={() => cancelAppointment(appt._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {appointments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">No appointments found.</p>
              <button
                onClick={() => setShowBookingForm(true)}
                className="mt-3 text-xs font-semibold text-green-600 hover:underline"
              >
                Schedule your first appointment &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
