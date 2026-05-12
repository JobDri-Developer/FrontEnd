"use client";

import clsx from "clsx";

interface ChipTagProps {
  label: string;
  // 나중에 "active"나 "disabled" 등이 추가될 것을 대비해 유니온 타입으로 유지합니다.
  state?: "default";
  className?: string;
}

// Record의 키 타입을 ChipTagProps의 state로 지정하여 타입 안정성을 높입니다.
const styles: Record<NonNullable<ChipTagProps["state"]>, string> = {
  default:
    "bg-fill-quaternary-default border border-line-neutral-default text-text-neutral-title hover:shadow-chip",
};

export default function ChipTag({
  label,
  state = "default",
  className,
}: ChipTagProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center rounded-chip-m px-1.5 py-1 text-cap12-med transition-all",
        styles[state],
        className,
      )}
    >
      {label}
    </div>
  );
}
