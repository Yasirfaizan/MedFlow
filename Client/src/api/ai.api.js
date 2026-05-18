import api from "./axios";

export const symptomCheck = (payload) => api.post("/ai/symptom-check", payload);
export const explainPrescription = (payload) =>
  api.post("/ai/explain-prescription", payload);
export const getRiskFlags = (patientId) =>
  api.get(`/ai/risk-flags/${patientId}`);
