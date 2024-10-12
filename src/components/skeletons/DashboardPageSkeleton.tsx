import React, { FC } from "react";
import { Skeleton } from "../ui/skeleton";
interface IDashboardPageSkeleton {}
const DashboardPageSkeleton: FC<IDashboardPageSkeleton> = ({}) => {
  const skeletonCount = 8;
  return (
    <div className="w-full flex flex-col items-start gap-5 self-stretch mt-10 px-6">
      <div className="w-full flex flex-col items-start gap-2">
        <Skeleton className="w-full bg-skeleton rounded-md h-[1rem]" />
        <Skeleton className="w-[10rem] bg-skeleton rounded-md h-[1rem]" />
      </div>
      <div className="w-full grid grid-cols-3 gap-4 py-4">
        <Skeleton className="w-full bg-skeleton rounded-md h-[4rem]" />
        <Skeleton className="w-full bg-skeleton rounded-md h-[4rem]" />
        <Skeleton className="w-full bg-skeleton rounded-md h-[4rem]" />
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
export default DashboardPageSkeleton;
