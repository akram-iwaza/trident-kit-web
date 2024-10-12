import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/Dropdown-menu";
import { FC } from "react";
import { ModeOption } from "../interfaces/global";
import { cn } from "../../lib/utils";

interface DynamicDropdownProps {
  options: ModeOption[];
  onSelect: (mainValue: string, subTaskValue?: string) => void;
  label: string;
  reset: boolean; // Add this prop to trigger the reset
  setResetDropdown: any;
  wrapperClassName?: string;
  value?: string;
}

const DropdownHover: FC<DynamicDropdownProps> = ({
  options,
  onSelect,
  label,
  reset,
  setResetDropdown,
  wrapperClassName,
  value,
}) => {
  // Parse the initial value from the prop
  const initialSelectedValue = value ? JSON.parse(value) : null;

  const [selectedMode, setSelectedMode] = useState<string | null>(
    initialSelectedValue?.type || null
  );
  const [selectedSubMode, setSelectedSubMode] = useState<string | null>(
    initialSelectedValue?.mode || null
  );

  // Use useEffect to watch for reset changes
  useEffect(() => {
    if (reset) {
      setSelectedMode(null);
      setSelectedSubMode(null);
      setResetDropdown(false);
    }
  }, [reset]);

  const handleItemClick = (mainValue: string, subTaskValue?: string) => {
    setSelectedMode(mainValue);
    setSelectedSubMode(subTaskValue || null);
    onSelect(mainValue, subTaskValue);
  };

  const getButtonText = () => {
    if (selectedMode) {
      if (selectedSubMode) {
        return `${selectedMode} / ${selectedSubMode}`;
      }
      return selectedMode;
    }
    return "Select Mode";
  };

  return (
    <div className="w-full flex flex-col items-start gap-2 relative">
      <label className="text-sm font-normal text-default dark:text-textSwitch  whitespace-nowrap">
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              `w-full flex items-center px-4 justify-start rounded-md bg-white dark:!bg-backGroundDropdown border border-borderLight dark:border-borderDropdown h-11 text-[0.9375rem] font-normal text-default dark:text-whiteColor  shadow-[0_4px_30px_rgba(0,0,0,0.1)] `,
              wrapperClassName
            )}
          >
            {getButtonText()}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 absolute -left-8 bg-white dark:bg-backGroundDropdown border border-borderLight dark:border-borderDropdown text-default dark:text-whiteColor ">
          {options.map((option) => (
            <div key={option.id}>
              <DropdownMenuGroup className="">
                {option.subTasks ? (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                      className={cn(
                        `flex items-center text-default dark:text-whiteColor hover:text-lightGreens dark:hover:!text-primary`
                      )}
                    >
                      {option.icon && (
                        <span
                          className={cn(
                            `mr-2`,
                            (option.id === 1 ||
                              option.id === 4 ||
                              option.id === 5) &&
                              "bg-darkBlue  dark:bg-white h-6 w-6 rounded-full flex items-center justify-center"
                          )}
                        >
                          {option.icon}
                        </span>
                      )}
                      {option.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-white dark:bg-backGroundDropdown border-borderLight dark:border-borderDropdown text-default dark:text-whiteColor">
                        {option.subTasks.map((subTask) => (
                          <DropdownMenuItem
                            key={subTask.id}
                            onSelect={() =>
                              handleItemClick(option.value, subTask.value)
                            }
                            className="flex items-center text-default dark:text-whiteColor hover:text-lightGreens dark:hover:!text-primary hover:!bg-transparent cursor-pointer"
                          >
                            {subTask.icon && (
                              <span className="mr-2">{subTask.icon}</span>
                            )}
                            {subTask.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <DropdownMenuItem
                    onSelect={() => handleItemClick(option.value)}
                    className="flex items-center hover:!bg-transparent cursor-pointer"
                  >
                    {option.icon && (
                      <span
                        className={cn(
                          `mr-2`,
                          (option.id === 2 || option.id === 3) &&
                            "bg-darkBlue  dark:bg-white h-6 w-6 rounded-full flex items-center justify-center"
                        )}
                      >
                        {option.icon}
                      </span>
                    )}
                    {option.label}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownHover;
