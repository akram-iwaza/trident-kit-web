import React, { FC, useEffect, useRef, useState } from "react";
import { Icons } from "../icons/Icons";
import Clock from "./Clock";
import SearchInputWithOptionsTabs from "./SearchInputWithOptionsTabs";
import DeleteModal from "../modals/DeleteModal";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../hooks/ThemeContext";
import { cn } from "../../lib/utils";

interface IPropsHeaderComponent {
  titleActiveTabValue: string;
  groups: any;
  setSearchedValue: (value: any) => void;
  clearSearchInput: any;
  accountNameOptions: any;
  value: any;
  setValue: any;
  isDashboardTab: boolean;
  isSettingsTab: any;
  unlockApp: boolean;
  isSettingsAndDashboard: boolean;
  activeTabMain: any;
}
const HeaderComponent: FC<IPropsHeaderComponent> = ({
  titleActiveTabValue,
  groups,
  setSearchedValue,
  clearSearchInput,
  accountNameOptions,
  value,
  setValue,
  isDashboardTab,
  isSettingsTab,
  unlockApp,
  isSettingsAndDashboard,
  activeTabMain,
}) => {
  const [isModalCloseOpen, setIsModalCloseOpen] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [searchInputAll, setSearchInputAll] = useState<string>("");
  const { isDarkMode, toggleDarkMode } = useTheme();
  const handleBlur = () => {
    setSearchInputAll("");
  };

  useEffect(() => {
    if (unlockApp) {
      const handleKeyDown = (event: { ctrlKey: any; key: string }) => {
        if (event.ctrlKey && event.key.toLowerCase() === "m") {
          //    window.electron.ipcRenderer.sendMessage("minimize");
        } else if (event.ctrlKey && event.key.toLowerCase() === "x") {
          setIsModalCloseOpen(true);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [unlockApp]);

  return (
    <div
      className={cn(
        `w-full border-b-[1px] border-borderAppLight dark:border-borders App-header`,
        !unlockApp && "blur-none ",
        isSettingsAndDashboard ? "py-[1.75rem]" : "py-[1.55rem]"
      )}
    >
      <div className="px-6 w-full flex items-center justify-between">
        <div className="w-fit flex flex-col items-start no-drag">
          <h1 className="text-backgroundApp dark:text-white text-xl font-normal">
            {titleActiveTabValue}
          </h1>
        </div>
        <div className="w-fit flex items-center gap-5">
          {!isDashboardTab && !isSettingsTab && (
            <div className="rounded relative w-[22rem] no-drag  bg-transparent dark:!bg-backgroundApp">
              <SearchInputWithOptionsTabs
                inputRef={inputRef}
                divClassName={"!w-full"}
                clearSearchInput={() => {
                  setValue("");
                  setSearchInputAll("");
                  if (clearSearchInput) clearSearchInput();
                }}
                value={searchInputAll === "" ? value : searchInputAll}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  const value = e.target.value.trimStart();
                  setSearchedValue(value);
                  setValue(value);
                }}
                inputClassName="w-full"
                wrapperClassName="w-full p-2 text-lg  rounded-md border border-border bg-transparent outline-none text-whiteColor z-50"
                placeHolder={"Search"}
                groupsOptions={
                  groups?.length > 0
                    ? groups.map((x: { myGroupName: any }) => x.myGroupName)
                    : []
                }
                onBlur={handleBlur}
                accountNameOptions={accountNameOptions}
                activeTabMain={activeTabMain}
              />
            </div>
          )}

          <Clock />
          <button
            onClick={toggleDarkMode}
            className="transition-all duration-300 ease-in-out"
          >
            {isDarkMode ? (
              <FiSun className="text-warning w-6 h-6" />
            ) : (
              <FiMoon className="text-backgroundApp  w-6 h-6" />
            )}
          </button>
          <div className="h-[25px] w-[1px] bg-darkBlue dark:bg-backGround " />
          <div className="flex items-center gap-1 no-drag">
            <button
              className="w-fit h-fit rounded-full flex items-center justify-center p-1.5 no-drag"
              onClick={
                () => {}
                // window.electron.ipcRenderer.sendMessage("minimize")
              }
            >
              <Icons.minimize className="text-backgroundApp dark:text-white min-w-[0.75rem] min-h-[0.75rem]" />
            </button>
            <button
              className="w-fit h-fit rounded-full flex items-center justify-center p-1.5 no-drag"
              onClick={() => setIsModalCloseOpen(true)}
            >
              <Icons.close className="text-backgroundApp dark:text-white min-w-[0.75rem] min-h-[0.75rem]" />
            </button>
          </div>
        </div>
        {isModalCloseOpen && (
          <DeleteModal
            slug={undefined}
            callback={() => {
              // window.electron.ipcRenderer.sendMessage("close");
            }}
            onClose={() => {
              setIsModalCloseOpen(false);
            }}
            title={"Are you sure you want to close the app"}
          />
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
