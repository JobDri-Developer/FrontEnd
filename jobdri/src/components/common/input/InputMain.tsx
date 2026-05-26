"use client";

import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import { getWrapperClass, getFieldClass } from "./inputStyles";

interface InputMainProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  inputType?: React.HTMLInputTypeAttribute;
  name?: string;
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
  hasError?: boolean;
  error?: string;
  rightContent?: React.ReactNode;
  className?: string;
  gapClassName?: string;
  labelClassName?: string;
  type?: "ID" | "PASSWORD" | "EMAIL";
}

export function InputMain({
  label,
  required,
  placeholder,
  value: externalValue,
  onChange,
  inputType,
  name,
  autoComplete,
  maxLength,
  disabled = false,
  hasError = false,
  error,
  rightContent,
  className,
  gapClassName = "gap-1.5",
  labelClassName,
  type,
}: InputMainProps) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const value = externalValue ?? internalValue;

  const iconMap = {
    ID: "PROFILE",
    PASSWORD: "PASSWORD",
    EMAIL: "EMAIL",
  } as const;

  const resolvedInputType =
    inputType ?? (type === "PASSWORD" ? "password" : "text");
  const isError = hasError || !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className={clsx("flex flex-col", gapClassName, className)}>
      {label && (
        <span
          className={clsx(
            "text-label14-semibold text-text-neutral-title",
            labelClassName,
          )}
        >
          {label}
          {required && <span className="text-text-system-fail ml-0.5">•</span>}
        </span>
      )}

      <div className={getWrapperClass(focused, disabled, isError)}>
        <div className={clsx("flex items-center gap-2")}>
          {!focused && !value && (
            <Icon
              type={type ? iconMap[type] : "PROFILE"}
              className="text-icon-neutral-weak shrink-0"
            />
          )}
          <input
            type={resolvedInputType}
            name={name}
            autoComplete={autoComplete}
            maxLength={maxLength}
            className={clsx(
              getFieldClass(disabled),
              "flex-1 min-w-0 text-sub14-reg",
              type === "PASSWORD" && value && "text-[60px] tracking-[3px]",
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
                isError ? "text-text-system-fail" : "text-text-neutral-caption",
              )}
            >
              {rightContent}
            </div>
          )}
        </div>
      </div>

      {error && (
        <span className="text-cap12-med text-right text-text-system-fail">
          {error}
        </span>
      )}
    </div>
  );
}
