"use client";

import { useState } from "react";
import clsx from "clsx";
import { getWrapperClass, getFieldClass } from "./inputStyles";

interface InputSingleLineProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function InputSingleLine({
  placeholder,
  value: externalValue,
  onChange,
  disabled = false,
  error,
  className,
}: InputSingleLineProps) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const value = externalValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          "border-line-neutral-strong",
        )}
      >
        <input
          className={getFieldClass(disabled)}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
        />
      </div>

      {error && <span className="text-cap12-med text-text-fail">{error}</span>}
    </div>
  );
}
