import { useEffect, useState } from "react";
import { Calendar, FileText, Brain, Activity } from "lucide-react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import PageWrapper from "../../components/layout/PageWrapper";
import StatCard from "../../components/common/StatCard";
import { getDoctorStats } from "../../api/analytics.api";
import toast from "react-hot-toast";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

export default function DoctorDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDoctorStats()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error("Failed to load stats"));
  }, []);

  const trendLabels = (stats?.monthlyTrend || []).map(
    (t) => `${t._id.month}/${t._id.year}`,
  );
  const trendCounts = (stats?.monthlyTrend || []).map((t) => t.count);

  const chartData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Monthly Appointments",
        data: trendCounts,
        borderColor: "#1D9E75",
        backgroundColor: "rgba(29, 158, 117, 0.2)",
      },
    ],
  };

  return (
    <PageWrapper title="Doctor Dashboard" breadcrumb={["Doctor", "Dashboard"]}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Today's Appointments"
            value={stats?.todayAppts || 0}
            icon={Calendar}
            color="primary"
          />
          <StatCard
            title="Monthly Appointments"
            value={stats?.monthlyAppts || 0}
            icon={Activity}
            color="blue"
          />
          <StatCard
            title="Prescriptions"
            value={stats?.totalPrescriptions || 0}
            icon={FileText}
            color="yellow"
          />
          <StatCard
            title="AI Symptom Checks"
            value={stats?.totalAIChecks || 0}
            icon={Brain}
            color="red"
          />
        </div>

        <div className="card">
          <h3 className="font-medium text-gray-800 mb-4">
            Monthly Appointment Trend
          </h3>
          <Line data={chartData} />
        </div>
      </div>
    </PageWrapper>
  );
}
