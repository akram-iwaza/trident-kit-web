import React, { FC, useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Icons } from "../icons/Icons";
import { Input } from "../ui/input";

interface ISearchInputProps {
  inputClassName?: string;
  wrapperClassName?: string;
  placeHolder?: string;
  inputWithIconClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearchInput?: () => void;
  value?: string;
  options?: string[];
  disabled?: boolean;
  id?: string;
}

const SearchInputWithOptions: FC<ISearchInputProps> = ({
  wrapperClassName,
  inputClassName,
  placeHolder,
  inputWithIconClassName,
  clearSearchInput,
  onChange,
  value,
  options = [],
  disabled,
  id,
  ...rest
}) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    setDropdownVisible(true);
  };

  const handleOptionClick = (option: string) => {
    if (onChange)
      onChange({
        target: { value: option },
      } as React.ChangeEvent<HTMLInputElement>);
    setDropdownVisible(false);
  };

  useEffect(() => {
    if (value) {
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    <div className={cn(`relative w-full`, wrapperClassName)} ref={wrapperRef}>
      <div
        className={`${cn(
          "flex w-full h-[2.8125rem] pl-[0.94rem] pr-[0.63rem] rounded-lg justify-between items-center gap-x-3 flex-shrink-0 flex-wrap border border-borderLight dark:border-backGround   bg-white dark:bg-darkHoverBgBtn ",
          wrapperClassName,
          isDropdownVisible && filteredOptions.length > 0
            ? "border-l-[1px] border-r-[1px]  border-t-[1px]  border-b-0 rounded-tr-lg rounded-tl-lg"
            : "rounded-lg"
        )}`}
      >
        <div
          id={id}
          className={cn(
            "flex items-center w-full h-full",
            inputWithIconClassName
          )}
        >
          <Icons.Search className="w-[1.3125rem] h-[1.3125rem] text-whiteColor" />
          <Input
            onChange={handleInputChange}
            value={value ?? ""}
            {...rest}
            disabled={disabled}
            placeholder={placeHolder}
            className={`${cn(
              "placeholder:text-[0.9375rem] h-full placeholder:font-normal placeholder:leading-6 placeholder-delta border-none w-full text-default dark:text-whiteColor",
              inputClassName
            )} `}
            onFocus={() => setDropdownVisible(true)}
          />
          {value && (
            <div onClick={clearSearchInput}>
              <Icons.CancelInput className="cursor-pointer w-6 h-6 text-default dark:text-whiteColor" />
            </div>
          )}
        </div>
      </div>
      {isDropdownVisible && filteredOptions.length > 0 && (
        <ul className="absolute -mt-[1.5px] w-full bg-white dark:bg-darkHoverBgBtn  border-l-[1px] border-r-[1px]  border-b-[1px]  border-t-0 border-borderLight dark:border-backGround   rounded-bl-lg rounded-br-lg  max-h-[10rem] overflow-auto z-30 scrollbar-hide">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-6 py-2 cursor-pointer hover:text-lightGreen dark:hover:text-primary text-default dark:text-white max-w-full truncate"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInputWithOptions;
