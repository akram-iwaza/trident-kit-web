import React, { FC, RefObject } from "react";
import { cn } from "../../lib/utils";
import { ErrorMessage } from "../custom/ErrorMessage";

interface ITextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hasCounter?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  isReviewErrorMessage?: string | null;
  counterClassName?: string;
  ref?: RefObject<HTMLTextAreaElement>;
  numberOfCharacters?: string;
  isManageProfile?: boolean;
}

const TextArea: FC<ITextAreaProps> = ({
  error,
  label,
  hasCounter,
  labelClassName,
  inputClassName,
  isReviewErrorMessage,
  counterClassName,
  errorClassName,
  numberOfCharacters,
  isManageProfile,
  ...rest
}) => {
  return (
    <div
      className={
        "relative flex flex-col items-start gap-[0.375rem] self-stretch w-full h-full"
      }
    >
      {label && (
        <div className="flex items-center justify-between w-full">
          <div
            className={cn(
              "flex flex-wrap md:flex-nowrap items-center gap-1 w-full",
              isManageProfile && "justify-between"
            )}
          >
            <label
              htmlFor={rest.name}
              className={cn("font-normal text-[0.9375rem]", labelClassName)}
            >
              {label}
            </label>

            {isManageProfile && (
              <span
                className={cn(
                  "font-normal text-[0.8125rem] text-delta leading-5"
                )}
              >
                {`${numberOfCharacters}  Characters `}
              </span>
            )}
          </div>
          {hasCounter && (
            <p
              className={cn(
                "font-normal text-[0.8125rem] text-delta md:whitespace-nowrap",
                counterClassName
              )}
            >
              {`${rest.value?.toLocaleString().length ?? 0} / ${
                rest.maxLength
              } Max Characters `}
            </p>
          )}
        </div>
      )}
      {isManageProfile && !label && hasCounter && (
        <span
          className={cn(
            "font-normal text-[0.8125rem] text-delta leading-5 absolute right-2 -top-6"
          )}
        >
          {`${rest.value?.toLocaleString().length ?? 0} characters,`} (
          {`${numberOfCharacters} characters`})
        </span>
      )}
      <textarea
        {...rest}
        value={rest.value ?? ""}
        className={cn(
          "min-h-[10.9375rem] py-[0.9375rem] px-5 items-center gap-2 self-stretch rounded-[0.3125rem] border border-borders text-xs-plus font-normal focus:ring-0 focus:outline-none w-full resize-none placeholder-nickle text-default",
          inputClassName
        )}
      />
      <ErrorMessage
        message={error}
        className={cn("left-1 -bottom-6", errorClassName)}
      />
    </div>
  );
};

export default TextArea;
