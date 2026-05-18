import { useEffect, useState } from "react";
import { Users, CalendarCheck } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import StatCard from "../../components/common/StatCard";
import { getPatients } from "../../api/patient.api";
import { getAppointments } from "../../api/appointment.api";
import toast from "react-hot-toast";

export default function ReceptionistDashboard() {
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    getPatients()
      .then((res) => setPatientCount(res.data.data.length || 0))
      .catch(() => toast.error("Unable to load patients"));

    getAppointments()
      .then((res) => setAppointmentCount(res.data.data.length || 0))
      .catch(() => toast.error("Unable to load appointments"));
  }, []);

  return (
    <PageWrapper
      title="Reception Dashboard"
      breadcrumb={["Receptionist", "Dashboard"]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total patients"
          value={patientCount}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Scheduled appointments"
          value={appointmentCount}
          icon={CalendarCheck}
          color="yellow"
        />
      </div>
    </PageWrapper>
  );
}
