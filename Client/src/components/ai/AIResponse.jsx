export default function AIResponse({ response }) {
  if (!response) return null;
  return (
    <div className="card space-y-3">
      <div>
        <p className="text-sm text-gray-500">Risk Level</p>
        <p className="font-semibold text-gray-900">{response.riskLevel}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Conditions</p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {response.conditions?.map((c, idx) => (
            <li key={idx}>
              {c.name} ({c.likelihood})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm text-gray-500">Suggested Tests</p>
        <div className="text-sm text-gray-700">
          {response.suggestedTests?.join(", ") || "N/A"}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">Urgency</p>
        <div className="text-sm text-gray-700">{response.urgency}</div>
      </div>
    </div>
  );
}
