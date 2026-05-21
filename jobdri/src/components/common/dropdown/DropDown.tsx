"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

export interface DropDownOption {
  label: string;
  value: string;
}

interface DropDownProps {
  options?: DropDownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const defaultOptions: DropDownOption[] = [
  { label: "300자", value: "300" },
  { label: "500자", value: "500" },
  { label: "800자", value: "800" },
  { label: "1,000자", value: "1000" },
  { label: "1,500자", value: "1500" },
  { label: "2,000자", value: "2000" },
];

export default function DropDown({
  options = defaultOptions,
  value,
  defaultValue = "1000",
  onChange,
  className,
}: DropDownProps) {
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;
  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];

  const handleSelect = (nextValue: string) => {
    setInternalValue(nextValue);
    onChange?.(nextValue);
    setOpen(false);
  };

  return (
    <div className={clsx("relative inline-flex w-[104px]", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={clsx(
          "group flex w-[104px] items-center justify-between rounded-cta-s bg-fill-quaternary-default pt-[15px] pr-3 pb-[14px] pl-4 shadow-card transition-shadow hover:shadow-hover",
          open && "shadow-hover",
        )}
      >
        <span className="text-label14-med tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {selectedOption.label}
        </span>
        <Icon
          type={open ? "ARROW_UP_M" : "ARROW_DOWN_M"}
          className="h-6 w-6 shrink-0 text-icon-neutral-assistive group-hover:text-icon-neutral-default"
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-[calc(100%+8px)] left-0 z-20 flex w-[104px] flex-col items-start overflow-hidden rounded-cta-s bg-bg-contents-default shadow-hover"
        >
          {options.map((option, index) => {
            const selected = option.value === selectedValue;

            return (
              <div key={option.value} className="flex w-full flex-col">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(option.value)}
                  className="flex w-full items-center gap-1.5 self-stretch bg-bg-contents-default px-4 py-3 text-left text-label14-med tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off] hover:bg-bg-contents-assistive active:bg-bg-default"
                >
                  {option.label}
                </button>
                {index < options.length - 1 && (
                  <span className="h-px self-stretch bg-line-neutral-default" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
