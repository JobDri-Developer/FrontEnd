"use client";

import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/icons/Icon";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({
  placeholder = "기업명을 입력하세요",
  value: externalValue,
  onChange,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const value = externalValue ?? internalValue;
  const isActive = focused || value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-2 px-4 py-3 rounded-chip-l transition-colors",
        isActive
          ? "bg-fill-quaternary-default border border-line-neutral-strong"
          : "bg-fill-quaternary-assistive border border-line-neutral-default",
      )}
    >
      <Icon type="SEARCH" className="text-icon-neutral-default shrink-0" />
      <input
        className="flex-1 bg-transparent outline-none text-sub-14-reg text-text-title placeholder:text-text-neutral-disabled"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
