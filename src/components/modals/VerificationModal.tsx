import React, { FC, useEffect } from "react";
import { cn } from "../../lib/utils";
import { Icons } from "../icons/Icons";
import ModalHeader from "../custom/ModalHeader";

interface IPropsVerificationModal {
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  subTitle?: string;
}
const VerificationModal: FC<IPropsVerificationModal> = ({
  onClose,
  onSubmit,
  title,
  subTitle,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Enter") {
        onSubmit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  return (
    <ModalHeader onClose={onClose}>
      <div
        className={cn(
          `flex pb-[0.63rem] flex-col items-center gap-6 self-stretch`
        )}
      >
        <div className="flex w-12 h-12 p-[0.96rem] flex-col justify-center items-center gap-[0.96rem] rounded-[1.92rem] bg-pink">
          <Icons.Bell className="w-6 h-6 flex-shrink-0 text-danger" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-[19.82rem] text-center">
            <span className="text-2xl font-bold leading-[1.875rem] text-whiteColor">
              {title ?? "Are you sure you want to remove this group?"}
            </span>
          </div>
          {subTitle && (
            <div className={cn("w-[22rem] text-center")}>
              <span className="text-dust text-[0.9375rem] font-normal leading-[1.5rem]">
                {subTitle}
              </span>
            </div>
          )}
        </div>
        <div className="flex pt-[0.625rem] justify-center items-center gap-3 self-stretch">
          <div className="flex justify-center items-center gap-3 flex-1">
            <button
              className="w-fit cursor-pointer rounded-[0.5rem] h-11 px-4 py-3 bg-border text-white text-[0.9375rem] font-semibold hover:bg-activeColor flex items-center justify-center"
              onClick={onClose}
            >
              <span className="text-whiteColor text-[0.9375rem] font-semibold leading-6">
                Cancel
              </span>
            </button>
            <button
              className="w-fit cursor-pointer rounded-[0.5rem] h-11 px-4 py-3 bg-border text-white text-[0.9375rem] font-semibold hover:bg-activeColor flex items-center justify-center"
              onClick={onSubmit}
            >
              <span className="text-whiteColor text-[0.9375rem] font-semibold leading-6">
                Close
              </span>
            </button>
          </div>
        </div>
      </div>
    </ModalHeader>
  );
};

export default VerificationModal;
