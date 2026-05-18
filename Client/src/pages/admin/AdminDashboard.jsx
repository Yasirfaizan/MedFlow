import { useEffect, useState } from "react";
import { Users, Stethoscope, Calendar } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import StatCard from "../../components/common/StatCard";
import AppointmentChart from "../../components/charts/AppointmentChart";
import DiagnosisChart from "../../components/charts/DiagnosisChart";
import ForecastChart from "../../components/charts/ForecastChart";
import PlanGate from "../../components/common/PlanGate";
import { useAuth } from "../../context/AuthContext";
import { getAdminStats, getPredictiveAnalytics } from "../../api/analytics.api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [predictive, setPredictive] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error("Failed to load stats"))
      .finally(() => setLoading(false));

    if (user?.subscriptionPlan === "pro") {
      getPredictiveAnalytics()
        .then((res) => setPredictive(res.data.data))
        .catch(() => toast.error("Failed to load predictive analytics"));
    }
  }, []);

  if (loading)
    return (
      <PageWrapper title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper title="Admin Dashboard" breadcrumb={["Admin", "Dashboard"]}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Patients"
            value={stats?.totalPatients || 0}
            icon={Users}
            color="primary"
          />
          <StatCard
            title="Total Doctors"
            value={stats?.totalDoctors || 0}
            icon={Stethoscope}
            color="blue"
          />
          <StatCard
            title="Monthly Appointments"
            value={stats?.monthlyAppointments || 0}
            icon={Calendar}
            color="yellow"
          />
          <StatCard
            title="Receptionists"
            value={stats?.totalReceptionists || 0}
            icon={Users}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card">
            <h3 className="font-medium text-gray-800 mb-4">
              Appointments by Status
            </h3>
            <AppointmentChart data={stats?.appointmentsByStatus || []} />
          </div>

          <div className="card">
            <h3 className="font-medium text-gray-800 mb-4">Top Diagnoses</h3>
            {stats?.topDiagnoses?.length > 0 ? (
              <DiagnosisChart data={stats.topDiagnoses} />
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                No diagnosis data yet
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-medium text-gray-800 mb-4">
            Patient Load Forecast
          </h3>
          {user?.subscriptionPlan === "pro" ? (
            <ForecastChart
              actual={predictive?.patientLoad?.actual || []}
              projected={predictive?.patientLoad?.projected || []}
            />
          ) : (
            <PlanGate feature="Predictive analytics" />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
