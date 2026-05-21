"use client";

import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ProgressSidebarItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label?: string;
  selected?: boolean;
}

export default function ProgressSidebarItem({
  label = "직무",
  selected = false,
  className,
  type = "button",
  ...buttonProps
}: ProgressSidebarItemProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={clsx(
        "group flex w-[246px] items-center justify-between rounded-toast-s p-3 transition-shadow",
        selected
          ? "bg-fill-quaternary-default shadow-card hover:shadow-hover active:shadow-hover"
          : "bg-fill-quaternary-assistive hover:shadow-card active:bg-fill-quaternary-default active:shadow-hover",
        className,
      )}
      {...buttonProps}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className={clsx(
            "truncate text-label14-med tracking-normal [font-feature-settings:'liga'_off,'clig'_off]",
            selected
              ? "text-text-neutral-description"
              : "text-text-neutral-disabled group-active:text-text-neutral-description",
          )}
        >
          {label}
        </span>
      </span>
    </button>
  );
}
