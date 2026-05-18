import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { format } from "date-fns";

export default function PrescriptionCard({ prescription, linkPrefix = "/patient" }) {
  return (
    <div className="card flex items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-green-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {prescription.patientId?.name || "Patient"}
          </p>
          <p className="text-xs text-gray-400">
            Dr. {prescription.doctorId?.name || "—"}
            {prescription.doctorId?.specialization
              ? ` · ${prescription.doctorId.specialization}`
              : ""}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {prescription.createdAt
              ? format(new Date(prescription.createdAt), "dd MMM yyyy")
              : "—"}
            {" · "}
            {prescription.medicines?.length || 0} medicine
            {prescription.medicines?.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <Link
        to={`${linkPrefix}/prescriptions/${prescription._id}`}
        className="py-1.5 px-3 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        View
      </Link>
    </div>
  );
}
