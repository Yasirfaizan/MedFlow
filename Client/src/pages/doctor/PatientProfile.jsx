import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import MedicalTimeline from "../../components/patients/MedicalTimeline";
import RiskFlags from "../../components/ai/RiskFlags";
import { getPatient, getPatientHistory } from "../../api/patient.api";
import { getRiskFlags } from "../../api/ai.api";
import toast from "react-hot-toast";

const tabs = [
  { key: "info", label: "Personal Info" },
  { key: "appointments", label: "Appointments" },
  { key: "diagnosis", label: "Diagnosis" },
  { key: "prescriptions", label: "Prescriptions" },
  { key: "timeline", label: "Timeline" },
];

export default function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState(null);
  const [riskFlags, setRiskFlags] = useState([]);
  const [active, setActive] = useState("info");

  useEffect(() => {
    getPatient(id)
      .then((res) => setPatient(res.data.data))
      .catch(() => toast.error("Failed to load patient"));

    getPatientHistory(id)
      .then((res) => setHistory(res.data.data))
      .catch(() => toast.error("Failed to load history"));

    getRiskFlags(id)
      .then((res) => setRiskFlags(res.data.data.riskFlags || []))
      .catch(() => {});
  }, [id]);

  return (
    <PageWrapper title="Patient Profile" breadcrumb={["Doctor", "Patient"]}>
      <div className="space-y-6">
        <div className="card flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {patient?.name || "Patient"}
            </h2>
            <p className="text-sm text-gray-500">
              {patient?.age} years • {patient?.gender}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={`/doctor/diagnosis/${id}`} className="btn-secondary">
              Add Diagnosis
            </Link>
            <Link to={`/doctor/prescription/${id}`} className="btn-primary">
              Write Prescription
            </Link>
          </div>
        </div>

        <RiskFlags flags={riskFlags} />

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-3 py-1 rounded-full text-sm ${
                active === tab.key
                  ? "bg-primary-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active === "info" && (
          <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm text-gray-800">{patient?.phone || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Blood Group</p>
              <p className="text-sm text-gray-800">
                {patient?.bloodGroup || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Address</p>
              <p className="text-sm text-gray-800">{patient?.address || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Emergency Contact</p>
              <p className="text-sm text-gray-800">
                {patient?.emergencyContact || "-"}
              </p>
            </div>
          </div>
        )}

        {active === "appointments" && (
          <div className="card space-y-2">
            {history?.appointments?.length ? (
              history.appointments.map((appt) => (
                <div key={appt._id} className="text-sm text-gray-700">
                  {appt.date} • {appt.timeSlot} • {appt.status}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No appointments yet.</p>
            )}
          </div>
        )}

        {active === "diagnosis" && (
          <div className="card space-y-2">
            {history?.diagnoses?.length ? (
              history.diagnoses.map((diag) => (
                <div key={diag._id} className="text-sm text-gray-700">
                  {new Date(diag.createdAt).toLocaleDateString()} •{" "}
                  {diag.symptoms}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No diagnosis logs yet.</p>
            )}
          </div>
        )}

        {active === "prescriptions" && (
          <div className="card space-y-2">
            {history?.prescriptions?.length ? (
              history.prescriptions.map((pres) => (
                <div key={pres._id} className="text-sm text-gray-700">
                  {new Date(pres.createdAt).toLocaleDateString()} •{" "}
                  {pres.medicines?.length} medicines
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No prescriptions yet.</p>
            )}
          </div>
        )}

        {active === "timeline" && (
          <MedicalTimeline items={history?.timeline || []} />
        )}
      </div>
    </PageWrapper>
  );
}
