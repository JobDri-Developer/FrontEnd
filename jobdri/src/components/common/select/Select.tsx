"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import useOutsideClick from "@/hooks/useOutsideClick";
import { SelectList } from "./SelectList";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onChange?: (value: string, option: SelectOption) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  labelClassName?: string;
}

export function Select({
  options,
  value,
  defaultValue,
  placeholder = "선택",
  open,
  defaultOpen = false,
  disabled = false,
  onChange,
  onOpenChange,
  className,
  triggerClassName,
  menuClassName,
  labelClassName,
}: SelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isValueControlled = value !== undefined;
  const isOpenControlled = open !== undefined;
  const selectedValue = value ?? internalValue;
  const isOpen = open ?? internalOpen;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  const displayLabel = selectedOption?.label ?? placeholder;

  const setOpenState = (nextOpen: boolean) => {
    if (disabled) return;

    if (!isOpenControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (!isValueControlled) {
      setInternalValue(option.value);
    }

    onChange?.(option.value, option);
    setOpenState(false);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setOpenState(false);
      return;
    }

    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setOpenState(true);
    }
  };

  useOutsideClick(rootRef, () => setOpenState(false), isOpen);

  return (
    <div
      ref={rootRef}
      className={clsx(
        "relative inline-flex items-center justify-center gap-4 rounded-cta-s",
        className,
      )}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setOpenState(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        className={clsx(
          "group flex items-center gap-1 rounded-cta-s bg-fill-quaternary-assistive py-2 pr-3 pl-4 text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off] disabled:cursor-default disabled:text-text-neutral-disabled",
          triggerClassName,
        )}
      >
        <span
          className={clsx(
            "flex h-[21px] w-[60px] items-center gap-0 whitespace-nowrap",
            labelClassName,
          )}
        >
          {displayLabel}
        </span>
        <Icon
          type={isOpen ? "ARROW_UP_20" : "ARROW_DOWN_20"}
          className={clsx(
            "h-5 w-5 shrink-0 text-icon-neutral-assistive [&_path]:fill-current",
            !disabled && "group-hover:text-icon-neutral-default",
          )}
        />
      </button>

      {isOpen && (
        <SelectList
          id={listboxId}
          options={options}
          selectedValue={selectedValue}
          onSelect={handleSelect}
          className={clsx(
            "absolute top-[calc(100%+4px)] left-0 z-20",
            menuClassName,
          )}
        />
      )}
    </div>
  );
}
