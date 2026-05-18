import { useEffect, useState } from "react";
import { Download, Loader2, Search } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getAllPrescriptionsForAdmin,
  downloadPrescriptionPdf,
} from "../../api/prescription.api";
import toast from "react-hot-toast";

export default function ManagePrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllPrescriptionsForAdmin()
      .then((res) => setPrescriptions(res.data.data || []))
      .catch(() => toast.error("Failed to load prescriptions"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = prescriptions.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const patientName = p?.patientId?.name || "";
    const doctorName = p?.doctorId?.name || "";
    return (
      patientName.toLowerCase().includes(q) ||
      doctorName.toLowerCase().includes(q)
    );
  });

  const downloadPDF = async (id) => {
    setDownloadingId(id);
    try {
      const res = await downloadPrescriptionPdf(id);
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescription-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <PageWrapper
        title="Prescription Oversight"
        breadcrumb={["Admin", "Prescriptions"]}
      >
        <div className="flex justify-center h-64 items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Prescription Oversight"
      breadcrumb={["Admin", "Prescriptions"]}
    >
      <div className="space-y-4">
        <div className="card flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-10 w-full"
              placeholder="Search by patient or clinician name"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="card text-sm text-gray-500">
              No prescriptions available.
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p._id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {p?.patientId?.name || "Patient"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Prescribed by {p?.doctorId?.name || "Clinician"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  <button
                    className="btn-secondary flex items-center gap-2"
                    disabled={downloadingId === p._id}
                    onClick={() => downloadPDF(p._id)}
                  >
                    {downloadingId === p._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    {downloadingId === p._id ? "Downloading" : "Download"}
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-400 mb-2">
                    MEDICATIONS
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {p.medicines?.map((m, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-gray-700 bg-gray-50 rounded p-2"
                      >
                        <span className="font-medium">{m.name}</span> —{" "}
                        {m.dosage}, {m.frequency} ({m.duration})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
