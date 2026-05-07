"use client";

import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/icons/Icon";
import { getWrapperClass, getFieldClass } from "./inputStyles";

interface InputMainProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export function InputMain({
  label,
  required,
  placeholder,
  value: externalValue,
  onChange,
  disabled = false,
  error,
  rightContent,
  className,
}: InputMainProps) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const value = externalValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <span className="text-label14-semibold text-text-neutral-title">
        {label}
        {required && <span className="text-text-fail ml-0.5">*</span>}
      </span>

      <div className={getWrapperClass(focused, disabled, !!error)}>
        <div className="flex items-center gap-2">
          {disabled && (
            <Icon type="PASSWORD" className="text-icon-assistive shrink-0" />
          )}
          <input
            className={clsx(
              getFieldClass(disabled),
              "flex-1 min-w-0 text-sub14-reg",
            )}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
          />
          {rightContent && (
            <div
              className={clsx(
                "shrink-0 text-cap12-med",
                error ? "text-text-fail" : "text-text-neutral-caption",
              )}
            >
              {rightContent}
            </div>
          )}
        </div>
      </div>

      {error && (
        <span className="text-cap12-med text-right text-text-fail">
          {error}
        </span>
      )}
    </div>
  );
}
