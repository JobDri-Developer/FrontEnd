"use client";

import clsx from "clsx";

export interface ChipTagProps {
  label: string;
  state?: "default" | "proven" | "mentioned" | "fabricated";
  className?: string;
}

const styles: Record<NonNullable<ChipTagProps["state"]>, string> = {
  default:
    "border border-line-neutral-default bg-fill-quaternary-default text-text-neutral-description",
  proven: "px-1.5 w-fit bg-fill-secondary-default text-text-neutral-title",
  fabricated: "px-1.5 w-fit bg-text-highlight-fabricated text-white",
  mentioned: "px-1.5 w-fit bg-text-highlight-mentioned text-white",
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
