import React, { useEffect } from "react";
import { Icons } from "../icons/Icons";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { animationVariants } from "../../lib/globalVariables";
import ButtonTabs from "./ButtonTabs";

interface ModalHeaderProps {
  label?: string;
  wrapperClassName?: string;
  onClose: (() => void) | undefined;
  children: React.ReactNode;
  animationDirection?: "left" | "right" | "top" | "bottom" | "middle";
  onClear?: (() => void) | null;
  onSubmit?: (() => void) | null;
  disabled?: any;
  textSubmit?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  label,
  onClose,
  wrapperClassName,
  children,
  animationDirection = "middle",
  onClear,
  onSubmit,
  disabled,
  textSubmit,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "enter") {
        onSubmit && onSubmit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmit]);

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center z-30">
      <div
        onClick={onClose}
        className="absolute inset-0 w-full h-screen bg-black/50"
      />
      <motion.div
        initial={animationVariants[animationDirection].initial}
        animate={animationVariants[animationDirection].animate}
        exit={animationVariants[animationDirection].exit}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e): void => {
          e.stopPropagation();
        }}
        className={cn(
          `z-30 inline-flex w-[28rem] h-fit editScrollbar   scrollbar-hide flex-col items-start shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-[0.875rem] dark:shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03),0px_20px_24px_-4px_rgba(16,24,40,0.08)] relative bg-white dark:bg-[#242426] border border-borderLight dark:border-borderDropdown`,
          wrapperClassName
        )}
      >
        <div className="w-full flex items-center justify-between  p-[1.375rem] border-b-[1px] border-borderLight dark:border-borders">
          {label && (
            <h1 className="w-full text-default dark:text-white font-normal text-base">
              {label}
            </h1>
          )}
          <div className="flex items-center gap-5">
            {(onSubmit || onClear) && (
              <>
                <div className="flex items-center gap-2.5">
                  {onClear && (
                    <ButtonTabs typeButton="button" onClick={onClear}>
                      Clear
                    </ButtonTabs>
                  )}

                  {onSubmit && (
                    <ButtonTabs
                      typeButton="submit"
                      disabled={disabled}
                      onClick={onSubmit}
                      type="active"
                    >
                      {textSubmit ? textSubmit : "Create"}
                    </ButtonTabs>
                  )}
                </div>
                <div className="h-[1.563rem] w-[1px] bg-lightBackgroundColor dark:bg-backGround" />
              </>
            )}

            <button
              className="flex w-6 h-6 justify-center items-center gap-2.5 rounded-[1.875rem] cursor-pointer"
              onClick={onClose}
              type="button"
            >
              <Icons.Cancel className="w-5 h-5 text-default dark:text-delta" />
            </button>
          </div>
        </div>
        <div className="w-full  p-[1.375rem] h-full">{children}</div>
      </motion.div>
    </div>
  );
};

export default ModalHeader;
