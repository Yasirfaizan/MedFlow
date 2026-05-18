import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PageWrapper from "../../components/layout/PageWrapper";
import MedicineRow from "../../components/prescriptions/MedicineRow";
import { createPrescription } from "../../api/prescription.api";
import { explainPrescription } from "../../api/ai.api";
import { useAuth } from "../../context/AuthContext";

const emptyMedicine = { name: "", dosage: "", frequency: "", duration: "" };

export default function WritePrescription() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [loading, setLoading] = useState(false);

  const addMedicine = () =>
    setMedicines((prev) => [...prev, { ...emptyMedicine }]);
  const removeMedicine = (i) => {
    if (medicines.length > 1)
      setMedicines((prev) => prev.filter((_, idx) => idx !== i));
  };
  const updateMedicine = (i, next) =>
    setMedicines((prev) => prev.map((m, idx) => (idx === i ? next : m)));

  const onSubmit = async (data) => {
    const invalidMed = medicines.some(
      (m) => !m.name || !m.dosage || !m.frequency || !m.duration,
    );
    if (invalidMed) return toast.error("Complete all medication fields");
    setLoading(true);
    try {
      const res = await createPrescription({ ...data, patientId, medicines });
      toast.success("Prescription issued");

      if (user?.subscriptionPlan === "pro") {
        await explainPrescription({ prescriptionId: res.data.data._id });
        toast.success("AI explanation generated");
      }
      navigate(-1);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to issue prescription",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="Issue Prescription"
      breadcrumb={["Doctor", "Prescription"]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5">
        <div className="card">
          <h3 className="font-medium text-gray-800 mb-4">Medications</h3>
          {medicines.map((med, i) => (
            <div key={i} className="mb-3">
              <MedicineRow
                value={med}
                onChange={(next) => updateMedicine(i, next)}
                onRemove={() => removeMedicine(i)}
                disableRemove={medicines.length === 1}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addMedicine}
            className="btn-secondary text-sm mt-2"
          >
            <Plus size={14} /> Add medication
          </button>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Clinical Notes
            </label>
            <textarea
              {...register("diagnosisNotes")}
              rows={3}
              className="input-field"
              placeholder="Document assessment notes..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Patient Instructions
            </label>
            <textarea
              {...register("instructions")}
              rows={2}
              className="input-field"
              placeholder="Provide usage guidance and precautions..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Follow-up Date
            </label>
            <input
              {...register("followUpDate")}
              type="date"
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Saving..." : "Issue prescription"}
          </button>
        </div>
      </form>
    </PageWrapper>
  );
}
