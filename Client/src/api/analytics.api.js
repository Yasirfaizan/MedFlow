import api from "./axios";

export const getAdminStats = () => api.get("/analytics/admin");
export const getDoctorStats = () => api.get("/analytics/doctor");
export const getPredictiveAnalytics = () => api.get("/analytics/predictive");
