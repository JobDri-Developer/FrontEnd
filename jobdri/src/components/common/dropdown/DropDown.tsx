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
    <div className={clsx("relative inline-flex w-fit", className)}>
      {/* 트리거 버튼 */}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center   justify-between rounded-8 border border-line-neutral-default bg-fill-quaternary-default pr-3 pl-5 py-2 text-gray-700 hover:bg-gray-50"
      >
        <span className="text-sm font-medium">{selectedOption.label}</span>
        <Icon
          type={open ? "ARROW_UP_M" : "ARROW_DOWN_M"}
          className="shrink-0 text-icon-neutral-default"
        />
      </button>

      {/* 리스트 박스 */}
      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 z-20 flex w-full flex-col overflow-hidden rounded-cta-s shadow-card border border-gray-200 bg-white"
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
                  className={clsx(
                    "w-full px-4 py-3 text-left text-label14-med text-text-neutral-description hover:bg-fill-quaternary-default-hover",
                    selected && "bg-fill-quaternary-default-pressed",
                  )}
                >
                  {option.label}
                </button>
                {/* 구분선 */}
                {index < options.length - 1 && (
                  <div className="h-px w-full bg-gray-100" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
