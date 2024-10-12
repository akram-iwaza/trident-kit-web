import * as React from "react";
import { cn } from "../../lib/utils";

export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col items-start gap-2">
        <input
          type={type}
          className={cn(
            "flex w-full rounded-[0.3125rem] border border-border bg-transparent px-[0.875rem] py-[0.625rem] text-[0.9375rem]  transition-colors file:border-0 file:bg-transparent file:text-xs-plus file:font-medium placeholder:text-nickle focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <div className="text-danger text-[0.9375rem] font-semibold">
            {error}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
