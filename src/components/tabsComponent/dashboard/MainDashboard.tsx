import React, { FC, useEffect, useState } from "react";
import MultiFarmOrQbxMode from "./DashboardModes/MultiFarmOrQbxMode";
import EmptyMainDashboard from "./EmptyMainDashboard";
import useFetchV3 from "../../../hooks/useFetchV3";
import DashboardPageSkeleton from "../../skeletons/DashboardPageSkeleton";
import DashboardTabs from "../../custom/DashboardTabs";
import TableComponentDashboard from "../../custom/TableComponentDashboard";
import OverviewComponent from "./OverviewComponent";
import { Icons } from "../../icons/Icons";
interface IProps {
  isOpen: any;
  isReady: boolean;
}

const tasks = [
  {
    key: "task-1",
    accountName: "John Doe",
    wallet: "0x123456789abcdef",
    walletGroup: "Group A",
    email: "john.doe@example.com",
    actions: {
      success: 50,
      failed: 10,
      total: 60,
    },
  },
  {
    key: "task-2",
    accountName: "Jane Smith",
    wallet: "0xfedcba987654321",
    walletGroup: "Group B",
    email: "jane.smith@example.com",
    actions: {
      success: 75,
      failed: 5,
      total: 80,
    },
  },
  {
    key: "task-3",
    accountName: "Mike Brown",
    wallet: "0xabcdef123456789",
    walletGroup: "Group C",
    email: "mike.brown@example.com",
    actions: {
      success: 100,
      failed: 20,
      total: 120,
    },
  },
  {
    key: "task-5",
    accountName: "Micheal",
    wallet: "0xabcdef123456789",
    walletGroup: "Group C",
    email: "mike.brown@example.com",
    actions: {
      success: 100,
      failed: 20,
      total: 120,
    },
  },
];

const columns = [
  { label: "Account Name", dataKey: "accountName", width: 200 },
  { label: "Wallet", dataKey: "wallet", width: 300 },
  { label: "Wallet Group", dataKey: "walletGroup", width: 150 },
  { label: "Email", dataKey: "email", width: 250 },
  {
    label: "Actions",
    dataKey: "actions",
    width: 300,
    cellRenderer: ({ cellData }: { cellData: any }) => (
      <div className="w-full grid grid-cols-3 gap-2 group">
        <div className="w-full flex flex-col items-center gap-2">
          <div className="text-xs text-[#0A77FF] font-normal">Interactions</div>
          <span className="text-xs text-[#0A77FF] font-normal">
            {cellData.total}
          </span>
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          <span className="text-xs text-[#27B973] font-normal">Success</span>
          <span className="text-xs text-[#27B973] font-normal">
            {cellData.success}
          </span>
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          <span className="text-xs text-[#E33B32] font-normal">Failed</span>
          <span className="text-xs text-[#E33B32] font-normal">
            {cellData.failed}
          </span>
        </div>
      </div>
    ),
  },
];

type SubTabName =
  | "Scroll"
  | "ZkysyncEra"
  | "Contract Minting"
  | "Magiceden Sniper"
  | "Tensor"
  | "Magiceden Farmer"
  | "MultiFarm"
  | "QBX";

