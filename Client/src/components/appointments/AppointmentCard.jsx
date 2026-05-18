import Badge from "../common/Badge";

const statusColor = {
  confirmed: "green",
  pending: "yellow",
  cancelled: "red",
  completed: "blue",
};

export default function AppointmentCard({ appointment }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-900">
          {appointment.patientId?.name || "Patient"}
        </p>
        <p className="text-xs text-gray-400">
          {appointment.date} • {appointment.timeSlot}
        </p>
      </div>
      <Badge color={statusColor[appointment.status] || "blue"}>
        {appointment.status}
      </Badge>
    </div>
  );
}
