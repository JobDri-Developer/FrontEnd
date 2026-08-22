"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import { Tooltip } from "@/components/common/tooltip/Tooltip";
import useOutsideClick from "@/hooks/useOutsideClick";
import { SelectList } from "@/components/common/select/SelectList";

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
  title?: ReactNode;
  showInfoIcon?: boolean;
  infoLabel?: string;
  infoTooltip?: string;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onChange?: (value: string, option: SelectOption) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  titleClassName?: string;
  titleTextClassName?: string;
  infoIconClassName?: string;
  inputFrameClassName?: string;
  triggerClassName?: string;
  menuClassName?: string;
  labelClassName?: string;
}

function SelectInfoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10"
        cy="10"
        r="10"
        fill="var(--color-icon-neutral-assistive)"
      />
      <path
        d="M9.1 8.55H10.9V14.25H9.1V8.55ZM9 5.75H11V7.45H9V5.75Z"
        fill="var(--color-text-neutral-white)"
      />
    </svg>
  );
}

export function Select({
  options,
  value,
  defaultValue,
  placeholder = "선택",
  title,
  showInfoIcon = false,
  infoLabel = "정보",
  infoTooltip = "공고에 명시된 글자수 제한을 선택해 주세요.",
  open,
  defaultOpen = false,
  disabled = false,
  onChange,
  onOpenChange,
  className,
  titleClassName,
  titleTextClassName,
  infoIconClassName,
  inputFrameClassName,
  triggerClassName,
  menuClassName,
  labelClassName,
}: SelectProps) {
  const listboxId = useId();
  const tooltipId = useId();
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
        "relative inline-flex flex-col items-center gap-2",
        className,
      )}
    >
      {title && (
        <div
          className={clsx(
            "flex items-center gap-0.5 self-stretch",
            titleClassName,
          )}
        >
          <div className="flex items-center gap-1.5 py-1 pr-0 pl-0.5">
            <span
              className={clsx(
                "text-b16-med text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]",
                titleTextClassName,
              )}
            >
              {title}
            </span>

            {showInfoIcon && (
              <span
                aria-label={infoLabel}
                aria-describedby={tooltipId}
                role="img"
                tabIndex={0}
                className={clsx(
                  "group relative flex flex-col items-center gap-5 p-1.5 outline-none",
                  infoIconClassName,
                )}
              >
                <SelectInfoIcon className="h-5 w-5" />
                {infoTooltip && (
                  <div className="pointer-events-none invisible absolute top-1/2 left-[calc(100%-2px)] z-30 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100">
                    <Tooltip
                      id={tooltipId}
                      placement="left_mid"
                      message={infoTooltip}
                      showIcon={false}
                      className="whitespace-nowrap [&>div:last-child]:max-w-none [&>div:last-child]:px-5 [&>div:last-child]:py-3 [&_span]:text-b16-med"
                    />
                  </div>
                )}
              </span>
            )}
          </div>
        </div>
      )}

      <div
        className={clsx(
          "flex h-[38px] flex-col items-start gap-2",
          inputFrameClassName,
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
            "group flex h-[38px] flex-col items-center gap-1 rounded-cta-s bg-fill-quaternary-assistive py-2 pr-3 pl-5 text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off] disabled:cursor-default disabled:text-text-neutral-disabled",
            triggerClassName,
          )}
        >
          <span className="flex items-center gap-1 pt-px">
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
          </span>
        </button>
      </div>

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
