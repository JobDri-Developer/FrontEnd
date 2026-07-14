"use client";

import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

export interface LLMInputSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string;
}

export function LLMInputSubmitButton({
  className,
  iconClassName,
  type = "button",
  disabled,
  ...buttonProps
}: LLMInputSubmitButtonProps) {
  return (
    <button
      type={type}
      aria-label={buttonProps["aria-label"] ?? "입력 내용 전송"}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center gap-2.5 rounded-icon-round p-1.5 transition-colors",
        disabled
          ? "cursor-not-allowed bg-icon-neutral-weak text-icon-neutral-assistive"
          : "cursor-pointer bg-icon-neutral-strong text-icon-neutral-white hover:bg-icon-neutral-strong hover:text-icon-neutral-assistive active:bg-icon-neutral-heavy active:text-icon-neutral-assistive",
        className,
      )}
      {...buttonProps}
    >
      <Icon
        type="ARROW2_UP"
        className={clsx(
          "h-5 w-5 shrink-0 [&_path]:fill-current",
          iconClassName,
        )}
      />
    </button>
  );
}
