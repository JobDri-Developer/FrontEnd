"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/icons/Icon";

interface Method1CardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

const cardShadow = "shadow-[0_0_24px_0_var(--color-bg-shadow-default)]";
const hoverShadow = "shadow-[0_0_40px_0_var(--color-bg-shadow-strong)]";
const defaultStyle = clsx(
  "border-transparent bg-fill-quaternary-default",
  cardShadow,
  "hover:shadow-[0_0_40px_0_var(--color-bg-shadow-strong)]",
);
const disabledStyle = clsx(
  "cursor-not-allowed border-transparent bg-fill-quaternary-assistive",
  cardShadow,
);
const selectedStyle = clsx(
  "border-line-primary-default bg-fill-quaternary-default",
  hoverShadow,
);
const iconDefaultStyle = "bg-icon-weak text-icon-default";
const iconActiveStyle =
  "bg-fill-primary-assistive text-icon-primary-default";
const iconHoverStyle =
  "group-hover:bg-fill-primary-assistive group-hover:text-icon-primary-default";

export default function Method1Card({
  label = "링크 붙여넣기",
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
      <span
        className={clsx(
          "flex items-center gap-2.5 rounded-icon-default p-2 transition-colors",
          disabled
            ? iconDefaultStyle
            : isActive
            ? iconActiveStyle
            : clsx(iconDefaultStyle, iconHoverStyle),
        )}
      >
        <Icon type="LINK" className="aspect-square h-6 w-6 shrink-0" />
      </span>

      <span className="flex-1 text-center text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {label}
      </span>
    </button>
  );
}
