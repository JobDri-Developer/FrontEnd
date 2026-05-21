"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useState } from "react";
import clsx from "clsx";

interface Method2CardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

const cardShadow = "shadow-card";
const hoverShadow = "shadow-hover";
const defaultStyle = clsx(
  "border-transparent bg-fill-quaternary-default",
  cardShadow,
  "hover:shadow-hover",
);
const disabledStyle = clsx(
  "border-transparent bg-fill-quaternary-assistive",
  cardShadow,
);
const selectedStyle = clsx(
  "border-line-primary-default bg-fill-quaternary-default",
  hoverShadow,
);

export default function Method2Card({
  label = "직접 작성하기",
  selected,
  defaultSelected = false,
  onSelectedChange,
  onClick,
  className,
  type = "button",
  disabled,
  ...buttonProps
}: Method2CardProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isControlled = selected !== undefined;
  const isSelected = selected ?? internalSelected;
  const isActive = !disabled && isSelected;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    const nextSelected = !isSelected;

    if (!isControlled) {
      setInternalSelected(nextSelected);
    }

    onSelectedChange?.(nextSelected);
    onClick?.(event);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "flex w-[1116px] flex-col items-center justify-center gap-3 rounded-card-l border-[1.5px] p-8 text-center transition-[background-color,border-color,box-shadow]",
        disabled ? disabledStyle : isActive ? selectedStyle : defaultStyle,
        className,
      )}
      aria-pressed={disabled ? undefined : isSelected}
      onClick={handleClick}
      {...buttonProps}
    >
      <span className="self-stretch text-center text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {label}
      </span>
    </button>
  );
}
