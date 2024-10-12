import React, { FC } from "react";
import { cn } from "../../lib/utils";
interface IHeader {
  children?: React.ReactNode;
  title: string;
  subTitle: string;
  wrapperClassName?: string;
}
const HeaderTabs: FC<IHeader> = ({
  children,
  title,
  subTitle,
  wrapperClassName,
}) => {
  return (
    <div
      className={cn(
        `w-full flex items-center justify-between`,
        wrapperClassName
      )}
    >
      <div className="w-fit flex flex-col items-start">
        <h1 className="text-whiteColor font-bold text-xl">{title}</h1>
        <h2 className="text-gray font-normal text-[0.9375rem]">{subTitle}</h2>
      </div>
      {children}
    </div>
  );
};

export default HeaderTabs;
