import api from "./axios";

export const createPatient = (payload) => api.post("/patients", payload);
export const getPatients = () => api.get("/patients");
export const getPatient = (id) => api.get(`/patients/${id}`);
export const updatePatient = (id, payload) =>
  api.patch(`/patients/${id}`, payload);
export const getPatientHistory = (id) => api.get(`/patients/${id}/history`);
