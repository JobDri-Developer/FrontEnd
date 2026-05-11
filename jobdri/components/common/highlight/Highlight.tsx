import type { HTMLAttributes } from "react";
import clsx from "clsx";

export type HighlightVariant = "default" | "selected" | "modified";

interface HighlightProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: HighlightVariant;
}

const variantStyles: Record<HighlightVariant, string> = {
  default: "border-line-fail-default",
  selected: "border-line-fail-default bg-fill-fail-default",
  modified: "border-icon-default",
};

export default function Highlight({
  variant = "default",
  className,
  ...spanProps
}: HighlightProps) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "block h-[18px] w-full self-stretch border-b mix-blend-multiply",
        variantStyles[variant],
        className,
      )}
      {...spanProps}
    />
  );
}
