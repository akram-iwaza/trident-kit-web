import React from "react";
import { ErrorMessage } from "./ErrorMessage";
import { Icons } from "../icons/Icons";
import { cn } from "../../lib/utils";

interface DelayInputStringProps {
  label: string;
  value: string; // Ensuring the value is always a string
  onChange: (value: string) => void; // Ensuring onChange receives a string
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

const DelayInputString: React.FC<DelayInputStringProps> = ({
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
    const newValue = (parseFloat(value || "0") + 0.1).toFixed(1); // Increment by 0.1
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = (parseFloat(value || "0") - 0.1).toFixed(1); // Decrement by 0.1
    if (parseFloat(newValue) >= 0) {
      // Ensure value doesn't go below 0
      onChange(newValue);
    }
  };

  return (
    <div className={cn(`flex flex-col w-full relative`, wrapperClassName)}>
      <label
        className={cn(
          `mb-2 text-default dark:!text-placeholder  text-xs-plus font-normal`,
          labelClassName
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          `flex items-center bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white rounded-md px-4 py-2 justify-between`,
          wrapperInputClassName
        )}
      >
        <input
          type="text" // Changed to text to ensure string input
          disabled={disabled}
          value={value}
          onBlur={onBlur}
          placeholder="0000"
          onChange={(e) => {
            const inputValue = e.target.value;
            // Validate input to allow only valid numbers or empty string
            if (/^-?\d*\.?\d*$/.test(inputValue) || inputValue === "") {
              onChange(inputValue);
            }
          }}
          className="bg-transparent w-full text-default dark:text-white text-[16px] outline-none no-arrows placeholder:text-placeholder"
        />

        <div className="flex items-center gap-[14px]">
          {delayUnit && (
            <span className="text-default dark:text-placeholder ">
              {delayUnit}
            </span>
          )}
          <div className="flex items-center border-l border-borderLight dark:border-backGround  gap-[10px] pl-[14px]">
            <button disabled={disabled} type="button" onClick={handleIncrement}>
              <Icons.PlusBtn className="w-5 h-5 text-default dark:text-placeholder  hover:text-lightGreen dark:hover:text-white transition-colors" />
            </button>
            <button disabled={disabled} type="button" onClick={handleDecrement}>
              <Icons.Minus className="w-5 h-5 text-default dark:text-placeholder  hover:text-lightGreen dark:hover:text-white transition-colors" />
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

export default DelayInputString;
