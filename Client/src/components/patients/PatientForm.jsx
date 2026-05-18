export default function PatientForm({ values, onChange }) {
  const update = (field, value) => onChange({ ...values, [field]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        className="input-field"
        placeholder="Full name"
        value={values.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Age"
        type="number"
        value={values.age}
        onChange={(e) => update("age", e.target.value)}
      />
      <select
        className="input-field"
        value={values.gender}
        onChange={(e) => update("gender", e.target.value)}
      >
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input
        className="input-field"
        placeholder="Phone"
        value={values.phone}
        onChange={(e) => update("phone", e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Address"
        value={values.address}
        onChange={(e) => update("address", e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Blood group"
        value={values.bloodGroup}
        onChange={(e) => update("bloodGroup", e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Emergency contact"
        value={values.emergencyContact}
        onChange={(e) => update("emergencyContact", e.target.value)}
      />
    </div>
  );
}
