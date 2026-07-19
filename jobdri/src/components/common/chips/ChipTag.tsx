"use client";

import clsx from "clsx";

export interface ChipTagProps {
  label: string;
  color?: "default" | "blue" | "green" | "red" | "pink";
  state?: "default" | "proven" | "mentioned" | "fabricated";
  className?: string;
}

const colorStyles: Record<NonNullable<ChipTagProps["color"]>, string> = {
  default:
    "border border-line-neutral-default bg-fill-quaternary-default text-text-neutral-description",
  blue: "bg-fill-primary-assistive text-text-primary-strong",
  green: "bg-green-300 text-green-800",
  red: "bg-fill-system-fail-hover text-text-system-fail",
  pink: "bg-fill-sub-pink-hover text-fill-sub-pink-default",
};

const stateColorMap: Record<
  NonNullable<ChipTagProps["state"]>,
  NonNullable<ChipTagProps["color"]>
> = {
  default: "default",
  proven: "green",
  mentioned: "red",
  fabricated: "pink",
};

export default function ChipTag({
  label,
  color = "default",
  state,
  className,
}: ChipTagProps) {
  // 렌더링 우선순위 결정: state가 지정되어 있다면 state 매핑 컬러를, 아니라면 color prop을 사용
  const resolvedColor =
    state && state !== "default" ? stateColorMap[state] : color;

  return (
    <div
      className={clsx(
        "inline-flex w-fit items-center justify-center gap-2.5 rounded-chip-s px-1.5 pt-1 pb-[2.6px] text-cap12-semibold",
        colorStyles[resolvedColor],
        className,
      )}
    >
      {label}
    </div>
  );
}
