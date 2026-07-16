"use client";

import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export interface SelectListItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  showDivider?: boolean;
  itemClassName?: string;
  dividerClassName?: string;
}

export function SelectListItem({
  label,
  selected = false,
  showDivider = false,
  itemClassName,
  dividerClassName,
  className,
  ...buttonProps
}: SelectListItemProps) {
  return (
    <div
      className={clsx("flex w-[112px] flex-col items-start", itemClassName)}
    >
      <button
        type="button"
        aria-selected={buttonProps.role === "option" ? selected : undefined}
        className={clsx(
          "flex items-center gap-1.5 self-stretch bg-fill-quaternary-default px-4 py-3 text-left text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off] hover:bg-fill-quaternary-default-hover active:bg-fill-quaternary-default-pressed disabled:cursor-default disabled:text-text-neutral-disabled",
          selected && "bg-fill-quaternary-assistive",
          className,
        )}
        {...buttonProps}
      >
        <span className="flex items-center gap-0">{label}</span>
      </button>

      {showDivider && (
        <span
          className={clsx(
            "h-px self-stretch bg-line-neutral-default",
            dividerClassName,
          )}
        />
      )}
    </div>
  );
}
