import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AppointmentChart({ data = [] }) {
  const labels = data.map((d) => d._id);
  const values = data.map((d) => d.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Appointments",
        data: values,
        backgroundColor: "#1D9E75",
      },
    ],
  };

  return <Bar data={chartData} />;
}
