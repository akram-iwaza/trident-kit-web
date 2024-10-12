import React, { useState } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { Icons } from "../icons/Icons";
import { cn } from "../../lib/utils";

interface DelayInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  wrapperClassName?: string;
  delayUnit?: string;
  error?: any;
  errorClassName?: string;
  onBlur?: any;
  wrapperInputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  isDecimal?: boolean;
}

const DelayInput: React.FC<DelayInputProps> = ({
  label,
  value,
  onChange,
  wrapperClassName,
  delayUnit,
  error,
  errorClassName,
  onBlur,
  wrapperInputClassName,
  labelClassName,
  disabled,
  isDecimal,
}) => {
  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  return (
    <div className={cn(`flex flex-col w-full relative`, wrapperClassName)}>
      <label
        className={cn(
          `mb-2 text-default dark:!text-placeholder   text-xs-plus font-normal`,
          labelClassName
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          `flex items-center bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-white rounded-md px-4 py-2 justify-between  shadow-[0_4px_30px_rgba(0,0,0,0.1)] `,
          wrapperInputClassName
        )}
      >
        <input
          type="number"
          disabled={disabled}
          value={isNaN(value) ? "" : value} // Handle NaN by showing an empty string
          onBlur={onBlur}
          placeholder="0000"
          onChange={(e) => {
            const inputValue = e.target.value;

            // Allow empty string
            if (inputValue === "") {
              onChange(""); // Set state to an empty string
            } else {
              const parsedValue = parseInt(inputValue, 10);
              onChange(isNaN(parsedValue) ? 0 : parsedValue); // Set 0 if NaN, otherwise use the parsed value
            }
          }}
          className="bg-transparent w-[70px] text-default dark:text-white text-[16px] outline-none no-arrows placeholder:text-placeholder"
        />

        <div className="flex items-center gap-[14px]">
          {delayUnit && (
            <span className="text-default dark:text-placeholder ">
              {delayUnit}
            </span>
          )}
          <div className="flex items-center border-l border-borderLight dark:border-backGround  gap-[10px] pl-[14px]">
            <button disabled={disabled} type="button" onClick={handleIncrement}>
              <Icons.PlusBtn className="w-5 h-5 text-default dark:text-placeholder  dark:hover:text-white transition-colors" />
            </button>
            <button disabled={disabled} type="button" onClick={handleDecrement}>
              <Icons.Minus className="w-5 h-5 text-default dark:text-placeholder  dark:hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
      <ErrorMessage
        message={error}
        className={cn(`left-1 -bottom-4`, errorClassName)}
      />
    </div>
  );
};

export default DelayInput;
