export default function PrescriptionViewer({ prescription }) {
  return (
    <div className="card space-y-4">
      <div>
        <p className="text-sm text-gray-500">Doctor</p>
        <p className="font-semibold text-gray-900">
          {prescription.doctorId?.name || "Doctor"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Medicines</p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {prescription.medicines?.map((med, idx) => (
            <li key={idx}>
              {med.name} - {med.dosage}, {med.frequency} for {med.duration}
            </li>
          ))}
        </ul>
      </div>
      {prescription.instructions && (
        <div>
          <p className="text-sm text-gray-500">Instructions</p>
          <p className="text-sm text-gray-700">{prescription.instructions}</p>
        </div>
      )}
      {prescription.followUpDate && (
        <div>
          <p className="text-sm text-gray-500">Follow-up Date</p>
          <p className="text-sm text-gray-700">{prescription.followUpDate}</p>
        </div>
      )}
    </div>
  );
}
