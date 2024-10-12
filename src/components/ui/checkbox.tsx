import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Icons } from "../icons/Icons";
import { cn } from "../../lib/utils";

interface ICheckboxProps {
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLButtonElement, ICheckboxProps>(
  ({ checked, onCheckedChange, className, disabled, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      disabled={disabled}
      checked={checked}
      onCheckedChange={(checkedValue): void => {
        if (onCheckedChange) {
          onCheckedChange(checkedValue as boolean);
        }
      }}
      className={cn(
        "peer h-[1.125rem] w-[1.125rem] bg-white dark:bg-shortcutBackground  shrink-0 rounded-[0.25rem] border !border-borderLight dark:!border-nickle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:!border-activeColor data-[state=checked]:!bg-activeColor data-[state=checked]:text-white",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Icons.CheckTik className="h-4 w-4 text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
