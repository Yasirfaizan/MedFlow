import Badge from "../common/Badge";

const typeColor = {
  appointment: "blue",
  diagnosis: "yellow",
  prescription: "green",
};

export default function MedicalTimeline({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item._id} className="card">
          <div className="flex items-center justify-between mb-2">
            <Badge color={typeColor[item.type] || "blue"}>{item.type}</Badge>
            <span className="text-xs text-gray-400">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="text-sm text-gray-700">
            {item.type === "appointment" && (
              <span>
                Appointment with {item.doctorId?.name || "Doctor"} at{" "}
                {item.timeSlot}
              </span>
            )}
            {item.type === "diagnosis" && (
              <span>Diagnosis: {item.symptoms}</span>
            )}
            {item.type === "prescription" && (
              <span>
                Prescription created with {item.medicines?.length || 0}{" "}
                medicines
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
