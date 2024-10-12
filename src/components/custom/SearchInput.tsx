import React, { FC } from "react";
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
}
const SearchInput: FC<ISearchInputProps> = ({
  wrapperClassName,
  inputClassName,
  placeHolder,
  inputWithIconClassName,
  clearSearchInput,
  onChange,
  value,
  ...rest
}) => {
  return (
    <div
      className={`${cn(
        "flex w-[40%]  h-[2.8125rem] pl-[0.94rem] pr-[0.63rem] justify-between items-center gap-x-3 flex-shrink-0 flex-wrap rounded-lg border border-border bg-transparent",
        wrapperClassName
      )} `}
    >
      <div
        className={cn(
          "flex items-center w-full h-full",
          inputWithIconClassName
        )}
      >
        <Icons.Search className="w-[1.3125rem] h-[1.3125rem] text-whiteColor" />
        <Input
          onChange={onChange}
          value={value ?? ""}
          {...rest}
          placeholder={placeHolder}
          className={`${cn(
            "placeholder:text-[0.9375rem] h-full placeholder:font-normal placeholder:leading-6 placeholder-delta border-none w-full text-whiteColor",
            inputClassName
          )} `}
        />
        {value && (
          <div onClick={clearSearchInput}>
            <Icons.CancelInput className="cursor-pointer w-6 h-6 text-whiteColor" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
