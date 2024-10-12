import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { ErrorMessage } from "./ErrorMessage";

interface ILabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hasCounter?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  isReviewErrorMessage?: string | null;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  errorClassName?: string;
  requiredErrorText?: string;
  isRequired?: boolean;
  id?: string;
  isNumericOnly?: boolean; // New prop to enforce numeric input
  isSleep?: boolean;
}

const LabelInput: FC<ILabelInputProps> = ({
  label,
  hasCounter,
  error,
  inputClassName,
  labelClassName,
  isReviewErrorMessage,
  wrapperClassName,
  errorClassName,
  onBlur,
  requiredErrorText,
  isRequired,
  id,
  isNumericOnly = false, // Default to false
  isSleep,
  ...rest
}) => {
  // Function to handle numeric-only input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumericOnly) {
      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    }
    if (rest.onChange) {
      rest.onChange(e); // Trigger the original onChange event
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-start gap-2 self-stretch w-full",
        wrapperClassName
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div
          className={cn(
            "flex items-center gap-1 flex-1",
            isRequired && "gap-[0.56rem]"
          )}
        >
          <div className="w-full flex items-center justify-between h-fit">
            <label
              htmlFor={rest.name}
              className={cn(
                "font-normal !text-xs-plus capitalize text-default dark:label",
                labelClassName
              )}
            >
              {label}
            </label>
            <div className="!h-8"></div>
          </div>
        </div>
        {hasCounter && (
          <p className="font-normal text-[0.8125rem] text-delta">
            {`${rest.value?.toString().length ?? 0} / ${
              rest.maxLength
            } Max Characters`}
          </p>
        )}
      </div>
      {isSleep ? (
        <div className="flex items-center justify-between w-full h-[2.5rem] bg-white dark:bg-backgroundInput border border-borderLight dark:border-borderInput text-default dark:!text-white text-xs-plus placeholder:text-nickle  py-2.5 px-3 gap-2 self-stretch rounded-lg font-normal focus:ring-0 focus:outline-none">
          <input
            {...rest}
            id={id}
            className={cn(
              "w-full !h-8 bg-transparent focus:ring-0 focus:outline-none",
              inputClassName
            )}
            onInput={handleInput} // Add the custom input handler
            inputMode={isNumericOnly ? "numeric" : undefined} // Suggests a numeric keypad on mobile
            pattern={isNumericOnly ? "[0-9]*" : undefined} // Ensures numeric input
            onBlur={onBlur}
          />
          <div className="w-fit h-fit flex items-center justify-center text-white dark:text-white bg-darkBlue dark:bg-whiteColor px-1 py-[0.1rem] rounded-[6px]">
            sec
          </div>
        </div>
      ) : (
        <input
          {...rest}
          id={id}
          className={cn(
            "w-full h-11 bg-white dark:bg-backgroundInput border border-borderLight dark:border-borderInput text-default dark:!text-white text-xs-plus placeholder:text-nickle  py-2.5 px-3 items-center gap-2 self-stretch rounded-lg font-normal focus:ring-0 focus:outline-none",
            inputClassName
          )}
          onInput={handleInput} // Add the custom input handler
          inputMode={isNumericOnly ? "numeric" : undefined} // Suggests a numeric keypad on mobile
          pattern={isNumericOnly ? "[0-9]*" : undefined} // Ensures numeric input
          onBlur={onBlur}
        />
      )}

      <ErrorMessage
        message={error}
        className={cn(`left-1 -bottom-6`, errorClassName)}
      />
    </div>
  );
};

export default LabelInput;
