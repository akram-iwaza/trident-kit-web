import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons/Icons";
import ModalHeader from "../custom/ModalHeader";
import { cn } from "../../lib/utils";
import ButtonTabs from "../custom/ButtonTabs";

interface IDeleteModalProps {
  slug: string | string[] | undefined;
  isLoading?: boolean;
  callback: (slug: string | string[]) => void;
  onClose: () => void;
  title?: string;
  setSelectedTasks?: any;
}

const DeleteModal: FC<IDeleteModalProps> = ({
  callback,
  isLoading,
  slug,
  onClose,
  title,
  setSelectedTasks,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Enter") {
        if (slug) callback(slug);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <ModalHeader onClose={onClose} label="Are You Sure?">
      <div className="w-full flex flex-col items-start gap-[22px]">
        <div
          className={cn(
            `w-full flex flex-col items-start max-w-[258px]`,
            title && "max-w-full"
          )}
        >
          {title ? (
            <span className="text-base font-normal text-default dark:text-textSwitch ">
              {title}
            </span>
          ) : (
            <span className="text-base font-normal text-default dark:text-textSwitch ">
              Are you sure you want to proceed? This action can’t be undone.
            </span>
          )}
        </div>
        <div className="w-full grid grid-cols-2 gap-[10px]">
          <ButtonTabs
            buttonClassName="w-full h-[37px]"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </ButtonTabs>
          <ButtonTabs
            buttonClassName="w-full h-[37px]"
            isLoading={isLoading}
            onClick={(): void => {
              callback(slug ?? "");
              if (setSelectedTasks) {
                setSelectedTasks([]);
              }
            }}
            type="active"
          >
            Confirm
          </ButtonTabs>
        </div>
      </div>
    </ModalHeader>
  );
};

export default DeleteModal;
