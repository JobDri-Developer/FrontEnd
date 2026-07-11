"use client";

import clsx from "clsx";

export interface ChipTagProps {
  label: string;
  color?: "default" | "blue" | "green" | "red" | "pink";
  // state?: "default" | "proven" | "mentioned" | "fabricated";
  className?: string;
}

const styles: Record<NonNullable<ChipTagProps["color"]>, string> = {
  default:
    "border border-line-neutral-default bg-fill-quaternary-default text-text-neutral-description",
  blue: " bg-fill-primary-assistive text-text-primary-strong",
  green: "bg-green-300 text-green-800",
  red: " bg-fill-system-fail-hover text-system-fail",
  pink: "bg-fill-sub-pink-hover text-fill-sub-pink-default",
};

export default function ChipTag({
  label,
  color = "default",
  className,
}: ChipTagProps) {
  return (
    <div
      className={clsx(
        "inline-flexw-fit items-center justify-center gap-2.5 rounded-chip-s px-1.5 py-1 text-cap12-semibold ",
        styles[color],
        className,
      )}
    >
      {label}
    </div>
  );
}
