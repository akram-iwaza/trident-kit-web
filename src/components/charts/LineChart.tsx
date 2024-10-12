import React, { FC } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AccountData {
  accountName: string;
  interactions?: {
    follow: { success: number; failed: number };
    like: { success: number; failed: number };
    retweet: { success: number; failed: number };
    totalSuccess: number;
    totalFailed: number;
  };
  qbxInteractions?: {
    follow: { success: number; failed: number };
    changeTwitterName?: { success: number; failed: number };
    joinTelegram?: { success: number; failed: number };
    visitTweet?: { success: number; failed: number };
    totalSuccess: number;
    totalFailed: number;
  };
}

interface IPropsBarChart {
  accountsWithInteractions: AccountData[];
  isMultiFarm: boolean;
}

const BarChart: FC<IPropsBarChart> = ({
  accountsWithInteractions,
  isMultiFarm,
}) => {
  console.log("accountsWithInteractions: ", accountsWithInteractions);

  // Filter accounts that have valid interaction data
  const validAccounts = accountsWithInteractions.filter(
    (account) => account?.interactions?.totalSuccess !== undefined
  );

  // Extract account names and their total success
  const accountNames = validAccounts.map((account) => account.accountName);

  const totalSuccesses: any = validAccounts.map(
    (account) => account?.interactions?.totalSuccess
  );

  console.log("Filtered account names: ", accountNames);
  console.log("Filtered total successes: ", totalSuccesses);

  // Get the maximum value in totalSuccesses
  const maxTotalSuccess = Math.max(...totalSuccesses);

  // Define different colors for each bar
  const backgroundColors = [
    "#ff6384",
    "#36a2eb",
    "#cc65fe",
    "#ffce56",
    "#4bc0c0",
    "#f7797d",
  ];

  const chartData = {
    labels: accountNames, // Use account names as labels
    datasets: [
      {
        label: "Total Success",
        data: totalSuccesses, // Data corresponds to total successes
        backgroundColor: backgroundColors.slice(0, validAccounts.length), // Slice colors for the number of valid accounts
        borderColor: backgroundColors.slice(0, validAccounts.length),
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Display the legend
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0, // Set the minimum value for the Y-axis
        max: maxTotalSuccess > 0 ? maxTotalSuccess + 10 : 100, // Dynamically set max Y-axis value based on data
        grid: {
          display: true,
        },
      },
    },
  };

  return (
    <div style={{ height: "231px", width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
