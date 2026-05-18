import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyPrescriptions } from "../../api/prescription.api";
import { FileText, Download } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPrescriptions()
      .then((res) => setPrescriptions(res.data.data || []))
      .catch(() => toast.error("Failed to load prescriptions"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper
      title="My Prescriptions"
      breadcrumb={["Patient", "Prescriptions"]}
    >
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="card text-center py-10">
          <FileText size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">
            No prescriptions on record.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Prescriptions issued by your clinician will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((pres) => (
            <div
              key={pres._id}
              className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Dr. {pres.doctorId?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {pres.doctorId?.specialization || "General Medicine"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {pres.createdAt
                      ? format(new Date(pres.createdAt), "dd MMM yyyy")
                      : "—"}
                    {" · "}
                    {pres.medicines?.length || 0} medicine
                    {pres.medicines?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 self-end sm:self-center">
                <Link
                  to={`/patient/prescriptions/${pres._id}`}
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
