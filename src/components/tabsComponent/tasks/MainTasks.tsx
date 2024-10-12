import React, {
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icons } from "../../icons/Icons";
import TableSkeleton from "../../skeletons/TableSkeleton";
import CreateGroupTaskNameModal from "../../modals/TaskModals/CreateGroupTaskNameModal";
import { toast } from "../../ui/use-toast";
import DeleteModal from "../../modals/DeleteModal";
import CreateTasksModal from "../../modals/TaskModals/CreateTasksModal";
import LabelInput from "../../custom/LabelAndInput";
import LogsModal from "../../modals/TaskModals/LogsModal";
import ButtonTabs from "../../custom/ButtonTabs";
import { useMainTasksStates } from "./Events/MainTasksStates";
import { useMainTasksFunctions } from "./Events/MainTasksFunctions";
import useMainTasksKeyEvents from "./Events/MainTasksKeyEvents";
import useStatusMessages from "../../../hooks/useStatusMessages";
import { BsPauseFill, BsClipboardData } from "react-icons/bs";
import { cn } from "../../../lib/utils";
import { modeOptions } from "../../../lib/globalVariables";
import useWindowSize from "../../../hooks/useWindowSize";
import LabelWithDropdownIcons from "../../dropdowns/LabelWithDropdownIcons";
import GroupTabs from "../../custom/GroupTabs";
import TableComponent from "../../custom/TableComponent";
declare global {
  interface Window {
    electron: any;
  }
}
const MainTasks: FC<{
  isOpen: boolean;
  onReturnValue: (value: any) => void;
  searchedValue: string;
  isReady: boolean;
  setSelectedGroupTab: any;
}> = ({
  isOpen,
  onReturnValue,
  searchedValue,
  isReady,
  setSelectedGroupTab,
}) => {
  const [visibleKeys, setVisibleKey] = useState<any[]>([]);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const state = useMainTasksStates(isOpen);

  const functions = useMainTasksFunctions(state, tabContainerRef);

  useMainTasksKeyEvents(
    state,
    functions,
    isReady,
    searchedValue,
    tabContainerRef
  );

  const { statuses, dispatch } = useStatusMessages();

  const {
    setActions,
    actions,
    scaledColumns,
    tasks,
    setGroups,
    playingTasks,
    selectedTasks,
    selectedTab,
    taskGroups,
    formData,
    isModalOpenAddTab,
    isModalOpenCreateTask,
    isModalOpenEditTask,
    isDeleteModal,
    isDeleteTaskModal,
    isModalVisibleLogs,
    isDisabledStartAll,
    setSelectedTasks,
    setIsModalOpenEditTask,
    setSelectedRowKey,
    setIsDeleteTaskModal,
    setIsModalVisibleLogs,
    setIsModalOpenCreateTask,
    setIsDeleteModal,
    setIsModalOpenAddTab,
    setTabValue,
    setClearValues,
    clearValues,
    groups,
  } = state;

  const {
    handleAddTab,
    onEditClick,
    onPermanentDeleteClick,
    handleTabClick,
    handleDuplicateTask,
    handleDeleteTasks,
    handleStartAll,
    handleStopAll,
    handleSelectAll,
    handleSelectTask,
    getModeTab,
    handleTogglePlay,
    handleTabsReorder,
    handleSearchCategory,
    handleInputChangeSearch,
    handleBlur,
    handleInputChange,
    handleInputBlur,
  } = functions;

  const columns: Array<{
    label: string;
    dataKey: keyof Task | any | "status" | "actions";
    width: number;
    cellRenderer?: (props: any) => React.ReactNode;
  }> = useMemo(() => {
    return scaledColumns.map((col) => {
      if (col.dataKey === "status") {
        return {
          ...col,
          cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
            const taskID = tasks[rowIndex].key;
            if (!visibleKeys.includes(taskID) && statuses?.size > 0) {
              return (
                <div
                  className={cn(
                    `w-fit px-3 py-1 rounded-lg flex items-center gap-2 max-w-full truncate text-default dark:text-white  bg-white dark:bg-darkBgTask `
                  )}
                >
                  <div
                    className={cn(
                      `min-w-2 min-h-2 rounded-full bg-default dark:bg-white`
                    )}
                  />
                  <span className="max-w-full truncate"> Idle</span>
                </div>
              );
            }
            const status = statuses.get(taskID) || {
              message: "Idle",
              error: false,
              success: false,
            };
            return (
              <div
                className={cn(
                  `w-fit px-3 py-1 rounded-lg flex items-center gap-2 max-w-full truncate`,
                  status.error
                    ? "text-white dark:text-red bg-red  dark:bg-darkRed"
                    : status.success
                    ? "text-white dark:text-greenTask   bg-greenTask  dark:bg-backGroundBtnStatus"
                    : status.message?.toLowerCase() === "idle"
                    ? "text-default dark:text-white  bg-white dark:bg-darkBgTask  dark:border-none border border-borderLight"
                    : "text-white dark:text-warning bg-warning dark:bg-darkBgTaskBtn "
                )}
              >
                <div
                  className={cn(
                    `min-w-2 min-h-2 rounded-full`,
                    status.error
                      ? "bg-white dark:bg-red"
                      : status.success
                      ? "bg-white dark:bg-primary"
                      : status.message?.toLowerCase() === "idle"
                      ? "bg-default dark:bg-white"
                      : "bg-white dark:bg-warning"
                  )}
                />
                <span className="max-w-full truncate"> {status.message}</span>
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
                onClick={() => functions.handleTogglePlay(tasks[rowIndex].key)}
                // className="w-6 h-6 border border-border hover:border-primary rounded-md p-2 flex items-center justify-center group"
                className="w-6 h-6 flex items-center justify-center group"
              >
                {playingTasks.includes(tasks[rowIndex].key) ? (
                  <BsPauseFill className="w-6 h-6 text-default dark:text-white group-hover:text-primary transition duration-300" />
                ) : (
                  <Icons.PlayBtn className="w-4 h-4 text-default dark:text-white group-hover:text-primary transition duration-300" />
                )}
              </button>
              <button
                disabled={true}
                onClick={() => {
                  setTabValue(selectedTab);
                  setIsModalOpenEditTask({
                    isOpen: true,
                    tab: selectedTab,
                    mode: getModeTab()?.mode,
                    type: getModeTab()?.type,
                    key: tasks[rowIndex].key,
                  });
                }}
                className="w-6 h-6 flex items-center justify-center group"
              >
                <Icons.EditBtn className="w-4 h-4 text-default dark:text-white group-hover:text-warning transition duration-300" />
              </button>
              <button
                onClick={() => {
                  setTabValue(selectedTab);
                  setSelectedRowKey(tasks[rowIndex].key);
                  setIsDeleteTaskModal({
                    isOpen: true,
                    task: selectedTasks,
                  });
                }}
                className="w-6 h-6 flex items-center justify-center group"
              >
                <Icons.DeleteBtn className="w-4 h-4 text-default dark:text-white group-hover:text-red transition duration-300" />
              </button>
              <button
                disabled={true}
                onClick={() => {
                  setIsModalVisibleLogs({
                    isOpen: true,
                    rowKey: tasks[rowIndex].key,
                  });
                }}
                className="w-6 h-6 flex items-center justify-center group"
              >
                <BsClipboardData className="w-4 h-4 text-default dark:text-white group-hover:text-primary transition duration-300" />
              </button>
              <button
                onClick={() => {
                  setTabValue(selectedTab);
                  handleDuplicateTask(tasks[rowIndex].key);
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
  }, [
    statuses,
    scaledColumns,
    tasks,
    functions,
    playingTasks,
    selectedTab,
    setTabValue,
    setIsModalOpenEditTask,
    setSelectedRowKey,
    setIsDeleteTaskModal,
    setIsModalVisibleLogs,
    handleDuplicateTask,
  ]);

  const groupModes = groups && groups.map((group: { mode: any }) => group.mode);
  const categoryOptions =
    modeOptions &&
    modeOptions.filter((option) => groupModes?.includes(option.label));

  const { width } = useWindowSize();

  const isWidth = width && width < 1250;

  const selectedGroup = groups.find(
    (group) => group.myGroupName === selectedTab
  );

  const disabled =
    !selectedGroup || (selectedGroup.myGroupTasks?.length ?? 0) === 0;
  const disabledSome = !selectedGroup;

  return (
    <div className="w-full relative px-6 pt-6 overflow-y-auto">
      <div className="w-full flex items-center justify-between">
        <div className=" flex items-center gap-4 pb-6">
          <LabelInput
            disabled={disabledSome}
            id={"main-task-step-3"}
            label="Threads"
            labelClassName="w-full text-default dark:text-label max-w-full truncate"
            wrapperClassName={cn(`w-[8.8rem]`, isWidth && "w-[7rem]")}
            inputClassName="w-full h-[2.5rem] text-xs-plus placeholder:text-label"
            placeholder="Threads..."
            value={formData.numberOfThreads}
            onChange={(e) => handleInputChange(e, "numberOfThreads")}
            onBlur={handleInputBlur} // Save on losing focus
            isNumericOnly
          />
          <LabelInput
            disabled={disabledSome}
            id={"main-task-step-4"}
            label="Sleep Time"
            labelClassName="w-full text-default dark:text-label"
            wrapperClassName={cn(`w-[8.8rem]`, isWidth && "w-[7rem]")}
            inputClassName="w-full h-[2.5rem] text-xs-plus placeholder:text-label"
            placeholder="Sleep Time..."
            value={formData.sleepTime}
            onChange={(e) => handleInputChange(e, "sleepTime")}
            onBlur={handleInputBlur} // Save on losing focus
            isNumericOnly
            isSleep
          />
          <LabelWithDropdownIcons
            disabled={disabledSome}
            id={"main-task-step-5"}
            isSearch
            label="Category"
            placeholder="Select a category"
            options={categoryOptions ?? []}
            onSelect={(value: string | string[]) => {
              handleSearchCategory(value ?? undefined);
            }}
            wrapperClassName={cn(
              `w-[14rem]`,
              isWidth && isOpen && "w-[9rem]",
              isWidth && !isOpen && "w-[12rem]"
            )}
            clearSelectedValues={clearValues}
            setClearSelectedValues={setClearValues}
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <ButtonTabs
              id={"main-task-step-6"}
              disabled={disabled}
              type={disabled ? "disabled-stopAll" : "stop-all"}
              onClick={() => {
                const allTaskKeys = tasks.map(
                  (task: { key: string }) => task.key
                );
                const matchingKeys = playingTasks.filter((key: string) =>
                  allTaskKeys.includes(key)
                );
                console.log("statuses : ", statuses);

                // Dispatch action to update message for matching tasks
                matchingKeys.forEach((key: string) => {
                  const currentStatus = statuses.get(key);
                  if (currentStatus) {
                    dispatch({
                      type: "SET_STATUS",
                      payload: {
                        ...currentStatus,
                        message: "idle", // Update message to 'idle'
                      },
                    });
                  }
                });

                handleStopAll(matchingKeys);
              }}
              showShortcut={true}
              shortcutText="Ctrl + P"
            >
              Stop All
            </ButtonTabs>
            <ButtonTabs
              id={"main-task-step-7"}
              type={disabled ? "disabled-active" : "active"}
              onClick={handleStartAll}
              showShortcut={true}
              shortcutText="Ctrl + S"
              disabled={isDisabledStartAll}
            >
              Start All
            </ButtonTabs>
          </div>
          <div className="h-[25px] w-[1px] bg-darkBlue dark:bg-backGround " />
          <ButtonTabs
            id={"main-task-step-2"}
            onClick={() => {
              if (taskGroups.length === 0) {
                toast({
                  variant: "destructive",
                  title: "A group name with a specific category is required",
                });
              } else {
                setTabValue(selectedTab);
                setIsModalOpenCreateTask({
                  isOpen: true,
                  tab: selectedTab,
                  mode: getModeTab()?.mode,
                  type: getModeTab()?.type,
                });
              }
            }}
            showShortcut={true}
            shortcutText="Ctrl + C"
            type="active"
          >
            Create Tasks
            <Icons.ArrowLeft className="w-3 h-3" />
          </ButtonTabs>
        </div>
      </div>
      <div className="w-full max-w-full bg-lightBackgroundColor dark:bg-backgroundInput border border-borderLight dark:border-borders rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] ">
        <div className="w-full max-w-full  pl-4 pr-2 py-2">
          <GroupTabs
            tabs={taskGroups}
            onAddTab={handleAddTab}
            onTabClick={handleTabClick}
            selectedTab={selectedTab}
            onEditClick={onEditClick}
            onDeleteClick={(value: string) => {
              setIsDeleteModal({
                isOpen: true,
                name: value,
              });
            }}
            id={"main-task-step-1"}
            onTabsReorder={handleTabsReorder}
            tabContainerRef={tabContainerRef}
            setGroups={setGroups}
            type="task"
          />
        </div>

        <div className="w-full ">
          <TableComponent
            tasks={tasks}
            columns={columns}
            playingTasks={playingTasks}
            handleTogglePlay={handleTogglePlay}
            handleSelectAll={handleSelectAll}
            handleSelectTask={handleSelectTask}
            selectedTasks={selectedTasks}
            isOpen={isOpen}
            getVisibleKeys={(keys: SetStateAction<any[]>) => {
              setVisibleKey(keys);
            }}
            isTask
            disabled={disabled}
            noDataButtonOnclick={() => {
              if (taskGroups.length === 0) {
                toast({
                  variant: "destructive",
                  title: "A group name with a specific category is required",
                });
              } else {
                setTabValue(selectedTab);
                setIsModalOpenCreateTask({
                  isOpen: true,
                  tab: selectedTab,
                  mode: getModeTab()?.mode,
                  type: getModeTab()?.type,
                });
              }
            }}
            noDataButtonText="Create Task"
          />
        </div>
      </div>
      {/* Modals  */}

      {isModalOpenAddTab.isOpen && (
        <CreateGroupTaskNameModal
          tabName={isModalOpenAddTab.tab ?? undefined}
          onClose={() => {
            setActions(!actions);
            setIsModalOpenAddTab({
              isOpen: false,
              tab: undefined,
            });
          }}
          onCallback={(value: string | undefined) => {
            setTabValue(value);
          }}
          typeTab="task"
          getType="myTasks"
          isTask
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

      {isModalOpenCreateTask.isOpen && (
        <CreateTasksModal
          onClose={() => {
            setActions(!actions);
            setIsModalOpenCreateTask({
              isOpen: false,
              tab: undefined,
              mode: undefined,
              type: undefined,
            });
          }}
          propsData={isModalOpenCreateTask}
        />
      )}

      {isDeleteTaskModal.isOpen && (
        <DeleteModal
          slug={isDeleteTaskModal?.task ?? undefined}
          callback={(tasks: string | string[]): void => {
            handleDeleteTasks(tasks);
          }}
          onClose={() => {
            setIsDeleteTaskModal({
              isOpen: false,
              task: "",
            });
          }}
          setSelectedTasks={setSelectedTasks}
        />
      )}

      {isModalOpenEditTask.isOpen && (
        <CreateTasksModal
          onClose={() => {
            setActions(!actions);
            setIsModalOpenEditTask({
              isOpen: false,
              tab: undefined,
              mode: undefined,
              type: undefined,
              key: undefined,
            });
          }}
          propsData={isModalOpenEditTask}
          tasks={tasks}
          selectedTasks={selectedTasks}
        />
      )}

      {isModalVisibleLogs.isOpen && (
        <LogsModal
          onClose={() => {
            setIsModalVisibleLogs({
              isOpen: false,
              rowKey: undefined,
            });
          }}
          rowKey={isModalVisibleLogs.rowKey}
        />
      )}
    </div>
  );
};

export default MainTasks;
