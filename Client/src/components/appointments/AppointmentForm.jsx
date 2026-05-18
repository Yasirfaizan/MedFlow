export default function AppointmentForm({
  values,
  onChange,
  doctors,
  patients,
}) {
  const update = (field, value) => onChange({ ...values, [field]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <select
        className="input-field"
        value={values.patientId}
        onChange={(e) => update("patientId", e.target.value)}
      >
        <option value="">Select patient</option>
        {patients.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
      <select
        className="input-field"
        value={values.doctorId}
        onChange={(e) => update("doctorId", e.target.value)}
      >
        <option value="">Select doctor</option>
        {doctors.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name} ({d.specialization || "General"})
          </option>
        ))}
      </select>
      <input
        className="input-field"
        type="date"
        value={values.date}
        onChange={(e) => update("date", e.target.value)}
      />
      <textarea
        className="input-field md:col-span-2"
        placeholder="Notes"
        value={values.notes}
        onChange={(e) => update("notes", e.target.value)}
      />
    </div>
  );
}
