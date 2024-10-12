import React, { useCallback, useEffect, useRef, useState } from "react";
import TableSkeleton from "../../skeletons/TableSkeleton";
import GroupTabs from "../../custom/GroupTabs";
import TableComponent from "../../custom/TableComponent";
import CreateGroupTaskNameModal from "../../modals/TaskModals/CreateGroupTaskNameModal";
import DeleteModal from "../../modals/DeleteModal";
import HeaderTabs from "../../custom/HeaderTabs";
import AddProxiesModal from "../../modals/ProxyModal/AddProxiesModal";
import ButtonTabs from "../../custom/ButtonTabs";
import { useMainProxiesStates } from "./Events/MainProxiesStates";
import { useMainProxiesFunctions } from "./Events/MainProxiesFunctions";
import MainProxiesKeyEvents from "./Events/MainProxiesKeyEvents";
import { BsPauseFill } from "react-icons/bs";
import { cn } from "../../../lib/utils";
import { Icons } from "../../icons/Icons";

declare global {
  interface Window {
    electron: any;
  }
}

const MainProxies: React.FC<IProps> = ({
  isOpen,
  onReturnValue,
  searchedValue,
  isReady,
}) => {
  const [isSpeedTestRunning, setIsSpeedTestRunning] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [deleteProxies, setDeleteProxies] = useState<{
    isOpen: boolean;
    failedKeys: string[];
  }>({
    isOpen: false,
    failedKeys: [],
  });

  const state = useMainProxiesStates();
  const functions = useMainProxiesFunctions(state, tabContainerRef);
  MainProxiesKeyEvents(state, functions, isReady, tabContainerRef);

  const {
    proxies,
    setActions,
    actions,
    playingTasks,
    selectedTasks,
    selectedTab,
    taskStatuses,
    taskGroups,
    isModalOpenAddTab,
    isDeleteModal,
    createProxiesModal,
    width,
    setTabValue,
    setCreateProxiesModal,
    setIsDeleteModal,
    setIsModalOpenAddTab,
    setIsDeleteTaskModal,
    isDeleteTaskModal,
    groups,
    setGroups,
  } = state;

  const {
    handleAddTab,
    onEditClick,
    onDeleteClick,
    onPermanentDeleteClick,
    handleTabClick,
    handleDuplicateTask,
    handleEditProxy,
    handleDeleteProxies,
    handleStartAll,
    handleTogglePlay,
    handleSelectAll,
    handleSelectTask,
    handleTabsReorder,
    handleInputChangeSearch,
  } = functions;

  const handleKeyDown = useCallback(
    (event: { ctrlKey: any; key: string; preventDefault: () => void }) => {
      if (
        !createProxiesModal.isOpen &&
        !isModalOpenAddTab.isOpen &&
        !isDeleteModal.isOpen
      ) {
        if (event.ctrlKey && event.key.toLowerCase() === "a") {
          event.preventDefault();
          handleSelectAll();
        } else if (event.ctrlKey && event.key.toLowerCase() === "t") {
          event.preventDefault();
          handleAddTab();
        } else if (event.ctrlKey && event.key.toLowerCase() === "s") {
          event.preventDefault();
          handleStartAll(groups);
        } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
          event.preventDefault();
          setTabValue(selectedTab);
          setCreateProxiesModal({
            isOpen: true,
            tabName: selectedTab,
          });
        }
      }
    },
    [
      createProxiesModal.isOpen,
      isModalOpenAddTab.isOpen,
      isDeleteModal.isOpen,
      handleSelectAll,
      handleAddTab,
      handleStartAll,
      groups,
      setTabValue,
      setCreateProxiesModal,
      selectedTab,
    ]
  );

  const availableWidth = width ? width - (isOpen ? 180 : 100) : 0;
  const fixedColumnWidths = [
    { label: "IP", dataKey: "IP", width: 150 },
    { label: "Port", dataKey: "PORT", width: 100 },
    { label: "Username", dataKey: "USERNAME", width: 150 },
    { label: "Password", dataKey: "PASSWORD", width: 150 },
    { label: "Status", dataKey: "status", width: 150 },
    { label: "Actions", dataKey: "actions", width: 150 },
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const columns: Array<{
    label: string;
    dataKey: keyof Proxies | any | "status" | "actions";
    width: number;
    cellRenderer?: (props: any) => React.ReactNode;
  }> = scaledColumns.map((col) => {
    if (col.dataKey === "status") {
      // Function to get all keys where status is 'failed ms'
      const getFailedKeys = () => {
        return (
          proxies &&
          proxies
            .filter((proxy) => taskStatuses[proxy.key] === "failed ms") // Filter proxies where status is 'failed ms'
            .map((proxy) => proxy.key)
        ); // Map to their keys
      };
      // Get the keys for entries with 'failed ms'
      const failedKeys = getFailedKeys();

      return {
        ...col,
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
          const status = taskStatuses[proxies[rowIndex].key];

          const getStatusClass = (status: string) => {
            switch (status) {
              case "Testing":
                return {
                  textClass: "text-white dark:text-warning",
                  bgClass: "bg-warning dark:bg-darkBgTaskBtn ",
                };
              case "failed ms":
                return {
                  textClass: "text-white dark:text-danger",
                  bgClass: "bg-danger dark:bg-darkRed",
                };
              default:
                return status
                  ? {
                      textClass: "text-white dark:text-primary",
                      bgClass: "bg-greenTask  dark:bg-backGroundBtnStatus",
                    }
                  : {
                      textClass: "text-default dark:text-white ",
                      bgClass: "bg-white dark:bg-darkBgTask ",
                    };
            }
          };

          const { textClass, bgClass } = getStatusClass(status);

          return (
            <div
              className={cn(
                "w-fit px-3 py-1 rounded-lg flex items-center gap-2 max-w-full truncate dark:border-none border border-borderLight",
                bgClass
              )}
            >
              <div
                className={cn(
                  `min-w-2 min-h-2 rounded-full`,
                  status === "failed ms"
                    ? "bg-white dark:bg-red"
                    : status === "Testing"
                    ? "bg-white dark:bg-warning"
                    : status
                    ? "bg-white dark:bg-primary"
                    : "bg-default dark:bg-white"
                )}
              />

              <span className={textClass}>
                {status === "failed ms" ? "Failed" : status || "Idle"}
              </span>
            </div>
          );
        },
      };
    }

    if (col.dataKey === "actions") {
      return {
        ...col,
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => (
          <div className="w-full flex items-center gap-1">
            <button
              onClick={() => handleTogglePlay(proxies[rowIndex].key, groups)}
              className="w-6 h-6 flex items-center justify-center group"
            >
              {playingTasks.includes(proxies[rowIndex].key) ? (
                <BsPauseFill className="w-6 h-6 text-default dark:text-white group-hover:text-primary transition duration-300" />
              ) : (
                <Icons.PlayBtn className="w-4 h-4 text-default dark:text-white group-hover:text-primary transition duration-300" />
              )}
            </button>
            <button
              onClick={() => {
                setIsDeleteTaskModal({
                  isOpen: true,
                  task: proxies[rowIndex].key,
                });
              }}
              className="w-6 h-6 flex items-center justify-center group"
            >
              <Icons.DeleteBtn className="w-4 h-4 text-default dark:text-white group-hover:text-red transition duration-300" />
            </button>
            <button
              onClick={() => {
                setTabValue(selectedTab);
                handleDuplicateTask(proxies[rowIndex].key);
              }}
              className="w-6 h-6 flex items-center justify-center group"
            >
              <Icons.DuplicateBtn className="w-4 h-4 text-default dark:text-white group-hover:text-primary transition duration-300" />
            </button>
          </div>
        ),
      };
    }
    return col;
  });

  useEffect(() => {
    if (groups) {
      onReturnValue(groups);
    }
  }, [groups]);

  useEffect(() => {
    if (searchedValue) {
      handleInputChangeSearch(searchedValue);
    }
  }, [searchedValue]);

  const selectedGroup = groups.find(
    (group) => group.myGroupName === selectedTab
  );

  // Safely set disabled to true if selectedGroup is undefined or myGroupWallets is empty
  const disabled =
    !selectedGroup || (selectedGroup.myGroupProxies?.length ?? 0) === 0;

  return (
    <div className="w-full px-6 overflow-y-auto">
      <div className="w-full flex items-center justify-between py-6">
        <ButtonTabs
          id="main-proxies-step-2"
          disabled={disabled}
          type={disabled ? "disabled" : "default"}
          onClick={() => {
            setIsSpeedTestRunning(true); // Set speed test running state
            handleStartAll(groups); // Start the speed test
          }}
          showShortcut={true}
          shortcutText="Ctrl + S"
        >
          Speed Test
        </ButtonTabs>
        <ButtonTabs
          id="main-proxies-step-1"
          onClick={() => {
            setTabValue(selectedTab);
            setCreateProxiesModal({
              isOpen: true,
              tabName: selectedTab,
            });
          }}
          showShortcut={true}
          shortcutText="Ctrl + C"
          type="active"
        >
          Add Proxies
          <Icons.ArrowLeft className="w-3 h-3" />
        </ButtonTabs>
      </div>
      <div className="w-full max-w-full bg-lightBackgroundColor dark:bg-backgroundInput border border-borderLight dark:border-borders rounded-lg  shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="w-full max-w-full  pl-4 pr-2 py-2">
          <GroupTabs
            tabs={taskGroups}
            onAddTab={handleAddTab}
            onTabClick={handleTabClick}
            selectedTab={selectedTab}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onTabsReorder={handleTabsReorder}
            type="proxy"
            setGroups={setGroups}
            tabContainerRef={tabContainerRef}
          />
        </div>
        <div className="w-full">
          <TableComponent
            tasks={proxies}
            columns={columns}
            playingTasks={playingTasks}
            handleSelectAll={handleSelectAll}
            handleSelectTask={handleSelectTask}
            selectedTasks={selectedTasks}
            isOpen={isOpen}
            disabled={disabled}
            noDataButtonOnclick={() => {
              setTabValue(selectedTab);
              setCreateProxiesModal({
                isOpen: true,
                tabName: selectedTab,
              });
            }}
            noDataButtonText="Add Proxies"
            isProxies
          />
        </div>
      </div>

      {isModalOpenAddTab.isOpen && (
        <CreateGroupTaskNameModal
          tabName={isModalOpenAddTab.tab ?? undefined}
          onClose={() => {
            setIsModalOpenAddTab({
              isOpen: false,
              tab: undefined,
            });
          }}
          onCallback={(value: string | undefined) => {
            setTabValue(value);
            setTimeout(() => {
              if (value) {
                const tabElement = document.getElementById(`tab-${value}`);
                console.log("tabElement indexValue : ", tabElement);
                if (tabElement) {
                  // Get the position of the tab and container
                  const tabRect = tabElement.getBoundingClientRect();
                  const containerRect =
                    tabContainerRef.current?.getBoundingClientRect();

                  if (containerRect) {
                    const isTabVisible =
                      tabRect.left >= containerRect.left &&
                      tabRect.right <= containerRect.right;

                    // Scroll into view if the tab is not fully visible
                    if (!isTabVisible) {
                      tabElement.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                      });
                    }
                  }
                }
              }
            }, 100);
          }}
          typeTab="proxy"
          getType="myProxies"
          taskGroups={taskGroups}
          setActions={setActions}
          actions={actions}
        />
      )}

      {isDeleteModal.isOpen && (
        <DeleteModal
          slug={isDeleteModal?.name ?? undefined}
          callback={(name: string | string[]): void => {
            onPermanentDeleteClick(name as string);
          }}
          onClose={() => {
            setIsDeleteModal({
              isOpen: false,
              name: undefined,
            });
          }}
        />
      )}

      {createProxiesModal.isOpen && (
        <AddProxiesModal
          onClose={() => {
            setTabValue(selectedTab);
            setCreateProxiesModal({
              isOpen: false,
              tabName: undefined,
              proxy: undefined,
              rowKey: undefined,
            });
            setActions(!actions);
          }}
          tabName={createProxiesModal.tabName ?? ""}
          taskGroups={taskGroups}
          rowKey={createProxiesModal.rowKey}
          proxy={createProxiesModal.proxy}
          emptyGroups={taskGroups.length === 0}
        />
      )}
      {isDeleteTaskModal.isOpen && (
        <DeleteModal
          slug={isDeleteTaskModal?.task ?? undefined}
          callback={(tasks: string | string[]): void => {
            handleDeleteProxies(tasks);
          }}
          onClose={() => {
            setIsDeleteTaskModal({
              isOpen: false,
              task: "",
            });
          }}
        />
      )}
      {deleteProxies.isOpen && (
        <DeleteModal
          title="Would You Like to Delete the Failed Proxies?"
          slug={deleteProxies?.failedKeys ?? undefined}
          callback={(tasks: string | string[]): void => {
            handleDeleteProxies(tasks, setDeleteProxies);
          }}
          onClose={() => {
            setDeleteProxies({
              isOpen: false,
              failedKeys: [],
            });
          }}
        />
      )}
    </div>
  );
};

export default MainProxies;
