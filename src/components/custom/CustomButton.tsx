import React from "react";
import { Icons } from "../icons/Icons";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
  dirty?: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
  types?: "active" | "stop";
}

const CustomButton: React.FC<ButtonProps> = ({
  type = "submit",
  disabled = false,
  onClick,
  isSubmitting = false,
  isValid = true,
  dirty = true,
  children,
  isLoading = false,
  types,
}) => {
  const baseButtonClasses =
    "font-semibold py-2 px-4 rounded-md h-8 whitespace-nowrap border flex items-center justify-center gap-2 outline-none disabled:cursor-not-allowed";

  const typeClasses = (() => {
    switch (types) {
      case "active":
        return "bg-backGroundBtn  text-hoverActiveBtn  border-none";
      case "stop":
        return "bg-darkHoverBgBtn  text-white border-backGround  hover:text-red transform transition duration-500";
      default:
        return "bg-darkHoverBgBtn  text-white border-backGround  hover:text-primary transform transition duration-500";
    }
  })();

  return (
    <div className="w-full flex items-end justify-end z-20 outline-none">
      <button
        type={type}
        disabled={isSubmitting || !isValid || !dirty || disabled}
        onClick={onClick}
        className={`${baseButtonClasses} ${typeClasses}`}
      >
        {isLoading ? (
          <Icons.Spinner className="text-white w-5 h-5" />
        ) : (
          children
        )}
      </button>
    </div>
  );
};

export default CustomButton;
