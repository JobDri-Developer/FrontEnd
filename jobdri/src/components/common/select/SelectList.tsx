"use client";

import clsx from "clsx";
import type { SelectOption } from "./Select";
import { SelectListItem } from "./SelectListItem";

export interface SelectListProps {
  id?: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (option: SelectOption) => void;
  className?: string;
}

export function SelectList({
  id,
  options,
  selectedValue,
  onSelect,
  className,
}: SelectListProps) {
  return (
    <div
      id={id}
      role="listbox"
      className={clsx(
        "flex w-[112px] flex-col items-start self-stretch overflow-hidden rounded-cta-s bg-fill-quaternary-default shadow-card",
        className,
      )}
    >
      <div className="flex flex-col items-start self-stretch">
        {options.map((option, index) => {
          const selected = option.value === selectedValue;

          return (
            <SelectListItem
              key={option.value}
              role="option"
              label={option.label}
              selected={selected}
              disabled={option.disabled}
              showDivider={index < options.length - 1}
              onClick={() => onSelect(option)}
            />
          );
        })}
      </div>
    </div>
  );
}
