import React, { FC } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { BiCopy } from "react-icons/bi";
import { Icons } from "../icons/Icons";
import { toast } from "../ui/use-toast";
import { cn } from "../../lib/utils";

interface SettingsInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  wrapperClassName?: string;
  isHidden: boolean;
  onToggleVisibility: () => void;
  disabled?: boolean;
  disabledInput?: boolean;
  isRole?: boolean;
}

const SettingsInput: FC<SettingsInputProps> = ({
  label,
  value,
  onChange,
  wrapperClassName,
  isHidden,
  onToggleVisibility,
  disabled,
  disabledInput,
  isRole,
}) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast({
      variant: "success",
      title: "Value Copied Successfully",
    });
  };

  return (
    <div className={cn("flex flex-col w-full", wrapperClassName)}>
      <label className="mb-2 text-default dark:text-placeholder  text-xs-plus font-normal">
        {label}
      </label>
      <div className="flex items-center bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-white rounded-md px-4 py-2  shadow-[0_4px_30px_rgba(0,0,0,0.1)] ">
        <input
          disabled={disabledInput ?? disabled}
          type={isHidden ? "password" : "text"}
          value={value}
          placeholder={`Write ${label}`}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent flex-grow outline-none text-[16px] font-normal text-default dark:text-white placeholder:text-placeholder"
        />
        {!isRole && (
          <>
            <button
              disabled={disabled}
              onClick={handleCopyToClipboard}
              className="mx-2"
            >
              <Icons.DuplicateBtn className="w-5 h-5 text-default dark:text-placeholder  dark:hover:text-white transition-colors" />
            </button>
            <button disabled={disabled} onClick={onToggleVisibility}>
              {!isHidden ? (
                <Icons.EyeSlashSvg className="w-5 h-5 text-default dark:text-placeholder  dark:hover:text-white transition-colors" />
              ) : (
                <Icons.EyeSvg className="w-5 h-5 text-default dark:text-placeholder  dark:hover:text-white transition-colors" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsInput;
