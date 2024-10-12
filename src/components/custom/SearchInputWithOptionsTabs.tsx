import React, { FC, useState, useEffect, useRef, useCallback } from "react";
import { cn } from "../../lib/utils";
import { Icons } from "../icons/Icons";
import { Input } from "../ui/input";

interface ISearchInputProps {
  inputClassName?: string;
  wrapperClassName?: string;
  divClassName?: string;
  placeHolder?: string;
  inputWithIconClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearchInput?: () => void;
  value?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  onBlur?: any;
  groupsOptions?: string[];
  accountNameOptions?: string[];
  onClick?: any;
  activeTabMain?: any;
}

const SearchInputWithOptionsTabs: FC<ISearchInputProps> = ({
  wrapperClassName,
  divClassName,
  inputClassName,
  placeHolder,
  inputWithIconClassName,
  clearSearchInput,
  onChange,
  value,
  inputRef,
  onBlur,
  groupsOptions = [],
  accountNameOptions = [],
  activeTabMain,
  ...rest
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"groups" | "accounts">("groups");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentOptions =
    activeTab === "groups" ? groupsOptions : accountNameOptions;

  const filteredOptions = value
    ? currentOptions.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      )
    : currentOptions;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      setDropdownVisible(true);
    },
    [onChange]
  );

  const handleOptionClick = useCallback(
    (option: string) => {
      if (option !== activeTabMain && onChange) {
        onChange({
          target: { value: option },
        } as React.ChangeEvent<HTMLInputElement>);
      }
      setDropdownVisible(false); // Close the dropdown after selecting an option
    },
    [onChange, activeTabMain]
  );

  const handleClearInput = useCallback(() => {
    if (clearSearchInput) clearSearchInput();
    setDropdownVisible(false); // Optionally close dropdown when clearing
  }, [clearSearchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative !w-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-transparent",
        divClassName
      )}
      ref={wrapperRef}
    >
      <div
        className={cn(
          "flex w-full h-[2.4rem] !px-4 justify-between items-center gap-x-3 flex-shrink-0 flex-wrap border border-borderLight dark:!border-backGround  bg-white dark:!bg-darkHoverBgBtn ",
          isDropdownVisible && filteredOptions.length > 0
            ? "border-l-[1px] border-r-[1px] border-t-[1px] border-b-0 rounded-tr-lg rounded-tl-lg"
            : "rounded-lg"
        )}
      >
        <div
          className={cn(
            "flex items-center w-full h-full",
            inputWithIconClassName
          )}
        >
          <Input
            ref={inputRef}
            onBlur={onBlur}
            onChange={handleInputChange}
            value={value ?? ""}
            {...rest}
            placeholder={placeHolder}
            className={cn(
              "placeholder:text-[0.9375rem] h-9 bg-white dark:!bg-darkHoverBgBtn  px-0 placeholder:font-normal placeholder:leading-6 placeholder-delta border-none w-full text-whiteColor",
              inputClassName
            )}
            onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
          />
          {value && (
            <div onClick={handleClearInput}>
              <Icons.CancelInput className="cursor-pointer w-6 h-6 text-whiteColor" />
            </div>
          )}
          <Icons.Search className="w-[1.3125rem] h-[1.3125rem] text-whiteColor" />
        </div>
      </div>

      {isDropdownVisible && (
        <div className="absolute -mt-[0.1px] w-full bg-white dark:bg-darkHoverBgBtn  border-l-[1px] border-r-[1px] border-b-[1px] border-t-0 border-borderLight dark:border-backGround  rounded-bl-lg rounded-br-lg max-h-[15rem] overflow-auto z-30 scrollbar-hide">
          <div className="flex p-2 items-center gap-2">
            {groupsOptions.length > 0 && (
              <div
                className={cn(
                  "flex-1 text-center py-2 bg-white dark:!bg-backgroundApp cursor-pointer rounded-md border",
                  activeTab === "groups"
                    ? "border-darkBlue  dark:border-primary bg-darkBlue  text-white dark:text-primary"
                    : "border-borderLight dark:border-backGround  text-default dark:text-white"
                )}
                onClick={() => setActiveTab("groups")}
              >
                Groups
              </div>
            )}
            {accountNameOptions.length > 0 && (
              <div
                className={cn(
                  "flex-1 text-center py-2 bg-white dark:bg-backgroundApp  cursor-pointer rounded-md border",
                  activeTab === "accounts"
                    ? "border-darkBlue  dark:border-primary bg-darkBlue  text-white dark:text-primary"
                    : "border-borderLight dark:border-backGround  text-default dark:text-white"
                )}
                onClick={() => setActiveTab("accounts")}
              >
                Accounts
              </div>
            )}
          </div>
          <ul className="max-h-[8rem] overflow-auto scrollbar-hide">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className={cn(
                    "px-6 py-2 cursor-pointer hover:text-lightGreen dark:hover:text-primary text-default dark:text-white max-w-full truncate",
                    option === activeTabMain
                      ? "text-lightGreen dark:text-primary cursor-not-allowed"
                      : ""
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    option !== activeTabMain && handleOptionClick(option)
                  }
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-6 py-2 text-white max-w-full truncate">
                No Data Found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInputWithOptionsTabs;
