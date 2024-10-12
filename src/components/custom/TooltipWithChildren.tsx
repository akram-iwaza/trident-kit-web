import React, { FC } from "react";
import { cn } from "../../lib/utils";

interface ITooltipWithChildrenProps {
  message: string;
  children: React.ReactNode;
  isCentered?: boolean;
}

const TooltipWithChildren: FC<ITooltipWithChildrenProps> = ({
  children,
  message,
  isCentered,
}) => {
  return (
    <div className="group relative flex cursor-pointer z-20 w-full">
      {children}
      <span
        className={cn(
          "absolute w-full left-1/3 -translate-x-1/2 bottom-full mb-2 scale-0 transition-all rounded p-2 text-xs text-white group-hover:scale-100 capitalize whitespace-pre-wrap",
          isCentered && "bottom-auto top-full mt-2"
        )}
      >
        {message}
      </span>
    </div>
  );
};

export default TooltipWithChildren;
