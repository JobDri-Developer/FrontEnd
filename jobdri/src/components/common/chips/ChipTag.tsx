"use client";

import clsx from "clsx";

export interface ChipTagProps {
  label: string;
  state?: "default";
  className?: string;
}

const styles: Record<NonNullable<ChipTagProps["state"]>, string> = {
  default:
    "border border-line-neutral-default bg-fill-quaternary-default text-text-neutral-description",
};

export default function ChipTag({
  label,
  state = "default",
  className,
}: ChipTagProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center gap-2.5 rounded-chip-s px-1.5 py-1 text-cap12-med tracking-normal [font-feature-settings:'liga'_off,'clig'_off]",
        styles[state],
        className,
      )}
    >
      {label}
    </div>
  );
}
