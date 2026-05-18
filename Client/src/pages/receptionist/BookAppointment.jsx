import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import AppointmentForm from "../../components/appointments/AppointmentForm";
import SlotPicker from "../../components/appointments/SlotPicker";
import { bookAppointment } from "../../api/appointment.api";
import { getPatients } from "../../api/patient.api";
import api from "../../api/axios";
import toast from "react-hot-toast";

const initialForm = {
  patientId: "",
  doctorId: "",
  date: "",
  timeSlot: "",
  notes: "",
};

export default function BookAppointment() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPatients()
      .then((res) => setPatients(res.data.data || []))
      .catch(() => toast.error("Failed to load patients"));

    api
      .get("/users?role=doctor")
      .then((res) => setDoctors(res.data.data || []))
      .catch(() => toast.error("Failed to load doctors"));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    ["patientId", "doctorId", "date", "timeSlot"].forEach((field) => {
      if (!form[field]) nextErrors[field] = "Required";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      await bookAppointment(form);
      toast.success("Appointment booked");
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="Book Appointment"
      breadcrumb={["Receptionist", "Book Appointment"]}
    >
      <form onSubmit={onSubmit} className="card space-y-4">
        <AppointmentForm
          values={form}
          onChange={setForm}
          doctors={doctors}
          patients={patients}
        />
        <div>
          <p className="text-sm text-gray-500 mb-2">Pick time slot</p>
          <SlotPicker
            value={form.timeSlot}
            onChange={(slot) => setForm({ ...form, timeSlot: slot })}
          />
        </div>
        {Object.keys(errors).length > 0 && (
          <p className="text-xs text-red-500">
            Please select patient, doctor, date, and time slot.
          </p>
        )}
        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </PageWrapper>
  );
}
