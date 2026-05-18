import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getAppointments,
  updateAppointmentStatus,
} from "../../api/appointment.api";
import Badge from "../../components/common/Badge";
import toast from "react-hot-toast";

const statusColor = {
  pending: "yellow",
  confirmed: "green",
  completed: "blue",
  cancelled: "red",
};

export default function DailySchedule() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    const res = await getAppointments();
    setAppointments(res.data.data || []);
  };

  useEffect(() => {
    loadAppointments().catch(() => toast.error("Failed to load appointments"));
  }, []);

  const onUpdateStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success("Status updated");
      loadAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const daily = appointments.filter((a) => a.date === date);

  return (
    <PageWrapper
      title="Daily Schedule"
      breadcrumb={["Receptionist", "Schedule"]}
    >
      <div className="space-y-6">
        <div className="card">
          <label className="text-sm text-gray-500">Schedule date</label>
          <input
            className="input-field mt-2"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Patient</th>
                <th>Clinician</th>
                <th>Time</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {daily.map((appt) => (
                <tr key={appt._id} className="border-t">
                  <td className="py-2">{appt.patientId?.name}</td>
                  <td>{appt.doctorId?.name}</td>
                  <td>{appt.timeSlot}</td>
                  <td>
                    <Badge color={statusColor[appt.status]}>
                      {appt.status}
                    </Badge>
                  </td>
                  <td className="text-right space-x-2">
                    {appt.status === "pending" && (
                      <button
                        className="btn-secondary"
                        onClick={() => onUpdateStatus(appt._id, "confirmed")}
                      >
                        Confirm visit
                      </button>
                    )}
                    {appt.status !== "cancelled" &&
                      appt.status !== "completed" && (
                        <button
                          className="btn-danger"
                          onClick={() => onUpdateStatus(appt._id, "cancelled")}
                        >
                          Cancel visit
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {daily.length === 0 && (
            <p className="text-sm text-gray-400 mt-4">
              No appointments for the selected date.
            </p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
