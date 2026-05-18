import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DiagnosisChart({ data = [] }) {
  const labels = data.map((d) => d._id);
  const values = data.map((d) => d.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Top Diagnoses",
        data: values,
        backgroundColor: [
          "#1D9E75",
          "#EF9F27",
          "#E24B4A",
          "#4F46E5",
          "#0EA5E9",
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
}
