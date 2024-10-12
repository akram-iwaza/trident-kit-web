import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import Select, { components, SingleValueProps } from "react-select";
import { debounce } from "lodash";
import { ErrorMessage } from "../custom/ErrorMessage";
import { cn } from "../../lib/utils";
import { Icons } from "../icons/Icons";

export interface OptionType {
  label: string;
  icon?: JSX.Element;
}

const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {props.data.icon && (
          <span style={{ marginRight: 8 }}>{props.data.icon}</span>
        )}
        {props.data.label}
      </div>
    </components.Option>
  );
};

const CustomSingleValue = (props: SingleValueProps<OptionType>) => {
  const { data, innerProps, selectProps } = props;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const removedValues = Array.isArray(selectProps.value)
      ? selectProps.value
      : [selectProps.value];
    selectProps.onChange(null, {
      action: "clear",
      removedValues: removedValues.filter(Boolean) as OptionType[],
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
      {...innerProps}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {data.icon && <span style={{ marginRight: 8 }}>{data.icon}</span>}
        <span
          style={{
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={data.label}
        >
          {data.label}
        </span>
      </div>
      <span
        style={{
          cursor: "pointer",
          padding: "0 8px",
        }}
        onClick={handleClear}
      >
        <Icons.Cancel className="w-5 h-5 text-whiteColor" />
      </span>
    </div>
  );
};

interface LabelWithDropdownIconsProps {
  options: any[];
  placeholder: string;
  defaultValue?: any;
  onSelect: (value: string | string[]) => void;
  label?: string;
  multiSelect?: boolean;
  error?: string | string[] | undefined;
  disabled?: boolean;
  maxHeightClassName?: string;
  wrapperClassName?: string;
  maxLengthSelect?: number;
  clearSelectedValues?: boolean;
  setClearSelectedValues?: any;
  isSearch?: boolean;
  id?: string;
}

const LabelWithDropdownIcons = ({
  options,
  placeholder,
  defaultValue,
  onSelect,
  label,
  multiSelect = false,
  error,
  disabled = false,
  maxLengthSelect,
  wrapperClassName,
  clearSelectedValues,
  setClearSelectedValues,
  isSearch = false,
  id,
}: LabelWithDropdownIconsProps) => {
  const [selected, setSelected] = useState<OptionType[]>(
    multiSelect ? defaultValue || [] : [defaultValue || null]
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const selectRef: any = useRef(null);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  const handleSelect = useCallback(
    (value: any) => {
      setSearch("");
      setDebouncedSearch("");
      if (multiSelect) {
        const selectedValues = value ? value.map((v: any) => v) : [];
        if (maxLengthSelect && selectedValues.length > maxLengthSelect) {
          return;
        }
        setSelected(selectedValues);
        onSelect(selectedValues.map((v: { label: string }) => v.label));
      } else if (value) {
        setSelected([value]);
        onSelect(value.label);
      } else {
        setSelected([]);
        onSelect("");
      }
      setMenuIsOpen(false);
      setDebouncedSearch("");
    },
    [multiSelect, maxLengthSelect, onSelect]
  );

  useEffect(() => {
    if (clearSelectedValues) {
      setSelected([]);
      onSelect([]);
      setClearSelectedValues(false);
      setDebouncedSearch("");
      setSearch("");
    }
  }, [clearSelectedValues, onSelect, setClearSelectedValues]);

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setMenuIsOpen(false);
        setSearch("");
        setDebouncedSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  return (
    <div
      className={cn(
        "w-full flex flex-col items-start gap-2 relative",
        wrapperClassName
      )}
      ref={selectRef}
    >
      {label && (
        <div className="w-full flex items-center justify-between h-8">
          <label className="!text-xs-plus text-default dark:text-label font-normal leading-5 whitespace-nowrap">
            {label}
          </label>
        </div>
      )}
      <div className="w-full h-11" id={id}>
        <Select
          options={options}
          value={selected}
          onChange={handleSelect}
          isMulti={multiSelect}
          isDisabled={disabled}
          placeholder={placeholder}
          components={{
            Option: CustomOption,
            SingleValue: !multiSelect ? CustomSingleValue : undefined,
          }}
          filterOption={(option, rawInput) => {
            if (!debouncedSearch) return true;
            return option.label
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase());
          }}
          onInputChange={(inputValue, { action }) => {
            if (action === "input-change") {
              setSearch(inputValue);
              debouncedSetSearch(inputValue);
            }
          }}
          maxMenuHeight={200}
          isSearchable={isSearch}
          menuIsOpen={menuIsOpen}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
        />
      </div>
      <ErrorMessage message={error} className="left-1 -bottom-4" />
    </div>
  );
};

export default LabelWithDropdownIcons;
