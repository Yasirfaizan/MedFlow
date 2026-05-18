import api from "./axios";

export const createPrescription = (payload) =>
  api.post("/prescriptions", payload);
export const getMyPrescriptions = () => api.get("/prescriptions/my");
export const getPatientPrescriptions = (patientId) =>
  api.get(`/prescriptions/patient/${patientId}`);
export const getPrescription = (id) => api.get(`/prescriptions/${id}`);
export const downloadPrescriptionPdf = (id) =>
  api.get(`/prescriptions/${id}/pdf`, { responseType: "blob" });

export const getAllPrescriptionsForAdmin = () => api.get(`/prescriptions`);
