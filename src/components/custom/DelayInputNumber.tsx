import React from 'react';
import { ErrorMessage } from './ErrorMessage';
import { Icons } from '../icons/Icons';
import { cn } from '../../lib/utils';

interface DelayInputNumberProps {
    label: string;
    value: any;
    onChange: (value: any) => void;
    wrapperClassName?: string;
    delayUnit?: string;
    error?: any;
    errorClassName?: string;
    onBlur?: any;
    wrapperInputClassName?: string;
    labelClassName?: string;
    disabled?: boolean;
    isDecimal?: boolean;
}

const DelayInputNumber: React.FC<DelayInputNumberProps> = ({
    label,
    value,
    onChange,
    wrapperClassName,
    delayUnit,
    error,
    errorClassName,
    onBlur,
    wrapperInputClassName,
    labelClassName,
    disabled,
    isDecimal,
}) => {
    const handleIncrement = () => {
        const currentValue = parseFloat(value) || 0; // Handle initial empty value as 0
        const newValue = (currentValue + 0.1).toFixed(1);
        onChange(newValue);
    };

    const handleDecrement = () => {
        const currentValue = parseFloat(value) || 0; // Handle initial empty value as 0
        const newValue = (currentValue - 0.1).toFixed(1);
        if (parseFloat(newValue) >= 0) {
            onChange(newValue);
        }
    };

    return (
        <div className={cn(`flex flex-col w-full relative`, wrapperClassName)}>
            <label className={cn(`mb-2 text-default dark:!text-placeholder  text-xs-plus font-normal`, labelClassName)}>{label}</label>
            <div
                className={cn(
                    `flex items-center bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white rounded-md px-4 py-2 justify-between`,
                    wrapperInputClassName
                )}
            >
                <input
                    type="text"
                    disabled={disabled}
                    value={value}
                    onBlur={onBlur}
                    placeholder="0000"
                    onChange={(e) => {
                        const inputValue = e.target.value;

                        // Allow the input to contain only numbers and at most one decimal point
                        if (/^-?\d*\.?\d*$/.test(inputValue) || inputValue === '') {
                            onChange(inputValue); // Pass the input value as is
                        }
                    }}
                    className="bg-transparent w-[70px] text-default dark:text-white text-[16px] outline-none no-arrows placeholder:text-placeholder"
                />

                <div className="flex items-center gap-[14px]">
                    {delayUnit && <span className="text-default dark:text-placeholder ">{delayUnit}</span>}
                    <div className="flex items-center border-l border-backGround  gap-[10px] pl-[14px]">
                        <button disabled={disabled} type="button" onClick={handleIncrement}>
                            <Icons.PlusBtn className="w-5 h-5 text-default dark:text-placeholder  dark:hover:text-white transition-colors" />
                        </button>
                        <button disabled={disabled} type="button" onClick={handleDecrement}>
                            <Icons.Minus className="w-5 h-5 text-default dark:text-placeholder  dark:hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
            <ErrorMessage message={error} className={cn(`left-1 -bottom-4`, errorClassName)} />
        </div>
    );
};

export default DelayInputNumber;
