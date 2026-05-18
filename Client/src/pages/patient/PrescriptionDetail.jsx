import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Loader2, Brain } from "lucide-react";
import toast from "react-hot-toast";
import {
  getPrescription,
  downloadPrescriptionPdf,
} from "../../api/prescription.api";
import PageWrapper from "../../components/layout/PageWrapper";
import { format } from "date-fns";

export default function PrescriptionDetail() {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getPrescription(id)
      .then((res) => setPrescription(res.data.data))
      .catch(() => toast.error("Failed to load prescription"))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPDF = async () => {
    setDownloading(true);
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
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <PageWrapper title="Prescription">
        <div className="flex justify-center h-64 items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper
      title="Prescription Detail"
      breadcrumb={["Patient", "Prescriptions"]}
    >
      <div className="max-w-2xl space-y-5">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-400">Prescribed by</p>
              <p className="font-semibold text-gray-900">
                Dr. {prescription?.doctorId?.name}
              </p>
              <p className="text-sm text-gray-400">
                {prescription?.doctorId?.specialization}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Date</p>
              <p className="font-medium">
                {prescription?.createdAt
                  ? format(new Date(prescription.createdAt), "dd MMM yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mb-4">
            <p className="text-xs font-medium text-gray-400 mb-3">MEDICINES</p>
            {prescription?.medicines?.map((med, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-2 py-2 border-b border-gray-50 text-sm"
              >
                <span className="font-medium text-gray-800">{med.name}</span>
                <span className="text-gray-500">{med.dosage}</span>
                <span className="text-gray-500">{med.frequency}</span>
                <span className="text-gray-500">{med.duration}</span>
              </div>
            ))}
          </div>

          {prescription?.instructions && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-400 mb-1">
                INSTRUCTIONS
              </p>
              <p className="text-sm text-gray-700">
                {prescription.instructions}
              </p>
            </div>
          )}

          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="btn-primary mt-4 w-full justify-center"
          >
            {downloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>

        {prescription?.aiExplanation ? (
          <div className="card border-primary-100">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Brain size={16} className="text-primary-500" /> AI Explanation
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {prescription.aiExplanation}
            </p>
            {prescription?.aiExplanationUrdu && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-2">URDU</p>
                <p className="text-sm text-gray-600 leading-relaxed text-right font-urdu">
                  {prescription.aiExplanationUrdu}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-sm text-gray-500">
            Explanation not available. Please ask your doctor.
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
