"use client";

import type {
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";
import { useState } from "react";
import clsx from "clsx";

interface ApplyOptionCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  title?: string;
  description?: string;
  visual?: ReactNode;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

const hoverShadow = "shadow-hover";
const cardShadow = "shadow-card";
const defaultStyle = "border-transparent bg-fill-quaternary-default shadow-card";
const disabledStyle = clsx(
  "cursor-not-allowed border-transparent bg-fill-quaternary-assistive",
  cardShadow,
);
const hoverableStyle = clsx(
  defaultStyle,
  "hover:shadow-hover",
);
const selectedStyle = clsx(
  "border-line-primary-default bg-fill-quaternary-default",
  hoverShadow,
);

export default function ApplyOptionCard({
  title = "가상 공고 지원",
  description = "과거 공고를 기반으로\n모의 서류 평가를 제공합니다.",
  visual,
  selected,
  defaultSelected = false,
  onSelectedChange,
  onClick,
  className,
  type = "button",
  disabled,
  ...buttonProps
}: ApplyOptionCardProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isControlled = selected !== undefined;
  const isSelected = selected ?? internalSelected;

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
        "flex w-[552px] flex-col items-center justify-center gap-8 rounded-card-l border-[1.5px] text-center transition-[background-color,border-color,box-shadow]",
        disabled ? disabledStyle : isSelected ? selectedStyle : hoverableStyle,
        className,
      )}
      aria-pressed={disabled ? undefined : isSelected}
      onClick={handleClick}
      {...buttonProps}
    >
      <div className="flex flex-col items-center justify-center gap-10 self-stretch px-8 py-16">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <span className="self-stretch text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            {title}
          </span>
          <span className="self-stretch whitespace-pre-line text-center text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
            {description}
          </span>
        </div>

        {visual ?? (
          <span
            aria-hidden="true"
            className="block h-[200px] w-[200px] bg-[#F0F0F0]"
          />
        )}
      </div>
    </button>
  );
}
