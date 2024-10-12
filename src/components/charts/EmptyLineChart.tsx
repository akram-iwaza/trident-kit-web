import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components with ChartJS
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Define the options for the chart
const options: any = {
  scales: {
    x: {
      borderColor: "#29292B", // Set x-axis border color
      display: true, // Display x-axis
      grid: {
        display: false, // Hide grid lines
        drawBorder: true, // Show the x-axis border only
        borderColor: "#29292B", // Set x-axis border color
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false, // Hide grid lines
        drawBorder: true, // Show the y-axis border only
        borderColor: "#29292B", // Set y-axis border color
      },
      ticks: {
        color: "#999", // Color of y-axis labels
        maxTicksLimit: 5, // Limit the number of ticks to 5
        stepSize: 50, // Define the step size between ticks
        callback: function (value: number) {
          // Format the y-axis labels
          return value;
        },
      },
      max: 1000, // Maximum value for the y-axis
    },
  },
  plugins: {
    legend: {
      display: false, // Hide the legend
    },
  },
};

// Define the data for the chart
const data = {
  labels: ["", "", "", "", "", "", ""], // X-axis labels
  datasets: [
    {
      label: "", // No label
      data: [], // Empty data
      borderColor: "#29292B", // Line color
      borderWidth: 1,
    },
  ],
};

// React component
const EmptyLineChart: React.FC = () => {
  return (
    <div style={{ height: "231px", width: "100%" }}>
      {" "}
      {/* Background color to match the style */}
      <Line data={data} options={options} />
    </div>
  );
};

export default EmptyLineChart;
