"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useState } from "react";
import clsx from "clsx";
import { ChipMain } from "@/components/common/chips";

interface ComCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  company?: string;
  chipLabel?: string;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

const hoverShadow = "shadow-[0_0_40px_0_var(--color-bg-shadow-strong)]";

export default function ComCard({
  company = "현대자동차",
  chipLabel = "데이터분석",
  selected,
  defaultSelected = false,
  onSelectedChange,
  onClick,
  className,
  type = "button",
  ...buttonProps
}: ComCardProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isControlled = selected !== undefined;
  const isSelected = selected ?? internalSelected;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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
      className={clsx(
        "flex w-[216px] flex-col items-start justify-center gap-1.5 rounded-card-s border px-4 py-3.5 text-left transition-[background-color,border-color,box-shadow]",
        isSelected
          ? clsx(
              "border-line-primary-default bg-fill-quaternary-default",
              hoverShadow,
            )
          : clsx(
              "border-line-neutral-default bg-fill-quaternary-assistive hover:bg-fill-quaternary-default",
              "hover:shadow-[0_0_40px_0_var(--color-bg-shadow-strong)]",
            ),
        className,
      )}
      aria-pressed={isSelected}
      onClick={handleClick}
      {...buttonProps}
    >
      <div className="flex min-w-0 items-center gap-2.5 self-stretch pl-0.5">
        <span className="min-w-0 truncate text-label14-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {company}
        </span>
      </div>

      <ChipMain label={chipLabel} color="secondary" />
    </button>
  );
}
