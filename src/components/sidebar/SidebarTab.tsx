import React, { FC } from "react";
import { Icons } from "../icons/Icons";
import { sidebarTabs } from "../../lib/globalVariables";
interface IProps {
  tab: any;
  activeTab: any;
  isCollapsed: any;
  isTourOpen: any;
  isMac: any;
  openTab: any;
  disableTabs: any;
  handleToggleTab: any;
  setActiveSubTab: any;
  onActiveTabChange: any;
  activeSubTab: any;
}
const SidebarTab: FC<IProps> = ({
  tab,
  activeTab,
  isCollapsed,
  isTourOpen,
  isMac,
  openTab,
  disableTabs,
  handleToggleTab,
  setActiveSubTab,
  onActiveTabChange,
  activeSubTab,
}) => {
  return (
    <div
      className={`w-full ${
        isCollapsed ? "flex flex-col items-center relative" : ""
      }`}
    >
      {/* Separator for Settings Tab */}
      {tab.name === "Settings" && <Separator />}

      <button
        id={`sidebar-tab-${tab.name.toLowerCase().replace(/\s+/g, "-")}`}
        className={`
                !outline-none  flex items-center justify-between py-2 cursor-pointer group transition duration-500
                ${
                  activeTab === tab.name
                    ? " bg-buttonLightMode  dark:bg-activeBackgroundColor "
                    : ""
                }
                ${
                  activeTab === tab.name && !isCollapsed
                    ? "  border-l-[2px] border-darkBlue  dark:border-primary"
                    : ""
                }
                ${isCollapsed ? "w-[50px] pr-0 rounded-xl" : "px-6 w-full"}
                ${
                  disableTabs
                    ? "cursor-not-allowed"
                    : !isCollapsed
                    ? "hover:border-l-[2px] hover:border-darkBlue  dark:hover:border-primary hover:bg-buttonLightMode  dark:hover:bg-activeBackgroundColor"
                    : " hover:bg-buttonLightMode  dark:hover:bg-activeBackgroundColor"
                }
                ${isTourOpen ? "!w-[30px]" : ""}

            `}
        onClick={() => handleToggleTab(tab.name, tab.subTabs)}
      >
        <TabContent
          tab={tab}
          activeTab={activeTab}
          isCollapsed={isCollapsed}
          isTourOpen={isTourOpen}
        />

        <div className="flex items-center gap-4">
          {activeTab === tab.name && !isCollapsed && !isMac && (
            <ShortcutHint tab={tab} isMac={isMac} />
          )}
          {!isCollapsed && tab.subTabs && (
            <Chevron openTab={openTab} tab={tab} />
          )}
        </div>

        {/* Tooltip for Collapsed Sidebar */}
        {isCollapsed && <Tooltip tab={tab} activeTab={activeTab} />}
      </button>

      {tab.subTabs && (
        <SubTabs
          subTabs={tab.subTabs}
          openTab={openTab}
          tab={tab}
          activeSubTab={activeSubTab}
          disableTabs={false}
          setActiveSubTab={setActiveSubTab}
          onActiveTabChange={onActiveTabChange}
        />
      )}
    </div>
  );
};

export default SidebarTab;

export const TabContent = ({
  tab,
  activeTab,
  isCollapsed,
  isTourOpen,
}: {
  tab: any;
  activeTab: any;
  isCollapsed: any;
  isTourOpen: any;
}) => (
  <div
    className={`w-full flex items-center gap-4 ${
      isCollapsed ? "justify-center px-0" : ""
    } ${isTourOpen ? "!w-[30px]" : ""}`}
  >
    <div
      className={`min-w-5 min-h-5 group-hover:text-default dark:group-hover:text-primary flex items-center justify-center ${
        activeTab === tab.name ? "text-default dark:text-primary" : ""
      }`}
    >
      {activeTab === tab.name ? tab.activeIcon : tab.icon}
    </div>
    {!isCollapsed && (
      <span
        className={`text-xs-plus font-normal group-hover:text-default dark:group-hover:text-primary ${
          activeTab === tab.name ? "text-default dark:text-primary" : ""
        }`}
      >
        {tab.name}
      </span>
    )}
  </div>
);

export const SubTabs = ({
  subTabs,
  openTab,
  tab,
  activeSubTab,
  disableTabs,
  setActiveSubTab,
  onActiveTabChange,
}: {
  subTabs: any;
  openTab: any;
  tab: any;
  activeSubTab: any;
  disableTabs: any;
  setActiveSubTab: any;
  onActiveTabChange: any;
}) => (
  <div
    className={`overflow-hidden transition-max-height duration-300 ease-in-out ml-8 ${
      openTab === tab.name ? "max-h-96" : "max-h-0"
    }`}
  >
    {subTabs.map((subTab: any) => (
      <div
        key={subTab.name}
        className={`flex items-center p-4 cursor-pointer group ${
          activeSubTab === subTab.name ? "text-primary dark:text-primary" : ""
        } ${
          disableTabs
            ? "cursor-not-allowed"
            : "hover:text-primary dark:hover:text-primary"
        }`}
        onClick={() =>
          !disableTabs &&
          setActiveSubTab(subTab.name) &&
          onActiveTabChange(subTab.name)
        }
      >
        {subTab.icon}
        <span className="ml-4 text-xs-plus">{subTab.name}</span>
      </div>
    ))}
  </div>
);

export const Chevron = ({ openTab, tab }: { openTab: any; tab: any }) => (
  <Icons.ChevronDown
    className={`h-4 w-4 duration-150 group-hover ${
      openTab === tab.name
        ? "rotate-180 transition-all text-primary dark:text-primary"
        : ""
    }`}
  />
);

export const Tooltip = ({ tab, activeTab }: { tab: any; activeTab: any }) => (
  <span
    className={`absolute left-[5rem] top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 border border-borderLight dark:border-borders bg-white dark:bg-backgroundApp text-default dark:text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg ${
      activeTab === tab.name ? "text-buttonLightMode  dark:text-primary" : ""
    }`}
  >
    {tab.name}
  </span>
);

export const ShortcutHint = ({ tab, isMac }: { tab: any; isMac: any }) => (
  <div className="border-borderLight dark:border-none bg-white dark:bg-shortcutBackground w-fit h-5 p-1 flex items-center justify-center text-default dark:text-whiteColor font-normal rounded-sm">
    <span className={`${isMac ? "w-16" : "w-fit"}`}>
      {`${isMac ? "Ctrl + " : ""}F${
        sidebarTabs.findIndex((t) => t.name === tab.name) + 1
      }`}
    </span>
  </div>
);

export const Separator = () => (
  <div className="w-full px-6 py-2">
    <div className="w-full h-[1px] bg-buttonLightMode  dark:bg-borders" />
  </div>
);
