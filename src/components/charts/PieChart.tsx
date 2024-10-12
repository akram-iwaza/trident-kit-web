import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Legend, Tooltip);

interface PieChartProps {
  totals: {
    totalSuccess: number;
    totalFailed: number;
    totalInteractions?: number;
  };
}

const PieChart: React.FC<PieChartProps> = ({ totals }) => {
  const data = {
    labels: ["Success", "Failed", "Interactions"],
    datasets: [
      {
        label: "Totals",
        data: [
          totals.totalSuccess,
          totals.totalFailed,
          totals.totalInteractions,
        ],
        backgroundColor: [
          "#27B973",
          "#E33B32", // Failed - Reddish
          "#0A77FF", // Interactions - Bluish
        ],
        borderColor: [
          "rgba(255, 255, 255, 0.1)",
          "rgba(255, 255, 255, 0.1)",
          "rgba(255, 255, 255, 0.1)",
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Pie height={200} data={data} options={options} />
    </div>
  );
};

export default PieChart;
