"use client";

import { useRef, useState, type ChangeEvent } from "react";
import clsx from "clsx";
import { IconButton } from "@/components/common/buttons";
import Icon from "@/components/common/icons/Icon";
import { Tooltip } from "@/components/common/tooltip";

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  collapsed?: boolean;
  clearable?: boolean;
  className?: string;
  inputClassName?: string;
  collapsedLabel?: string;
  collapsedTooltip?: string;
  onCollapsedClick?: () => void;
}

function CollapsedSearchIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 shrink-0 items-center justify-center"
    >
      <svg
        className="block h-5 w-5"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="scale(1.24415)">
          <path
            d="M7.66797 2.41699C10.5673 2.41717 12.918 4.76761 12.918 7.66699C12.9179 8.90688 12.4865 10.0451 11.7676 10.9434L13.9131 13.0879C14.1406 13.3157 14.1406 13.6853 13.9131 13.9131C13.6854 14.1408 13.3157 14.1407 13.0879 13.9131L10.9434 11.7676C10.0453 12.4859 8.90726 12.9169 7.66797 12.917C4.76867 12.9169 2.41814 10.5663 2.41797 7.66699C2.41797 4.76756 4.76856 2.4171 7.66797 2.41699ZM7.66797 3.58301C5.4129 3.58311 3.58398 5.41189 3.58398 7.66699C3.58416 9.92194 5.413 11.7499 7.66797 11.75C9.92287 11.7498 11.7508 9.9219 11.751 7.66699C11.751 5.41194 9.92298 3.58318 7.66797 3.58301Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </span>
  );
}

export function SearchBar({
  placeholder = "검색어를 입력하세요",
  value: externalValue,
  defaultValue = "",
  onChange,
  collapsed = false,
  clearable = true,
  className,
  inputClassName,
  collapsedLabel = "검색",
  collapsedTooltip = collapsedLabel,
  onCollapsedClick,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = externalValue !== undefined;
  const value = externalValue ?? internalValue;
  const hasValue = value.length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }

    onChange?.("");
    inputRef.current?.focus();
  };

  if (collapsed) {
    return (
      <div
        className={clsx(
          "group relative flex h-9 w-9 items-center justify-center",
          className,
        )}
      >
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-cta-l px-2 text-icon-neutral-default hover:bg-fill-state-hover-light active:bg-fill-state-hover-light"
          aria-label={collapsedLabel}
          onClick={onCollapsedClick}
        >
          <CollapsedSearchIcon />
        </button>
        <div className="pointer-events-none invisible absolute left-[calc(100%+11px)] top-[-1px] z-50 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <Tooltip
            placement="left_mid"
            message={collapsedTooltip}
            showIcon={false}
            className="whitespace-nowrap"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-2 self-stretch rounded-cta-s border border-line-neutral-default bg-bg-contents-default p-1.5",
        className,
      )}
    >
      <span
        className="flex min-w-0 flex-1 items-center gap-2 px-0.5 pt-px pb-0.5"
      >
        <Icon
          type="SEARCH"
          className="h-4 w-4 shrink-0 text-icon-neutral-default"
        />
        <input
          ref={inputRef}
          className={clsx(
            "min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-neutral-disabled",
            "text-cap12-med text-text-neutral-description caret-line-primary-strong [font-feature-settings:'liga'_off,'clig'_off]",
            inputClassName,
          )}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </span>

      {clearable && hasValue && (
        <IconButton
          iconType="CLOSE"
          styleType="weak"
          size="xs"
          buttonType="transparent"
          aria-label="검색어 지우기"
          onClick={handleClear}
        />
      )}
    </div>
  );
}
