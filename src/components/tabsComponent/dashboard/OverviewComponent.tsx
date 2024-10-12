import React from "react";
import PieChart from "../../charts/PieChart";
import LineChart from "../../charts/LineChart";

interface OverviewProps {
  totals: {
    totalSuccess: number;
    totalFailed: number;
    totalInteractions?: number;
  };
  accountsWithInteractions: any[];
  isMultiFarm?: boolean;
  view: string;
}

const OverviewComponent: React.FC<OverviewProps> = ({
  totals,
  accountsWithInteractions,
  isMultiFarm,
  view,
}) => {
  // Determine the data to pass to the charts based on the selected view
  const dataForChart =
    view === "totals"
      ? {
          totalSuccess: totals.totalSuccess,
          totalFailed: totals.totalFailed,
          totalInteractions: totals.totalInteractions || 0,
        }
      : {
          totalSuccess: accountsWithInteractions.reduce(
            (acc, account) =>
              acc +
              (isMultiFarm
                ? account.interactions?.totalSuccess || 0
                : account.qbxInteractions?.totalSuccess || 0),
            0
          ),
          totalFailed: accountsWithInteractions.reduce(
            (acc, account) =>
              acc +
              (isMultiFarm
                ? account.interactions?.totalFailed || 0
                : account.qbxInteractions?.totalFailed || 0),
            0
          ),
          totalInteractions: accountsWithInteractions.length,
        };

  return (
    <div className="flex flex-col items-start h-full">
      <div className="w-full border-b-[1px] border-borderLight dark:border-[#29292B]">
        <div className="p-[14px]">
          <span className="text-default dark:text-white text-base font-normal">
            Success Metrics by Account Name
          </span>
        </div>
      </div>
      <div className="w-full p-[22px]">
        {view === "totals" ? (
          <PieChart totals={dataForChart} />
        ) : (
          <LineChart
            accountsWithInteractions={accountsWithInteractions}
            isMultiFarm={isMultiFarm ?? false}
          />
        )}
      </div>
    </div>
  );
};

export default OverviewComponent;
