"use client";

import { useState } from "react";
import clsx from "clsx";
import { getWrapperClass, getFieldClass, scrollbarClass } from "./inputStyles";

interface InputMultiLineProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

export function InputMultiLine({
  placeholder,
  value: externalValue,
  onChange,
  disabled = false,
  error,
  rows = 4,
  className,
}: InputMultiLineProps) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const value = externalValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className={clsx("flex flex-col gap-1.5 w-148", className)}>
      <div
        className={getWrapperClass(
          focused,
          disabled,
          !!error,
          "border-line-primary-default",
          "pl-5 pr-4 py-4",
        )}
      >
        <textarea
          className={clsx(
            getFieldClass(disabled),
            clsx(
              "resize-none h-[57px] overflow-y-auto bg-fill-quaternary-assistive",
              scrollbarClass,
            ),
          )}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          rows={rows}
        />
      </div>

      {/* {error && (
        <span className="text-cap12-med text-right text-text-fail">
          {error}
        </span>
      )} */}
    </div>
  );
}
