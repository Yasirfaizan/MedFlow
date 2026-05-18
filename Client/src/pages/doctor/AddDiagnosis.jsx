import { useState } from "react";
import { useParams } from "react-router-dom";
import { Brain, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import PageWrapper from "../../components/layout/PageWrapper";
import PlanGate from "../../components/common/PlanGate";
import SymptomChecker from "../../components/ai/SymptomChecker";
import AIResponse from "../../components/ai/AIResponse";
import { symptomCheck } from "../../api/ai.api";

export default function AddDiagnosis() {
  const { patientId } = useParams();
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [form, setForm] = useState({
    symptoms: "",
    age: "",
    gender: "",
    history: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await symptomCheck({ ...form, patientId });
      if (res.data.success === false) {
        setAiResult({ fallback: true, message: res.data.message });
        toast.error(res.data.message);
      } else {
        setAiResult(res.data.data.aiResult.data);
        toast.success("AI analysis complete");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Upgrade to Pro for AI features");
      } else {
        toast.error("AI unavailable. Diagnosis saved manually.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="AI Symptom Checker"
      breadcrumb={["Doctor", "Diagnosis"]}
    >
      <div className="max-w-2xl space-y-5">
        <PlanGate feature="AI Symptom Checker">
          <div className="card space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">
              <SymptomChecker values={form} onChange={setForm} />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Brain size={14} />
                )}
                {loading ? "Analyzing..." : "Run AI Analysis"}
              </button>
            </form>
          </div>

          {aiResult && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Brain size={16} className="text-primary-500" /> AI Analysis
                Result
              </h3>
              {aiResult.fallback ? (
                <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg text-sm">
                  <AlertTriangle size={16} /> {aiResult.message}
                </div>
              ) : (
                <AIResponse response={aiResult} />
              )}
            </div>
          )}
        </PlanGate>
      </div>
    </PageWrapper>
  );
}
