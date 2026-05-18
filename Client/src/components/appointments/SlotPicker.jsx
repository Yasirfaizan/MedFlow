const slots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export default function SlotPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((slot) => (
        <button
          type="button"
          key={slot}
          onClick={() => onChange(slot)}
          className={`px-3 py-1 rounded-full text-sm border ${
            value === slot
              ? "bg-primary-500 text-white border-primary-500"
              : "bg-white text-gray-600 border-gray-200"
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
