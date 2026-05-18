import { useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import PatientForm from "../../components/patients/PatientForm";
import { createPatient } from "../../api/patient.api";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  address: "",
  bloodGroup: "",
  emergencyContact: "",
};

export default function RegisterPatient() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    ["name", "age", "gender", "phone"].forEach((field) => {
      if (!form[field]) nextErrors[field] = "Required";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      await createPatient(form);
      toast.success("Patient registered");
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="Register Patient"
      breadcrumb={["Receptionist", "Register Patient"]}
    >
      <form onSubmit={onSubmit} className="card space-y-4">
        <PatientForm values={form} onChange={setForm} />
        {Object.keys(errors).length > 0 && (
          <p className="text-xs text-red-500">
            Please fill all required fields.
          </p>
        )}
        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? "Saving..." : "Register Patient"}
        </button>
      </form>
    </PageWrapper>
  );
}
