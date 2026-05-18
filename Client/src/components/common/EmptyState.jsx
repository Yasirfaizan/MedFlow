export default function EmptyState({ title = "No data", message }) {
  return (
    <div className="card text-center py-10">
      <p className="font-semibold text-gray-800 mb-1">{title}</p>
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  );
}
