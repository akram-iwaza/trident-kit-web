import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { ErrorMessage } from "./ErrorMessage";
import { Switch } from "../ui/switch";

interface ILabelAndSwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
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
  onClick: any;
  checked: boolean;
  valueType?: string;
}

const LabelAndSwitch: FC<ILabelAndSwitchProps> = ({
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
  onClick,
  checked,
  valueType,
  ...rest
}) => {
  const isValueType = !!valueType;

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
          <div className="w-full flex items-center justify-between">
            <label
              htmlFor={rest.name}
              className={cn(
                "font-normal !text-sm capitalize text-default dark:!text-textSwitch ",
                labelClassName
              )}
            >
              {label}
            </label>
            <div className="h-8"></div>
          </div>
        </div>
        {hasCounter && (
          <p className="font-normal text-[0.8125rem] text-default dark:text-delta">
            {`${rest.value?.toLocaleString().length ?? 0} / ${
              rest.maxLength
            } Max Characters `}
          </p>
        )}
      </div>
      <div className="w-full flex items-center gap-2">
        <Switch
          className="data-[state=checked]:bg-textStastus data-[state=unchecked]:bg-borders w-10 h-[1.375rem]"
          onClick={onClick}
          checked={checked}
          value={valueType}
        />

        {/* Conditionally render the valueType text if isValueType is true */}
        {isValueType && (
          <div className="text-sm text-gray-500">{valueType}</div>
        )}
      </div>
      <ErrorMessage
        message={error}
        className={cn(`left-1 -bottom-6`, errorClassName)}
      />
    </div>
  );
};

export default LabelAndSwitch;
