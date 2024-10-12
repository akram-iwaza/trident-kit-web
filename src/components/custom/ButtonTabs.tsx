import React from "react";
import { Icons } from "../icons/Icons";
import { cn } from "../../lib/utils";

interface ButtonTabsProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  showShortcut?: boolean;
  shortcutText?: string;
  type?:
    | "active"
    | "stop"
    | "hover-active"
    | "disabled-active"
    | "disabled"
    | "default"
    | "stop-all"
    | "disabled-stopAll";
  buttonClassName?: string;
  typeButton?: "button" | "submit" | "reset";
  isSubmitting?: boolean;
  isValid?: boolean;
  dirty?: boolean;
  isLoading?: boolean;
  id?: string;
  isSignIn?: boolean;
}

const ButtonTabs: React.FC<ButtonTabsProps> = ({
  onClick,
  disabled,
  children,
  showShortcut,
  shortcutText = "",
  type,
  buttonClassName,
  typeButton = "button",
  id,
  isSubmitting,
  isValid,
  dirty,
  isLoading,
  isSignIn,
  ...rest
}) => {
  const baseButtonClasses =
    "!font-normal !text-[16px] py-2 px-4 rounded-md h-8 whitespace-nowrap border flex items-center justify-center gap-2 outline-none disabled:cursor-not-allowed";

  const typeClasses = (() => {
    switch (type) {
      case "active":
        return "bg-darkBlue  dark:bg-activeDarkBg  text-white dark:text-primary  border-none dark:hover:text-primary  hover:bg-darkBlueHover   dark:hover:bg-hoverDeftBtn  transform transition duration-500";
      case "hover-active":
        return "bg-defaultBg  text-white border-backGround   hover:bg-hoverDeftBtn  hover:text-hoverActiveBtn  hover:border-backGroundBtn  transform transition duration-500";
      case "stop":
        return "bg-defaultBg  text-white border-backGround  hover:text-red hover:border-darkRed transform transition duration-500";
      case "stop-all":
        return "bg-red dark:bg-darkRedBtn  text-white dark:text-redBtn border-red dark:border-darkRedBtn  hover:bg-error dark:hover:text-red dark:hover:border-darkRed dark:hover:bg-darkRed transform transition duration-500";
      case "disabled-stopAll":
        return "bg-red dark:bg-darkRedBtn  text-white dark:text-redBtn border-red dark:border-darkRedBtn  hover:bg-error  dark:hover:text-red  dark:hover:border-darkRed  dark:hover:bg-darkRed transform transition duration-500";
      case "disabled-active":
        return "bg-darkBlue  dark:bg-disabledActive  text-white dark:text-textDark  border-none dark:hover:text-darkBlue  hover:bg-darkBlueHover   dark:hover:bg-hoverDeftBtn ";
      case "disabled":
        return "bg-white dark:bg-disabledBg  text-default dark:text-white border-borderLight border dark:border-none";
      case "default":
        return "bg-buttonLightMode  dark:bg-defaultBg  text-default dark:text-white border border-borderLight dark:border-backGround  hover:text-default hover:border-borderLight dark:hover:text-white dark:hover:border-backGround  hover:bg-buttonLightModeHover  dark:hover:bg-darkHoverBgBtn  transform transition duration-500 ";
      default:
        return "bg-buttonLightMode  dark:bg-defaultBg  text-default dark:text-white border border-borderLight dark:border-backGround  hover:text-default hover:border-borderLight dark:hover:text-white dark:hover:border-backGround  hover:bg-buttonLightModeHover  dark:hover:bg-darkHoverBgBtn  transform transition duration-500";
    }
  })();

  return (
    <div
      className={cn(
        `relative flex items-center justify-center group outline-none `,
        isSignIn && "w-full justify-between"
      )}
    >
      <button
        id={id}
        type={typeButton}
        onClick={onClick}
        disabled={disabled}
        className={cn(`${baseButtonClasses} ${typeClasses}`, buttonClassName)}
        {...rest}
      >
        {children}
        {(type === "disabled-active" ||
          type === "disabled" ||
          type === "disabled-stopAll") && <Icons.Lock className="w-3 h-3" />}
      </button>
      {showShortcut && shortcutText && (
        <div className="absolute bottom-[-1.5rem] left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-default dark:text-white text-xs rounded px-2 py-1">
            {shortcutText}
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonTabs;
