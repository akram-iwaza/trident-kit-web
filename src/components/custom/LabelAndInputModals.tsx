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
}

const LabelAndInputModals: FC<ILabelInputProps> = ({
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
  ...rest
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-start gap-2 self-stretch w-full",
        wrapperClassName
      )}
    >
      <div className="flex items-center justify-between w-full h-[1.75rem]">
        <div
          className={cn(
            "flex items-center gap-1 flex-1",
            isRequired && "gap-[0.56rem]"
          )}
        >
          {label && (
            <label className="text-sm font-normal text-default dark:text-textSwitch ">
              {label}
            </label>
          )}
        </div>
        {hasCounter && (
          <p className="font-normal text-[0.8125rem] text-delta">
            {`${rest.value?.toLocaleString().length ?? 0} / ${
              rest.maxLength
            } Max Characters `}
          </p>
        )}
      </div>
      <input
        {...rest}
        className={cn(
          "w-full !h-[2.313rem] py-2 px-3.5 bg-white dark:!bg-backGroundDropdown border border-borderLight dark:!border-borderDropdown text-default dark:!text-white text-xs-plus placeholder:!text-placeholder items-center gap-2 self-stretch rounded-lg font-normal focus:ring-0 focus:outline-none  shadow-[0_4px_30px_rgba(0,0,0,0.1)] ",
          inputClassName
        )}
        value={rest.value ?? ""}
        onBlur={onBlur}
      />
      <ErrorMessage
        message={error}
        className={cn(`left-1 -bottom-6`, errorClassName)}
      />
    </div>
  );
};

export default LabelAndInputModals;
