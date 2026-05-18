export default function MedicineRow({
  value,
  onChange,
  onRemove,
  disableRemove,
}) {
  const updateField = (field, next) => {
    onChange({ ...value, [field]: next });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
      <input
        className="input-field"
        placeholder="Name"
        value={value.name}
        onChange={(e) => updateField("name", e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Dosage"
        value={value.dosage}
        onChange={(e) => updateField("dosage", e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Frequency"
        value={value.frequency}
        onChange={(e) => updateField("frequency", e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Duration"
        value={value.duration}
        onChange={(e) => updateField("duration", e.target.value)}
      />
      <button
        type="button"
        onClick={onRemove}
        className="btn-secondary"
        disabled={disableRemove}
      >
        Remove
      </button>
    </div>
  );
}
