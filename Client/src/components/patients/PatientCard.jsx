import { Link } from "react-router-dom";
import Badge from "../common/Badge";

export default function PatientCard({ patient }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-900">{patient.name}</p>
        <p className="text-xs text-gray-400">
          {patient.age} years, {patient.gender}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {patient.bloodGroup && <Badge color="blue">{patient.bloodGroup}</Badge>}
        <Link to={`/doctor/patients/${patient._id}`} className="btn-secondary">
          View Profile
        </Link>
      </div>
    </div>
  );
}