const MainDashboard: FC<IProps> = ({ isOpen, isReady }) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeSubTab, setActiveSubTab] = useState<string>("");

  const groups: any = [
    {
      MultiFarm: {
        "John Doe": {
          Like: { success: 2, failed: 0 },
          Follow: { success: 5, failed: 0 },
          Retweet: { success: 3, failed: 0 },
          totalSuccess: 10,
          totalFailed: 0,
          totalInteractions: 10,
        },
        "Jane Smith": {
          Like: { success: 2, failed: 0 },
          Follow: { success: 1, failed: 0 },
          Retweet: { success: 3, failed: 0 },
          totalSuccess: 6,
          totalFailed: 0,
          totalInteractions: 6,
        },
        "Mike Brown": {
          Like: { success: 2, failed: 0 },
          Follow: { success: 3, failed: 0 },
          Retweet: { success: 3, failed: 0 },
          totalSuccess: 8,
          totalFailed: 0,
          totalInteractions: 8,
        },
        totalSuccess: 24,
        totalFailed: 0,
        totalInteractions: 24,
      },
    },
    {
      QBX: {
        Micheal: {
          Follow: { success: 3, failed: 0 },
          JoinTelegram: { success: 7, failed: 0 },
          VisitTweet: { success: 2, failed: 0 },
          ChangeTwitterName: { success: 9, failed: 0 },
          totalSuccess: 21,
          totalFailed: 0,
          totalInteractions: 21,
        },
        "Jane Smith": {
          Follow: { success: 3, failed: 0 },
          JoinTelegram: { success: 7, failed: 0 },
          VisitTweet: { success: 2, failed: 0 },
          ChangeTwitterName: { success: 9, failed: 0 },
          totalSuccess: 21,
          totalFailed: 0,
          totalInteractions: 21,
        },
        totalSuccess: 42,
        totalFailed: 0,
        totalInteractions: 42,
      },
    },
    {
      Scroll: {
        "Alice Johnson": {
          Like: { success: 5, failed: 2 },
          Follow: { success: 10, failed: 1 },
          totalSuccess: 15,
          totalFailed: 3,
          totalInteractions: 18,
        },
        totalSuccess: 15,
        totalFailed: 3,
        totalInteractions: 18,
      },
    },
    {
      ZkysyncEra: {
        "Bob Smith": {
          Like: { success: 4, failed: 1 },
          Follow: { success: 8, failed: 0 },
          totalSuccess: 12,
          totalFailed: 1,
          totalInteractions: 13,
        },
        totalSuccess: 12,
        totalFailed: 1,
        totalInteractions: 13,
      },
    },
    {
      Tensor: {
        "Eve Torres": {
          Like: { success: 6, failed: 0 },
          Follow: { success: 7, failed: 1 },
          totalSuccess: 13,
          totalFailed: 1,
          totalInteractions: 14,
        },
        totalSuccess: 13,
        totalFailed: 1,
        totalInteractions: 14,
      },
    },
  ];

  const { data: accountsData } = useFetchV3<IGroupAccounts[]>("MyAccountsData");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab);
  };

  const checkActiveSubTabData = () => {
    if (!activeSubTab) return false;
    if (!activeTab) return false;

    if (activeSubTab === "MultiFarm") {
      const interactionsGroup = groups.find(
        (group: { interactions: undefined }) => group.interactions !== undefined
      );
      return (
        interactionsGroup &&
        Object.keys(interactionsGroup.interactions).length > 0
      );
    } else if (activeSubTab === "QBX") {
      const qbxGroup = groups.find(
        (group: { QbxInteractions: undefined }) =>
          group.QbxInteractions !== undefined
      );
      return qbxGroup && Object.keys(qbxGroup.QbxInteractions).length > 0;
    }
    //  else if (activeTab === 'Contract Minting' || activeTab === 'Magiceden Sniper') {
    //     const activeTabGroup = groups.find(group => group[activeTab] !== undefined);
    //     if (!activeTabGroup) {
    //         return false;
    //     }
    //     const activeTabData = activeTabGroup[activeTab];
    //     return activeTabData && Object.keys(activeTabData).length > 0;
    // }
    else {
      const group = groups.find(
        (group: { [x: string]: undefined }) => group[activeSubTab] !== undefined
      );
      if (!group) {
        return false;
      }
      const data = group[activeSubTab];
      return data && Object.keys(data).length > 0;
    }
  };
  const hasData = checkActiveSubTabData();

  const getActiveSubTabData = () => {
    if (!activeSubTab) return null;

    const group = groups.find(
      (group: { [key: string]: any }) => group[activeSubTab] !== undefined
    );
    if (!group) return null;
    return group[activeSubTab];
  };

  const activeSubTabData = getActiveSubTabData();

  const accountsWithInteractions = groups
    .map(
      (group: {
        interactions: { [s: string]: unknown } | ArrayLike<unknown>;
        QbxInteractions: { [s: string]: unknown } | ArrayLike<unknown>;
      }) => {
        if (group.interactions) {
          return Object.entries(group.interactions)
            .map(([accountName, details]: any) => {
              if (typeof details === "object") {
                return {
                  accountName,
                  interactions: details,
                };
              }
              return null;
            })
            .filter((item) => item);
        } else if (group.QbxInteractions) {
          return Object.entries(group.QbxInteractions)
            .map(([accountName, details]: any) => {
              if (typeof details === "object") {
                return {
                  accountName,
                  qbxInteractions: details,
                };
              }
              return null;
            })
            .filter((item) => item);
        }
        return null;
      }
    )
    .flat()
    .filter(Boolean);

  // Example data for the view
  const view = "interactions"; // or 'totals'
  const isMultiFarm = true;

  return (
    <div className="w-full flex flex-col items-start relative px-6 pb-4">
      <DashboardTabs
        onTabChange={handleTabChange}
        onSubTabChange={handleSubTabChange}
      />
      <div className="w-full flex items-center h-[325px] gap-[15px]">
        <div className="w-[70%] h-full bg-white dark:bg-backgroundInput rounded-[14px] border border-borderLight dark:border-[#29292B]">
          {activeSubTabData && (
            <OverviewComponent
              accountsWithInteractions={Object.entries(activeSubTabData).map(
                ([accountName, details]: any) => ({
                  accountName,
                  interactions: details,
                })
              )}
              totals={{
                totalSuccess: activeSubTabData.totalSuccess || 0,
                totalFailed: activeSubTabData.totalFailed || 0,
                totalInteractions: activeSubTabData.totalInteractions || 0,
              }}
              view="interactions"
              isMultiFarm={activeTab === "MultiFarm"}
            />
          )}
        </div>
        <div className="w-[30%] flex flex-col items-start h-full bg-white dark:bg-backgroundInput rounded-[14px] border border-borderLight dark:border-[#29292B]">
          <div className="w-full border-b-[1px] border-borderLight dark:border-[#29292B] p-[14px]">
            <span className="text-default dark:text-white text-base font-normal">
              Transaction Status
            </span>
          </div>
          {activeSubTabData && (
            <div className="w-full flex flex-col items-start p-[22px] gap-[33px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center bg-[#1a2534]">
                  <Icons.Dollar className="w-[21.13px] h-[21.13px]" />
                </div>
                <div className="flex flex-col items-start gap-[5px]">
                  <span className="text-default dark:text-white text-base font-normal">
                    Total Interactions
                  </span>
                  <span className="text-placeholder text-[14px] font-normal">
                    {activeSubTabData.totalInteractions || 0}
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
                  <span className="text-placeholder text-[14px] font-normal">
                    {activeSubTabData.totalSuccess || 0}
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
                  <span className="text-placeholder text-[14px] font-normal">
                    {activeSubTabData.totalFailed || 0}
                  </span>
                </div>
              </div>
            </div>
          )}
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
  );
};

export default MainDashboard;
