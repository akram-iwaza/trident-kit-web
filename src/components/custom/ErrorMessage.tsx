import { cn } from "../../lib/utils";
import React from "react";

export const ErrorMessage = ({
  message,
  className,
}: {
  message?: string | string[] | undefined;
  className?: string;
}): JSX.Element | null => {
  if (!message) return null;
  let formattedMessage = message;
  if (typeof message === "object")
    formattedMessage = Object.values(message)[0]
      ? String(Object.values(message)[0])
      : "";
  return (
    <p
      className={cn(
        "text-sm text-danger absolute -bottom-5 left-1 leading-4",
        className
      )}
    >
      {formattedMessage}
    </p>
  );
};
