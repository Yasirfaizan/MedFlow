export default function RiskFlags({ flags = [] }) {
  if (!flags.length) return null;
  return (
    <div className="space-y-2">
      {flags.map((flag, idx) => (
        <div
          key={idx}
          className="bg-danger-50 border border-danger-100 text-danger-700 text-sm px-4 py-2 rounded-lg"
        >
          {flag}
        </div>
      ))}
    </div>
  );
}
