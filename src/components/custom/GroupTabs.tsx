import React, { useState, useRef, useEffect } from "react";
import { Icons } from "../icons/Icons";
import useLocalStorageManager from "../../hooks/useLocalStorageManager";

interface TaskGroup {
  tab: string;
  category: string;
}

interface IGroupTabsProps {
  tabs: TaskGroup[] | string[];
  onAddTab: () => void;
  onTabClick: (tab: string) => void;
  selectedTab: string;
  onEditClick: (tab: string, newTabName: string) => void;
  onDeleteClick: (tab: string) => void;
  onTabsReorder: (newTabs: any[]) => void;
  showInput?: boolean;
  id?: string;
  setTabValue?: any;
  tabContainerRef: any;
  setGroups: any;
  type: string;
}

const GroupTabs: React.FC<IGroupTabsProps> = ({
  tabs,
  onAddTab,
  onTabClick,
  selectedTab,
  onEditClick,
  onDeleteClick,
  onTabsReorder,
  id,
  setTabValue,
  tabContainerRef,
  setGroups,
  type,
}) => {
  const manageLocalStorage = useLocalStorageManager();
  const typeValue =
    type === "task"
      ? "groupsTask"
      : type === "wallet"
      ? "groupsWallet"
      : type === "proxy"
      ? "groupsProxy"
      : type === "account"
      ? "groupsAccount"
      : ""; // or you can return a default value if needed

  const storedGroups = localStorage.getItem(typeValue);
  // If `storedGroups` is not null, parse it. Otherwise, initialize `groups` as an empty array.
  const groups: any[] = storedGroups ? JSON.parse(storedGroups) : [];

  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [newTabName, setNewTabName] = useState<string>("");
  const [draggingTab, setDraggingTab] = useState<number | null>(null);

  const handleDoubleClick = (tab: string) => {
    setEditingTab(tab);
    setNewTabName(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTabName(e.target.value);
  };

  const handleInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    tab: string
  ) => {
    if (e.key === "Enter") {
      onEditClick(tab, newTabName);
      setEditingTab(null);
    }
  };

  const handleBlur = (tab: string) => {
    onEditClick(tab, newTabName);
    setEditingTab(null);
  };

  const handleDragStart = (index: number) => {
    setDraggingTab(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggingTab === null) return;

    const newTabs = [...tabs];
    const [draggedTab] = newTabs.splice(draggingTab, 1);
    newTabs.splice(index, 0, draggedTab);
    onTabsReorder(newTabs);
    setDraggingTab(null);
  };

  const getIconForCategory = (category: any) => {
    switch (category.toLowerCase().trim()) {
      case "twitter":
        return (
          <Icons.Twitter className="w-4 h-[0.9rem] text-default dark:text-white" />
        );
      case "discord":
        return <Icons.Discord className="w-5 h-5" />;
      case "link":
      case "link-twitter-to-wallet":
      case "link-twitter-to-discord":
      case "link-discord-to-twitter":
      case "link-discord-to-wallet":
        return (
          <Icons.Connect className="w-5 h-5 text-default dark:text-white" />
        );
      case "multifarm":
        return <Icons.Multifarm className="w-5 h-5 rounded-full" />;
      case "qbx":
        return <Icons.QBX className="w-5 h-5 rounded-full bg-white" />;
      case "scroll":
        return <Icons.Scroll className="w-5 h-5 rounded-full bg-white" />;
      case "zkysyncera":
        return <Icons.Era className="w-5 h-5 rounded-full bg-white" />;
      case "blur":
        return <Icons.Blur className="w-5 h-5 rounded-full bg-white" />;
      case "districtone":
        return <Icons.DistrictOne className="w-5 h-5 rounded-full bg-white" />;
      case "tensor":
        return <Icons.Tensor className="w-5 h-5 rounded-full bg-white" />;

      case "opensea bidder":
        return (
          <Icons.OpenSeaBidder className="w-5 h-5 rounded-full bg-white" />
        );
      case "magiceden farmer":
        return <Icons.MagicEden className="w-5 h-5 rounded-full bg-white" />;
      case "magiceden sniper":
        return <Icons.MagicEden className="w-5 h-5 rounded-full bg-white" />;
      case "contract minting":
        return <Icons.Mint className="w-5 h-5 rounded-full bg-white" />;
      case "opensea":
        return <Icons.Opensea className="w-5 h-5 rounded-full bg-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center h-fit border-b-[1px] border-borderLight dark:border-[#505a69] w-full">
      <div
        className="flex items-center gap-6 h-10 overflow-x-auto overflow-y-hidden scrollbar-hide pr-10 w-[91%]"
        ref={tabContainerRef}
      >
        {tabs &&
          tabs.map((tab, index) => {
            if (!tab) {
              // Skip undefined or null tabs
              return null;
            }
            const isStringTab = typeof tab === "string";
            const tabName = isStringTab ? tab : tab.tab;
            const tabCategory = isStringTab ? "" : tab.category;

            return (
              <div
                key={index}
                id={`tab-${tabName}`} // Add unique ID for each tab
                className={`flex-shrink-0 text-default dark:text-whiteColor flex items-center bg-transparent gap-2 rounded-t-lg cursor-pointer h-10 w-[6.5rem] ${
                  selectedTab === tabName
                    ? "border-b-[1.4px] border-lightGreens dark:border-primary"
                    : "bg-backgroundApp"
                }`}
                onClick={() => {
                  onTabClick(tabName);
                  if (setTabValue) {
                    setTabValue(tabName);
                  }
                }}
                onDoubleClick={() => handleDoubleClick(tabName)}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {editingTab === tabName ? (
                  <input
                    type="text"
                    value={newTabName}
                    onChange={handleInputChange}
                    onKeyPress={(e) => handleInputKeyPress(e, tabName)}
                    onBlur={() => handleBlur(tabName)}
                    className="w-24 bg-transparent text-default dark:text-whiteColor px-2 py-1 outline-none rounded-md h-8"
                    autoFocus
                  />
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <div className="w-full flex items-center gap-2">
                      {tabCategory ? (
                        getIconForCategory(tabCategory)
                      ) : selectedTab === tabName ? (
                        <div className="w-2 h-2 bg-lightGreens dark:bg-primary rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-default dark:bg-[#4d4c4d] rounded-full"></div>
                      )}
                      <span
                        className={`max-w-[4rem] truncate ${
                          selectedTab === tabName &&
                          "text-default dark:text-white"
                        }`}
                      >
                        {tabName}
                      </span>
                    </div>

                    {selectedTab === tabName && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedGroups =
                            groups &&
                            groups.filter(
                              (group) => group.myGroupName !== tabName
                            );

                          // Save the updated groups back to localStorage
                          localStorage.setItem(
                            typeValue,
                            JSON.stringify(updatedGroups)
                          );
                          // Update the local state
                          setGroups(updatedGroups);
                        }}
                      >
                        <Icons.Cancel className="cursor-pointer w-4 h-4 text-default dark:text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <button
        id={"main-task-step-1"}
        className="absolute bg-buttonLightMode  hover:bg-buttonLightModeHover  dark:hover:bg-backGround  dark:bg-defaultBg  border border-borderLight dark:border-backGround  text-default dark:text-white right-0 flex-shrink-0 px-3 w-fit py-2 rounded-t-lg cursor-pointer flex items-center justify-center z-10 hover:text-default  dark:hover:text-primary transform transition duration-500"
        onClick={onAddTab}
      >
        {/* <Icons.Plus className="min-w-4 min-h-4 text-whiteColor" /> */}
        Create Group
      </button>
    </div>
  );
};

export default GroupTabs;
