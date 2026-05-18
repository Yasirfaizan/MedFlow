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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

export default function ForecastChart({ actual = [], projected = [] }) {
  const labels = [...actual, ...projected].map((p) => p.week);
  const actualData = actual.map((p) => p.count);
  const projectedData = projected.map((p) => p.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual",
        data: actualData,
        borderColor: "#1D9E75",
        backgroundColor: "rgba(29, 158, 117, 0.2)",
      },
      {
        label: "Projected",
        data: Array(actualData.length).fill(null).concat(projectedData),
        borderColor: "#EF9F27",
        backgroundColor: "rgba(239, 159, 39, 0.2)",
        borderDash: [6, 6],
      },
    ],
  };

  return <Line data={chartData} />;
}
