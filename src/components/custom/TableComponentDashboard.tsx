import React, { useCallback, useMemo } from "react";
import { Table, Column, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import { cn } from "../../lib/utils";

const TableComponentDashboard = <T extends { key: string }>({
  tasks,
  columns,
}: TableComponentDashboardProps<T>) => {
  const rowGetter = useCallback(
    ({ index }: { index: number }) => tasks[index],
    [tasks]
  );

  const renderedColumns = useMemo(() => {
    return columns.map((column) => (
      <Column
        key={String(column.dataKey)}
        label={column.label}
        dataKey={String(column.dataKey)}
        width={column.width}
        headerRenderer={() => (
          <div className="capitalize font-normal !outline-none bg-headerBgColor text-default dark:text-white">
            {column.label}
          </div>
        )}
        cellRenderer={column.cellRenderer}
        className="!outline-none border-none"
      />
    ));
  }, [columns]);

  const rowHeight = 50; // Define your row height
  const headerHeight = 50; // Define your header height
  const maxHeight = 35 * (window.innerHeight / 100); // Calculate 35vh in pixels

  // Calculate table height based on the number of rows or maxHeight if content overflows
  const tableHeight = Math.min(
    tasks.length * rowHeight + headerHeight,
    maxHeight
  );

  const rowClassName = ({ index }: { index: number }) => {
    if (index < 0) {
      return "bg-[#f2f7f8] dark:bg-[#232323] text-default dark:text-white"; // This is for the header row
    }

    return cn(
      "border-b border-borderLight dark:border-[#29292b] text-default dark:text-white dark:hover:text-white",
      index === tasks.length - 1 ? "border-none" : ""
    );
  };

  return (
    <div
      className={cn(
        `!w-full max-h-[35vh] overflow-y-auto overflow-x-hidden editScrollbar !outline-none relative rounded-[14px] mt-10 border border-borderLight dark:border-[#29292B]  shadow-[0_4px_30px_rgba(0,0,0,0.1)] `
      )}
    >
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            width={width}
            height={tableHeight}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            rowCount={tasks?.length ?? 0}
            rowClassName={rowClassName}
            rowGetter={rowGetter}
            className="text-default dark:text-placeholder  !w-full !font-normal !outline-none border-none"
          >
            {renderedColumns}
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(TableComponentDashboard);
