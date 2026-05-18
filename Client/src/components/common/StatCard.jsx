export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  change,
}) {
  const colors = {
    primary: "bg-primary-50 text-primary-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-warning-50 text-warning-700",
    red: "bg-danger-50 text-danger-700",
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {change && <p className="text-xs text-gray-400 mt-1">{change}</p>}
    </div>
  );
}
