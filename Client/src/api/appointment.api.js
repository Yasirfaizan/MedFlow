import api from "./axios";

export const bookAppointment = (payload) => api.post("/appointments", payload);
export const getAppointments = () => api.get("/appointments");

export const updateAppointmentStatus = (id, status) =>
  api.patch(`/appointments/${id}/status`, { status });
export const getDoctorSchedule = (date) =>
  api.get(`/appointments/schedule?date=${encodeURIComponent(date)}`);
