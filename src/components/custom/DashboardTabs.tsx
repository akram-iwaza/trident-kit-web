import { FC, useState, useEffect } from "react";
import { ModeOption } from "../interfaces/global";
import React from "react"; // <-- Add this line
import { ModesOptionsTabs } from "../../lib/globalVariables";
import { cn } from "../../lib/utils";

interface IProps {
  onTabChange: (tab: string) => void;
  onSubTabChange: (subTab: string) => void;
}

const DashboardTabs: FC<IProps> = ({ onTabChange, onSubTabChange }) => {
  const [activeTab, setActiveTab] = useState(ModesOptionsTabs[0].value);
  const [activeSubTab, setActiveSubTab] = useState(
    ModesOptionsTabs[0].subTasks?.[0]?.value
  );

  const handleTabClick = (tab: ModeOption) => {
    setActiveTab(tab.value);
    onTabChange(tab.value);
    if (tab.subTasks?.length) {
      const firstSubTab = tab.subTasks[0].value;
      setActiveSubTab(firstSubTab);
      onSubTabChange(firstSubTab);
    }
  };

  const handleSubTabClick = (subTab: ModeOption) => {
    setActiveSubTab(subTab.value);
    onSubTabChange(subTab.value);
  };

  useEffect(() => {
    onTabChange(activeTab);
    onSubTabChange(activeSubTab!);
  }, []);

  return (
    <div className="w-full flex flex-col items-start sticky top-0 z-40 py-4 gap-3 bg-transparent ">
      {/* Main Tabs */}
      <div className="w-full flex space-x-4 bg-transparent  border-b-[1px] border-borderLight dark:border-borders">
        {ModesOptionsTabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              `flex items-center cursor-pointer p-2`,
              activeTab === tab.value &&
                "border-b-[1px] border-lightGreen dark:border-primary"
            )}
            onClick={() => handleTabClick(tab)}
          >
            <div className="bg-darkBlue  dark:bg-white h-6 w-6 rounded-full flex items-center justify-center">
              {tab.icon}
            </div>
            <span
              className={`ml-2 ${
                activeTab === tab.value
                  ? "text-default dark:text-white"
                  : "text-default dark:text-white"
              }`}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      {/* SubTabs */}
      <div className="w-fit border-b-[1px] border-borderLight dark:border-borders">
        {ModesOptionsTabs.map(
          (tab) =>
            activeTab === tab.value &&
            tab.subTasks && (
              <div key={tab.id} className="flex">
                {tab.subTasks.map((subTab) => (
                  <div
                    key={subTab.id}
                    className={cn(
                      `flex items-center cursor-pointer p-2 w-36`,
                      activeSubTab === subTab.value &&
                        "border-b-[1px] border-lightGreen dark:border-primary"
                    )}
                    onClick={() => handleSubTabClick(subTab)}
                  >
                    {subTab.icon}
                    <span
                      className={`ml-2 ${
                        activeSubTab === subTab.value
                          ? "text-default dark:text-white"
                          : "text-default dark:text-white"
                      }`}
                    >
                      {subTab.label}
                    </span>
                  </div>
                ))}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default DashboardTabs;
