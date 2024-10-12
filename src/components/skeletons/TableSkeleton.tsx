import React, { FC } from "react";
import { Skeleton } from "../ui/skeleton";
interface ITableSkeleton {}

const TableSkeleton: FC<ITableSkeleton> = ({}) => {
  const skeletonCount = 8;
  return (
    <div className="w-full flex flex-col items-start gap-5 self-stretch mt-10 px-6">
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex flex-col items-start gap-2">
          <Skeleton className="w-[5rem] bg-skeleton rounded-md h-[1rem]" />
          <Skeleton className="w-[3rem] bg-skeleton rounded-md h-[1rem]" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-[5rem] bg-skeleton rounded-md h-[2rem]" />
          <Skeleton className="w-[5rem] bg-skeleton rounded-md h-[2rem]" />
          <Skeleton className="w-[5rem] bg-skeleton rounded-md h-[2rem]" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="w-[7rem] bg-skeleton rounded-md h-[2rem]" />
        <Skeleton className="w-[7rem] bg-skeleton rounded-md h-[2rem]" />
        <Skeleton className="w-[18rem] bg-skeleton rounded-md h-[2rem]" />
      </div>
      <div className="w-full pb-2">
        <Skeleton className="w-full bg-skeleton rounded-md h-[3rem]" />
      </div>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full bg-skeleton rounded-md h-[1.5rem]"
        />
      ))}
    </div>
  );
};
export default TableSkeleton;
