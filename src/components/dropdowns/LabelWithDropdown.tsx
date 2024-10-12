import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils"; // Assuming you have a utility for classnames
import { Icons } from "../icons/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorMessage } from "../custom/ErrorMessage";

interface LabelWithDropdownProps {
  options: string[];
  placeholder?: string;
  defaultValue?: any;
  onSelect: (value: string | string[]) => void;
  label?: string;
  multiSelect?: boolean;
  error?: string | string[] | undefined;
  disabled?: boolean;
  isSearch?: boolean;
  wrapperClassName?: string;
  isSelectAll?: boolean;
  isLength?: boolean;
  fromFirst?: boolean;
  clearSelectedValues?: boolean;
  setClearSelectedValues: any;
  maxLengthSelect?: number;
  deleteFieldValue: (field: string) => void;
  fieldValue: string;
  notEffect?: boolean;
  deleteSecondValue?: boolean;
  setDeleteSecondValue?: any;
}

const LabelWithDropdown: React.FC<LabelWithDropdownProps> = ({
  options,
  placeholder = "Select...",
  defaultValue = [],
  onSelect,
  label,
  multiSelect = false,
  error,
  disabled = false,
  isSearch = false,
  wrapperClassName,
  isSelectAll = false,
  isLength = false,
  clearSelectedValues,
  setClearSelectedValues,
  fromFirst,
  maxLengthSelect,
  deleteFieldValue,
  fieldValue,
  notEffect,
  deleteSecondValue,
  setDeleteSecondValue,
}) => {
  const isEdit = !(
    defaultValue === "" ||
    defaultValue === undefined ||
    defaultValue?.length === 0 ||
    defaultValue === null
  );
  const [selected, setSelected] = useState<string[]>(
    typeof defaultValue === "string" ? [defaultValue] : defaultValue
  );
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: string) => {
    if (multiSelect) {
      if (selected.includes(option)) {
        setSelected(selected.filter((item) => item !== option));
        onSelect(selected.filter((item) => item !== option));
      } else if (!maxLengthSelect || selected.length < maxLengthSelect) {
        setSelected([...selected, option]);
        onSelect([...selected, option]);
      }
    } else {
      setSelected([option]);
      onSelect(option); // Ensure this returns the correct value
      setIsOpen(false); // Close the dropdown after selection
    }
  };

  const handleClear = (keepOpen: boolean) => {
    setSelected([]);
    setIsOpen(keepOpen);
    setAllSelected(false);
  };

  const handleSelectAll = () => {
    if (!maxLengthSelect || options.length <= maxLengthSelect) {
      setSelected(options);
      onSelect(options);
      setAllSelected(true);
    } else {
      const limitedOptions = options.slice(0, maxLengthSelect);
      setSelected(limitedOptions);
      onSelect(limitedOptions);
      setAllSelected(true);
    }
  };

  const handleDeselectAll = () => {
    setSelected([]);
    onSelect([]);
    setAllSelected(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions =
    options &&
    options.filter(
      (option) =>
        typeof option === "string" &&
        option.toLowerCase().includes(search.toLowerCase())
    );

  const renderSelectedValues = () => {
    if (!fromFirst) {
      if (selected.length === 0) {
        return placeholder;
      }
      if (selected.length === 1) {
        return selected[0];
      }
      if (selected.length === 2) {
        return `${selected[0]}, ${selected[1]}`;
      }
      if (selected.length > 2) {
        return `${selected[0]}, +${selected.length - 1}`;
      }
    } else {
      if (selected.length === 0) {
        return placeholder;
      }
      if (selected.length === 1) {
        return selected[0];
      }
      if (selected.length >= 2) {
        return `${selected[0]}, +${selected.length - 1}`;
      }
    }
  };

  useEffect(() => {
    if (clearSelectedValues) {
      setSelected([]);
      onSelect([]);
      setClearSelectedValues(false);
      setAllSelected(false);
    }
  }, [clearSelectedValues]);

  // Update selected when defaultValue changes
  useEffect(() => {
    if (JSON.stringify(selected) !== JSON.stringify(defaultValue) && isEdit) {
      setSelected(
        typeof defaultValue === "string" ? [defaultValue] : defaultValue
      );
    }
  }, [defaultValue, isEdit]); // Removed notEffect dependency for proper sync

  // Calculate whether to open upwards or downwards based on space
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dropdownHeight = 100; // Approx height of the dropdown
      setOpenUpwards(rect.bottom + dropdownHeight > windowHeight);
    }
  }, [isOpen]);

  useEffect(() => {
    if (deleteSecondValue) {
      setSelected([]);
      setDeleteSecondValue(false);
    }
  }, [deleteSecondValue]);

  return (
    <div
      className={cn(
        "w-full flex flex-col items-start gap-2 relative",
        wrapperClassName
      )}
    >
      <div className="w-full flex items-center justify-between h-[1.75rem]">
        {label && (
          <label className="text-sm font-normal text-default dark:text-textSwitch ">
            {label}
          </label>
        )}
        {isSelectAll && multiSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              allSelected ? handleDeselectAll() : handleSelectAll();
            }}
            disabled={disabled || options.length === 0}
            type="button"
            className="w-fit p-2 bg-white dark:bg-backgroundInput  transform transition duration-500 border border-borderLight dark:border-borders text-xs font-normal text-default dark:text-white h-8 flex items-center justify-center rounded-md hover:border-activeColor disabled:cursor-not-allowed"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>
      <div className="w-full !h-[2.2rem]" ref={dropdownRef}>
        <div
          className={cn(
            `flex !h-[2.2rem] items-center justify-between py-2 px-3.5 bg-white dark:bg-backGroundDropdown border border-borderLight dark:border-borderDropdown cursor-pointer  shadow-[0_4px_30px_rgba(0,0,0,0.1)] `,
            isOpen ? " rounded-tr-lg rounded-tl-lg" : "rounded-lg"
          )}
          onClick={toggleDropdown}
        >
          <span
            className={cn(
              `text-base font-normal line-clamp-1`,
              selected.length > 0
                ? "text-default dark:text-white"
                : "text-placeholder"
            )}
          >
            {renderSelectedValues()}
          </span>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <button
                className="border-none outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear(isOpen);
                  deleteFieldValue(fieldValue);
                }}
              >
                <Icons.Cancel
                  className={cn(`w-5 h-5 text-default dark:text-placeholder `)}
                />
              </button>
            )}
            <Icons.ChevronDown
              className={cn(
                `w-5 h-5 text-default dark:text-placeholder `,
                isOpen ? "rotate-180" : ""
              )}
            />
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                `absolute !z-50 w-full bg-white dark:bg-backGroundDropdown border border-borderLight dark:border-borderDropdown shadow-lg rounded-br-lg rounded-bl-lg`,
                openUpwards ? "bottom-full mb-2" : "top-full"
              )}
            >
              {isSearch && (
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    `w-full font-normal text-base p-2 bg-white dark:bg-backGroundDropdown placeholder:text-placeholder border-b-[1px] border-borderLight dark:border-whiteColor`,
                    !search
                      ? "text-placeholder"
                      : "text-default dark:text-white"
                  )}
                  placeholder="Search..."
                />
              )}
              <ul className="max-h-[80px] overflow-y-auto w-full">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li
                      key={option}
                      className={cn(
                        `flex items-center w-full max-w-full truncate p-2 gap-2.5 cursor-pointer text-placeholder hover:text-lightGreen dark:hover:text-white`,
                        selected.includes(option) &&
                          "text-lightGreen dark:text-primary"
                      )}
                      onClick={() => handleSelect(option)}
                    >
                      {selected.includes(option) ? (
                        <div className="w-4 h-4 rounded-[4px] bg-lightGreen border border-lightGreen dark:border-none dark:bg-bgGray  mt-1" />
                      ) : (
                        <div className="w-4 h-4 rounded-[4px] bg-white dark:bg-shortcutBackground  border border-borderLight dark:border-nickle  mt-1" />
                      )}
                      {option}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-default dark:text-placeholder text-center">
                    No options match your search
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ErrorMessage message={error} className="left-1 -bottom-4" />
    </div>
  );
};

export default LabelWithDropdown;
