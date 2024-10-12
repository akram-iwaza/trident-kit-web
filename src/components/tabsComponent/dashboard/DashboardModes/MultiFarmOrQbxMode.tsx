import React, { FC, useMemo, useState } from "react";
import useWindowSize from "../../../../hooks/useWindowSize";
import { Icons } from "../../../icons/Icons";
import TableComponentDashboard from "../../../custom/TableComponentDashboard";
import PieChart from "../../../charts/PieChart";
import LineChart from "../../../charts/LineChart";
import emptyProfileImage from "../../../../assets/emptyProfileImage.jpg";
import OverviewComponent from "../OverviewComponent";
import { toast } from "../../../ui/use-toast";

interface IPropsMultiFarmOrQbxMode {
  activeTab: string;
  activeSubTab: string;
  groups: any[];
  accountsData: IGroupAccounts[];
  isOpen: any;
}

interface Totals {
  totalSuccess: number;
  totalFailed: number;
  totalQbxInteractions?: number;
  totalInteractions?: number;
}

const MultiFarmOrQbxMode: FC<IPropsMultiFarmOrQbxMode> = ({
  activeTab,
  activeSubTab,
  groups,
  accountsData,
  isOpen,
}) => {
  const [privateKeyVisibility, setPrivateKeyVisibility] = useState<{
    [key: number]: boolean;
  }>({});
  const [view, setView] = useState<"totals" | "interactions">("interactions");

  const togglePrivateKeyVisibility = (index: number) => {
    setPrivateKeyVisibility((prevVisibility) => ({
      ...prevVisibility,
      [index]: !prevVisibility[index],
    }));
  };

  const isMultiFarm =
    activeTab.toLowerCase() === "socialify" &&
    activeSubTab.toLowerCase() === "multifarm";
  const isQBX =
    activeTab.toLowerCase() === "socialify" &&
    activeSubTab.toLowerCase() === "qbx";

  const interactionsObj = groups.find(
    (group) => group.interactions !== undefined
  );
  const interactions = interactionsObj ? interactionsObj.interactions : {};

  const QbxInteractionsObj = groups.find(
    (group) => group.QbxInteractions !== undefined
  );
  const QbxInteractions = QbxInteractionsObj
    ? QbxInteractionsObj.QbxInteractions
    : {};

  const accountsWithInteractions = accountsData
    .map((accountGroup) => {
      // Filter accounts based on interactions keys
      const filteredAccounts = accountGroup.myGroupAccounts.filter((account) =>
        interactions.hasOwnProperty(account.key)
      );

      // Map and attach interactions data to the filtered accounts
      return filteredAccounts.map((account) => {
        const interactionData = interactions[account.key] || {};
        return {
          ...account,
          interactions: {
            like: interactionData.Like || {},
            follow: interactionData.Follow || {},
            retweet: interactionData.Retweet || {},
            totalSuccess: interactionData.totalSuccess || 0,
            totalFailed: interactionData.totalFailed || 0,
            totalInteractions: interactionData.totalInteractions || 0,
          },
        };
      });
    })
    .flat();

  const accountsWithQbxInteractions = accountsData
    .map((accountGroup) => {
      // Filter accounts based on QbxInteractions keys
      const filteredAccounts = accountGroup.myGroupAccounts.filter((account) =>
        QbxInteractions.hasOwnProperty(account.key)
      );

      // Map and attach qbxInteractions data to the filtered accounts
      return filteredAccounts.map((account) => {
        const qbxInteractionData = QbxInteractions[account.key] || {};
        return {
          ...account,
          qbxInteractions: {
            follow: qbxInteractionData.Follow || {},
            visitTweet: qbxInteractionData.VisitTweet || {},
            joinTelegram: qbxInteractionData.JoinTelegram || {},
            changeTwitterName: qbxInteractionData.ChangeTwitterName || {},
            totalSuccess: qbxInteractionData.totalSuccess || 0,
            totalFailed: qbxInteractionData.totalFailed || 0,
            totalInteractions: qbxInteractionData.totalInteractions || 0,
          },
        };
      });
    })
    .flat();

  const getTotals = (activeSubTab: string) => {
    if (activeSubTab.toLowerCase() === "qbx") {
      const totalSuccess = Object.values(QbxInteractions).reduce(
        (sum, item: any) => sum + (item.totalSuccess || 0),
        0
      );
      const totalFailed = Object.values(QbxInteractions).reduce(
        (sum, item: any) => sum + (item.totalFailed || 0),
        0
      );
      const totalQbxInteractions = Object.values(QbxInteractions).reduce(
        (sum, item: any) => sum + (item.totalQbxInteractions || 0),
        0
      );
      return {
        totalSuccess,
        totalFailed,
        totalInteractions: totalQbxInteractions,
      };
    } else if (activeSubTab.toLowerCase() === "multifarm") {
      const totalSuccess = Object.values(interactions).reduce(
        (sum, item: any) => sum + (item.totalSuccess || 0),
        0
      );
      const totalFailed = Object.values(interactions).reduce(
        (sum, item: any) => sum + (item.totalFailed || 0),
        0
      );
      const totalInteractions = Object.values(interactions).reduce(
        (sum, item: any) => sum + (item.totalInteractions || 0),
        0
      );
      return { totalSuccess, totalFailed, totalInteractions };
    }
    return { totalSuccess: 0, totalFailed: 0, totalInteractions: 0 }; // Ensure all fields are defined
  };

  const totals = getTotals(activeSubTab) as Totals;

  const { width } = useWindowSize();

  const availableWidth = width ? width - (isOpen ? 180 : 100) : 0;
  const fixedColumnWidths = [
    { label: "Avatar", dataKey: "profileImage", width: 80 },
    { label: "Mode", dataKey: "Mode", width: 100 },
    { label: "accountName", dataKey: "accountName", width: 150 },
    { label: "Wallet Key", dataKey: "privateKey", width: 200 },
    { label: "Email", dataKey: "email", width: 200 },
    { label: "Actions", dataKey: "actions", width: 300 },
  ];
  const totalFixedWidth = fixedColumnWidths.reduce(
    (acc, col) => acc + col.width,
    0
  );
  const scalingFactor = availableWidth ? availableWidth / totalFixedWidth : 1;
  const scaledColumns = fixedColumnWidths.map((col) => ({
    ...col,
    width: Math.floor(col.width * scalingFactor),
  }));
  const tasks: any = isMultiFarm
    ? accountsWithInteractions
    : accountsWithQbxInteractions;

  const columns: Array<{
    label: string;
    dataKey: string;
    width: number;
    cellRenderer?: (props: any) => React.ReactNode;
  }> = useMemo(() => {
    return scaledColumns.map((col) => {
      if (col.dataKey === "profileImage") {
        return {
          ...col,
          cellRenderer: ({ rowIndex }: { rowIndex: number }) => (
            <div className="w-6 h-6 relative rounded-full bg-white">
              <img
                alt="profileImg"
                src={
                  tasks[rowIndex]?.profileImage
                    ? tasks[rowIndex]?.profileImage.toLowerCase() === "empty"
                      ? emptyProfileImage
                      : tasks[rowIndex]?.profileImage
                    : emptyProfileImage
                }
                className="w-6 h-6 relative rounded-full"
              />
            </div>
          ),
        };
      }
      if (col.dataKey === "Mode") {
        return {
          ...col,
          cellRenderer: () => {
            return isMultiFarm ? "MultiFarm" : "QBX";
          },
        };
      }
      if (col.dataKey === "privateKey") {
        return {
          ...col,
          cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
            const key = tasks[rowIndex][col.dataKey as keyof wallet];
            const isPrivateKeyVisible = privateKeyVisibility[rowIndex];
            return (
              <div className="w-full flex items-center justify-start">
                <span
                  className="max-w-full truncate cursor-pointer"
                  onDoubleClick={() => {
                    navigator.clipboard.writeText(key);
                    toast({
                      variant: "success",
                      title: `${col.label} copied`,
                    });
                  }}
                >
                  {col.dataKey === "privateKey" && !isPrivateKeyVisible
                    ? "**********************************************************"
                    : key}
                </span>
                {col.dataKey === "privateKey" && (
                  <button onClick={() => togglePrivateKeyVisibility(rowIndex)}>
                    {isPrivateKeyVisible ? <Icons.EyeSlash /> : <Icons.Eye />}
                  </button>
                )}
              </div>
            );
          },
        };
      }
      if (col.dataKey === "actions") {
        return {
          ...col,
          cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
            return (
              <div className="w-full grid grid-cols-3 gap-2 group">
                <div className="w-full flex flex-col items-center gap-2">
                  <div className="text-xs text-[#0A77FF] font-normal">
                    Interactions
                  </div>
                  <span className="text-xs text-[#0A77FF] font-normal">
                    {isMultiFarm
                      ? tasks[rowIndex]?.interactions?.totalInteractions
                      : tasks[rowIndex]?.qbxInteractions?.totalInteractions}
                  </span>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                  <span className="text-xs text-[#27B973] font-normal">
                    Success
                  </span>
                  <span className="text-xs text-[#27B973] font-normal">
                    {isMultiFarm
                      ? tasks[rowIndex]?.interactions?.totalSuccess
                      : tasks[rowIndex]?.qbxInteractions?.totalSuccess}
                  </span>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                  <span className="text-xs text-[#E33B32] font-normal">
                    Failed
                  </span>
                  <span className="text-xs text-[#E33B32] font-normal">
                    {isMultiFarm
                      ? tasks[rowIndex]?.interactions?.totalFailed
                      : tasks[rowIndex]?.qbxInteractions?.totalFailed}
                  </span>
                </div>
              </div>
            );
          },
        };
      }
      return col;
    });
  }, [scaledColumns, accountsWithInteractions, accountsWithQbxInteractions]);

  const isLengthZero =
    accountsWithInteractions.length > 0 &&
    accountsWithQbxInteractions.length > 0;

  const areTotalsZero = Object.values(totals).every((value) => value === 0);
  const noDataFound =
    areTotalsZero &&
    tasks &&
    tasks.length === 0 &&
    ((accountsWithInteractions && accountsWithInteractions.length === 0) ||
      (accountsWithQbxInteractions &&
        accountsWithQbxInteractions.length === 0));

  if (noDataFound) {
    return (
      <div className="w-full relative h-[33rem] flex items-center justify-center">
        <h2 className="text-xs-plus font-bold text-white">No Data Found</h2>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-start relative">
      {(isMultiFarm || isQBX) && !areTotalsZero && (
        <div className="w-full flex flex-col items-start relative gap-[15px]">
          <div className="w-full flex flex-col">
            {/* <div className="flex justify-end items-end w-full">
                            <select value={view} onChange={(e) => setView(e.target.value as 'totals' | 'interactions')} className="p-2 rounded border">
                                <option value="totals">Totals Overview</option>
                                <option value="interactions">Interactions Overview</option>
                            </select>
                        </div> */}
            <div className="w-full flex items-center h-[325px] gap-[15px]">
              <div className="w-[70%] h-full bg-white dark:bg-backgroundInput  rounded-[14px] border border-borderLight dark:border-[#29292B]  shadow-[0_4px_30px_rgba(0,0,0,0.1)] ">
                <OverviewComponent
                  accountsWithInteractions={
                    isMultiFarm
                      ? accountsWithInteractions
                      : accountsWithQbxInteractions
                  }
                  isMultiFarm={isMultiFarm}
                  totals={totals}
                  view={view}
                />
              </div>
              <div className="w-[30%] flex flex-col items-start h-full bg-white dark:bg-backgroundInput  rounded-[14px] border border-borderLight dark:border-[#29292B]  shadow-[0_4px_30px_rgba(0,0,0,0.1)] ">
                <div className="w-full border-b-[1px] border-borderLight dark:border-[#29292B]">
                  <div className="w-full p-[14px]">
                    <span className="text-default dark:text-white text-base font-normal">
                      Transaction Status
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col items-start p-[22px] gap-[33px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center bg-[#1a2534]">
                      <Icons.Dollar className="w-[21.13px] h-[21.13px]" />
                    </div>
                    <div className="flex flex-col items-start gap-[5px]">
                      <span className="text-default dark:text-white text-base font-normal">
                        Total Interactions
                      </span>
                      <span className="text-placeholder  text-[14px] font-normal">
                        {isMultiFarm
                          ? totals &&
                            totals?.totalInteractions &&
                            totals.totalInteractions
                          : totals &&
                            totals?.totalInteractions &&
                            totals.totalInteractions}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center bg-[#1d2b26]">
                      <Icons.Check className="w-[21.13px] h-[21.13px]" />
                    </div>
                    <div className="flex flex-col items-start gap-[5px]">
                      <span className="text-default dark:text-white text-base font-normal">
                        Successful Interactions
                      </span>
                      <span className="text-placeholder  text-[14px] font-normal">
                        {totals && totals?.totalSuccess && totals.totalSuccess}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center bg-[#301f20]">
                      <Icons.Times className="w-[21.13px] h-[21.13px]" />
                    </div>
                    <div className="flex flex-col items-start gap-[5px]">
                      <span className="text-default dark:text-white text-base font-normal">
                        Failed Interactions
                      </span>
                      <span className="text-placeholder  text-[14px] font-normal">
                        {totals && totals?.totalFailed && totals.totalFailed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tasks && tasks.length > 0 && (
            <TableComponentDashboard
              tasks={tasks}
              columns={columns}
              isOpen={isOpen}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MultiFarmOrQbxMode;
