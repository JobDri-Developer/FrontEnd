"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useState } from "react";
import clsx from "clsx";
import IconBox from "@/components/common/icons/IconBox";
import type { IconType } from "@/components/common/icons/Icon";

interface Method1CardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  iconType?: IconType;
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
const iconDefaultStyle = "bg-icon-neutral-weak text-icon-neutral-default";
const iconActiveStyle = "bg-fill-primary-assistive text-icon-primary-default";
const iconHoverStyle =
  "group-hover:bg-fill-primary-assistive group-hover:text-icon-primary-default";

export default function Method1Card({
  label = "링크 붙여넣기",
  iconType = "LINK",
  selected,
  defaultSelected = false,
  onSelectedChange,
  onClick,
  className,
  type = "button",
  disabled,
  ...buttonProps
}: Method1CardProps) {
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
        "group flex w-[552px] flex-col items-center justify-center gap-3 rounded-card-l border-[1.5px] p-8 text-center transition-[background-color,border-color,box-shadow]",
        disabled ? disabledStyle : isActive ? selectedStyle : defaultStyle,
        className,
      )}
      aria-pressed={disabled ? undefined : isSelected}
      onClick={handleClick}
      {...buttonProps}
    >
      <IconBox
        type={iconType}
        state={isActive ? "primary" : "secondary"}
        className={clsx(
          "rounded-icon-default transition-colors",
          disabled
            ? iconDefaultStyle
            : isActive
              ? iconActiveStyle
              : clsx(iconDefaultStyle, iconHoverStyle),
        )}
        iconClassName={clsx(
          "aspect-square h-6 w-6 shrink-0 transition-colors",
          disabled
            ? "text-icon-neutral-default"
            : isActive
              ? "text-icon-primary-default"
              : "text-icon-neutral-default group-hover:text-icon-primary-default",
        )}
      />

      <span className="flex-1 text-center text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {label}
      </span>
    </button>
  );
}
