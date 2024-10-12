import React, { useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Icons } from "../icons/Icons";

interface DropdownProps {
  options: string[];
  placeholder: string;
  defaultValue: string;
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder,
  defaultValue,
  onSelect,
}) => {
  const [selected, setSelected] = useState<string>(defaultValue);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="w-full h-11">
      <Listbox value={selected} onChange={handleSelect}>
        <div className="relative w-full">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-transparent rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 sm:text-xs-plus border border-border">
            <span className="block truncate text-white">
              {selected || placeholder}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Icons.ChevronDown
                className="w-5 h-5 text-white"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="w-full py-1 mt-10 overflow-auto !z-40 text-xs-plus bg-backgroundApp  border-border border rounded-md shadow-lg max-h-60 focus:outline-none sm:text-xs-plus">
              {options.map((option) => (
                <Listbox.Option
                  key={option}
                  className={({ active, selected }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 z-40 ${
                      active
                        ? "text-activeColor bg-activeColor bg-opacity-10"
                        : "text-white"
                    } ${
                      selected ? "font-medium text-activeColor" : "font-normal"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected
                            ? "font-medium text-activeColor"
                            : "font-normal"
                        }`}
                      >
                        {option}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Icons.CheckTik
                            className="w-5 h-5 text-activeColor"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
