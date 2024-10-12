import React, { useCallback, useMemo } from "react";
import {
  Table,
  Column,
  AutoSizer,
  RowMouseEventHandlerParams,
} from "react-virtualized";
import "react-virtualized/styles.css";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../../lib/utils";
import { debounce } from "lodash";
import { Icons } from "../icons/Icons";
import { MdRefresh } from "react-icons/md";
import useWindowSize from "../../hooks/useWindowSize";

const TableComponent = <T extends { key: string }>({
  tasks,
  columns,
  handleSelectAll,
  handleSelectTask,
  selectedTasks,
  isTask,
  getVisibleKeys,
  disabled,
  noDataButtonText,
  noDataButtonOnclick,
  isAccounts,
  isWallet,
  isProxies,
}: TableComponentProps<T>) => {
  // Dummy data for the "No Data Found" state
  const dummyData = [{ key: "dummy" }];

  const rowGetter = useCallback(
    ({ index }: { index: number }) =>
      disabled ? dummyData[index] : tasks[index] || {}, // Ensure a valid object is returned
    [tasks, disabled]
  );

  const debouncedHandleSelectAll = useMemo(
    () => debounce(handleSelectAll, 50),
    [handleSelectAll]
  );
  const debouncedHandleSelectTask = useMemo(
    () => debounce(handleSelectTask, 50),
    [handleSelectTask]
  );

  const renderedColumnsData = useMemo(() => {
    return columns.map((column) => {
      // Check if the column's dataKey is 'balance'
      const isBalanceColumn = String(column.dataKey) === "balance";

      return (
        <Column
          key={String(column.dataKey)}
          label={
            isBalanceColumn ? (
              // Render a button next to 'balance'
              <div className="flex items-center gap-2 mt-2">
                <span className="capitalize font-normal !outline-none bg-headerBgColor text-default dark:text-white ">
                  {column.label}
                </span>
                <button
                  className="w-5 h-5 group"
                  onClick={() => {
                    // getBalances();
                  }}
                >
                  <MdRefresh className="w-5 h-5 rotate-90 group-hover:text-primary" />
                </button>
              </div>
            ) : (
              // Default label rendering
              <div className="capitalize font-normal !outline-none bg-headerBgColor text-default dark:text-white mt-2">
                {column.label}
              </div>
            )
          }
          dataKey={String(column.dataKey)}
          width={column.width}
          cellRenderer={column.cellRenderer}
          className="!outline-none border-none"
        />
      );
    });
  }, [columns]);

  const renderedColumns = useMemo(() => {
    return columns.map((column) => (
      <Column
        key={String(column.dataKey)}
        label={column.label}
        dataKey={String(column.dataKey)}
        width={column.width}
        headerRenderer={() => (
          <div className="capitalize font-normal !outline-none bg-buttonLightMode  dark:bg-[#232323] text-default dark:text-white border-none">
            {column.label}
          </div>
        )}
        cellRenderer={({ cellData, rowIndex }) =>
          column.cellRenderer ? (
            cellData !== undefined ? (
              column.cellRenderer({ cellData, rowIndex })
            ) : (
              <div className="text-placeholder  border-none"></div>
            )
          ) : (
            <div className="text-placeholder  border-none"></div>
          )
        }
        className="!outline-none border-none"
      />
    ));
  }, [columns]);

  const onRowsRendered = useCallback(
    ({ startIndex, stopIndex }: { startIndex: any; stopIndex: any }) => {
      const visible = tasks
        .slice(startIndex, stopIndex + 1)
        .map((task) => task.key);
      if (getVisibleKeys) getVisibleKeys(visible);
    },
    [tasks]
  );

  // const handleRowClick = useCallback(
  //     ({ index }: { index: number }) => {
  //         const taskKey = tasks[index].key;
  //         if (selectedTasks.includes(taskKey)) {
  //             debouncedHandleSelectTask(taskKey);
  //         } else {
  //             debouncedHandleSelectTask(taskKey);
  //         }
  //     },
  //     [tasks, selectedTasks, debouncedHandleSelectTask],
  // );

  const handleRowClick = useCallback(
    ({ event, index }: RowMouseEventHandlerParams) => {
      // Check if the target is a button or other actionable elements
      if (
        (event.target as HTMLElement).tagName === "BUTTON" ||
        (event.target as HTMLElement).closest("button") ||
        (event.target as HTMLElement).tagName === "svg" ||
        (event.target as HTMLElement).closest("svg")
      ) {
        return; // Do nothing if a button or an icon is clicked
      }

      const taskKey = tasks[index].key;
      if (selectedTasks.includes(taskKey)) {
        debouncedHandleSelectTask(taskKey);
      } else {
        debouncedHandleSelectTask(taskKey);
      }
    },
    [tasks, selectedTasks, debouncedHandleSelectTask]
  );

  const rowClassName = ({ index }: { index: number }) => {
    // Check if tasks is defined and is an array
    if (!tasks || !Array.isArray(tasks)) {
      return "bg-buttonLightMode  dark:bg-[#232323] text-default dark:text-white"; // Default class if tasks is not defined
    }

    // Check if the index is for the header row
    if (index < 0) {
      return "bg-buttonLightMode  dark:bg-[#232323] text-default dark:text-white "; // This is for the header row
    }

    return cn(
      "border-b-[1px] border-borderLight dark:border-[#29292b] hover:text-black dark:hover:text-white text-default dark:text-white",
      index === tasks.length - 1 ? "border-none" : "",
      disabled && "border-none"
    );
  };
  const { height } = useWindowSize();
  const isHeight1002 = height && height >= 1002;
  const isHeight830 = height && height >= 830 && height < 962;
  const isHeight963 = height && height >= 962 && height < 1002;

  // A function to determine the height based on conditions
  const getHeightClass = (
    defaultHeight: any,
    height1002: any,
    height830: any,
    height963: any
  ) => {
    if (isHeight1002) return height1002;
    if (isHeight830) return height830;
    if (isHeight963) return height963;
    return defaultHeight;
  };

  if (disabled) {
    return (
      // <div className={cn(`!w-full !h-[63vh] !outline-none relative`, isHeight1002 && '!h-[75vh]')}>
      <div
        className={cn(
          `!w-full !outline-none relative`,
          isProxies
            ? getHeightClass("!h-[65vh]", "!h-[76vh]", "!h-[70vh]", "!h-[74vh]")
            : isWallet
            ? getHeightClass(
                "!h-[56.5vh]",
                "!h-[70vh]",
                "!h-[63vh]",
                "!h-[68vh]"
              )
            : isTask
            ? getHeightClass("!h-[58vh]", "!h-[71vh]", "!h-[64vh]", "!h-[69vh]")
            : isAccounts
            ? getHeightClass(
                "!h-[63.5vh]",
                "!h-[75vh]",
                "!h-[69vh]",
                "!h-[73vh]"
              )
            : "!h-[63vh]" // Default height
        )}
      >
        {/* Table with header */}
        <AutoSizer>
          {({ width, height }) => (
            <Table
              width={width}
              height={height - 30}
              headerHeight={50}
              rowHeight={50}
              rowCount={1} // Only render the header row
              rowGetter={rowGetter}
              rowClassName={rowClassName}
              className="text-placeholder  !w-full !h-[85vh] !font-normal !outline-none border-none"
            >
              <Column
                label={
                  <Checkbox
                    checked={false}
                    id="select-all"
                    className="w-[1.125rem] h-[1.125rem] rounded-[0.25rem] border border-solid border-borderLight dark:border-border mt-3 !outline-none ml-4 mr-4"
                    disabled={disabled}
                  />
                }
                dataKey="select"
                width={50}
                className="!outline-none border-none"
              />
              {renderedColumns}
            </Table>
          )}
        </AutoSizer>

        {/* No Data Found Message */}
        <div className="flex items-center justify-center flex-col !h-[calc(100%-50px)] absolute inset-0 top-[50px] gap-[10px]">
          <div className="text-default dark:text-placeholder  text-base font-normal">
            No Data Found
          </div>
          <button
            onClick={noDataButtonOnclick}
            className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] group text-default dark:text-placeholder  bg-transparent border border-borderLight dark:border-borders hover:border-lightGreen dark:hover:border-primary hover:text-default dark:hover:text-primary transform transition duration-500 text-base font-normal flex items-center gap-2 rounded-lg px-3 py-1"
          >
            {noDataButtonText}
            <Icons.ArrowLeft className="w-3 h-3 text-default dark:text-placeholder  group-hover:text-lightGreen dark:group-hover:text-primary transform transition duration-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        `!w-full !outline-none relative`,
        isProxies
          ? getHeightClass("!h-[65vh]", "!h-[76vh]", "!h-[70vh]", "!h-[74vh]")
          : isWallet
          ? getHeightClass("!h-[56.5vh]", "!h-[70vh]", "!h-[63vh]", "!h-[68vh]")
          : isTask
          ? getHeightClass("!h-[58vh]", "!h-[71vh]", "!h-[64vh]", "!h-[69vh]")
          : isAccounts
          ? getHeightClass("!h-[63.5vh]", "!h-[75vh]", "!h-[69vh]", "!h-[73vh]")
          : "!h-[65vh]" // Default height
      )}
    >
      <div className="w-full flex justify-end mb-2 pr-2">
        <div className="w-fit text-xs-plus font-semibold text-default dark:text-whiteColor">
          Selected: {selectedTasks?.length}/{tasks?.length}
        </div>
      </div>

      {/* Table */}
      <AutoSizer>
        {({ width, height }) => (
          <Table
            width={width}
            height={height - 30}
            headerHeight={50}
            rowHeight={50}
            rowCount={tasks?.length ?? 0}
            rowGetter={rowGetter}
            onRowsRendered={onRowsRendered}
            rowClassName={rowClassName}
            onRowClick={handleRowClick} // Pass the function directly
            className="text-default dark:text-placeholder  !w-full !h-[85vh] !font-normal !outline-none border-none cursor-pointer"
          >
            <Column
              label={
                <Checkbox
                  checked={
                    selectedTasks?.length > 0 &&
                    selectedTasks?.length === tasks?.length
                  }
                  onCheckedChange={(checked) =>
                    debouncedHandleSelectAll(checked)
                  }
                  id="select-all"
                  className="w-[1.125rem] h-[1.125rem] rounded-[0.25rem] border border-solid border-border mt-3 !outline-none ml-4 mr-4"
                />
              }
              dataKey="select"
              width={50}
              className="!outline-none border-none"
              cellRenderer={({ rowIndex }) => (
                <Checkbox
                  checked={selectedTasks.includes(tasks[rowIndex].key)}
                  onCheckedChange={() =>
                    debouncedHandleSelectTask(tasks[rowIndex].key)
                  }
                  id={`select-task-${tasks[rowIndex].key}`}
                  className="w-[1.125rem] h-[1.125rem] rounded-[0.25rem] border border-solid border-border !outline-none ml-4 mr-4"
                />
              )}
            />
            {renderedColumnsData}
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(TableComponent);
