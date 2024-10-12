import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Icons } from "../icons/Icons";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-xs-plus font-medium transition-colors duration-200 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow hover:bg-[#34962f] dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
        destructive:
          "bg-danger text-white hover:bg-error dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/90",
        outline:
          "text-default border border-border bg-transparent hover:shadow hover:bg-lemon hover:text-primary hover:border-delta dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        secondary:
          "bg-gray-100 text-gray-900  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        warning:
          "bg-warning text-default hover:bg-[#e8ac35] dark:hover:bg-gray-800 dark:hover:text-gray-50",
        link: "bg-transparent hover:bg-beije hover:rounded-md",
        icon: "bg-white text-secondary rounded-full hover:text-primary hover:shadow hover:duration-200 dark:text-gray-50",
        dropdown:
          "w-auto bg-transparent cursor-pointer transition-none focus-visible:ring-0",
        empty: "bg-transparent text-default",
        ghost: "",
      },
      size: {
        default: "w-[10rem] h-[2.5rem] px-4 py-2.5",
        sm: "w-[6.25rem] h-[2.5rem] px-4 py-2.5",
        lg: "w-[10rem] h-[2.75rem] px-4 py-2.5",
        xl: "w-[10rem] h-[3rem] px-4 py-2.5",
        full: "w-full px-4 py-2.5",
        icon: "w-[3.125rem] h-[3.125rem]",
        social: "w-[3.5625rem] h-[3.5625rem]",
        link: "w-[2.5rem] h-[2.375rem]",
        empty: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Icons.Spinner className="mr-2 h-4 w-4 text-white" />
        ) : null}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
