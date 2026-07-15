"use client";

import clsx from "clsx";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export default function Divider({
  orientation = "horizontal",
  spacing = "none",
  className,
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  const spacingStyles = {
    none: "m-0",
    sm: isHorizontal ? "my-3" : "mx-2",
    md: isHorizontal ? "my-5" : "mx-4",
    lg: isHorizontal ? "my-8" : "mx-6",
  };

  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={clsx(
        "shrink-0 border-none bg-line-neutral-assistive",

        isHorizontal
          ? "h-[0.75px] w-full"
          : "h-full w-[0.75px] self-stretch inline-block",

        spacingStyles[spacing],
        className,
      )}
    />
  );
}
