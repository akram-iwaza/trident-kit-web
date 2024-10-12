import React, { FC, useEffect, useRef, useState } from "react";
import { Icons } from "../icons/Icons";

interface ILabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  onChange: any;
  initialValues?: string[];
}
const LabelInputNumbered: FC<ILabelInputProps> = ({
  label,
  placeholder,
  onChange,
  initialValues = [""],
}) => {
  const initialInputs = initialValues.length === 0 ? [""] : initialValues;
  const [inputs, setInputs] = useState(initialInputs);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: any, value: any) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    onChange(newInputs);
  };

  const handleKeyPress = (e: any, index: any) => {
    if (
      e.key === "Enter" &&
      index === inputs.length - 1 &&
      inputs[index].trim() !== ""
    ) {
      setInputs([...inputs, ""]);
      inputRefs.current = [...inputRefs.current, null];
    }
  };

  const handleRemoveInput = (index: any) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
    onChange(newInputs);
  };

  useEffect(() => {
    const lastInputRef = inputRefs.current[inputs.length - 1];
    if (lastInputRef) {
      lastInputRef.focus();
    }
  }, [inputs.length]);

  return (
    <div className="relative flex flex-col items-start justify-between self-stretch w-full">
      <div className="w-full flex items-center justify-between">
        {label && (
          <label className="text-sm font-normal text-default dark:text-textSwitch ">
            {label}
          </label>
        )}
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-[10px] max-h-[130px] overflow-y-auto">
        {inputs.map((input, index) => (
          <div key={index} className="flex items-center gap-[15px] w-full">
            <div className="flex items-center content-start w-full h-[2.2rem] rounded-md text-white placeholder:!text-placeholder border border-borderLight dark:border-borderDropdown  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  bg-white dark:bg-backGroundDropdown outline-none p-[10px] gap-[10px]">
              <div className="w-5 h-5 bg-lightGreen dark:bg-activeColor rounded-full flex flex-col items-center justify-center">
                {index + 1}
              </div>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-full bg-white dark:bg-backGroundDropdown outline-none text-default dark:text-white placeholder:!text-placeholder border-none"
                placeholder={`${placeholder}`}
                value={input ?? ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
              {inputs.length > 1 && (
                <div
                  onClick={() => handleRemoveInput(index)}
                  className="cursor-pointer"
                >
                  <Icons.close className="text-default dark:text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelInputNumbered;
