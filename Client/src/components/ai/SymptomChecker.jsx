export default function SymptomChecker({ values, onChange }) {
  const update = (field, value) => onChange({ ...values, [field]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <textarea
        className="input-field md:col-span-2"
        placeholder="Symptoms"
        value={values.symptoms}
        onChange={(e) => update("symptoms", e.target.value)}
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
      <textarea
        className="input-field md:col-span-2"
        placeholder="Medical history"
        value={values.history}
        onChange={(e) => update("history", e.target.value)}
      />
    </div>
  );
}
