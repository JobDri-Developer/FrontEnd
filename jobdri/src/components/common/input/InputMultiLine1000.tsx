"use client";

import { useState } from "react";
import clsx from "clsx";
import { getWrapperClass, getFieldClass, scrollbarClass } from "./inputStyles";

const DEFAULT_MAX_LENGTH = 1000;

interface InputMultiLine1000Props {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  rows?: number;
  className?: string;
  maxLength?: number;
}

export function InputMultiLine1000({
  placeholder,
  value: externalValue,
  onChange,
  disabled = false,
  error,
  rows = 4,
  className,
  maxLength = DEFAULT_MAX_LENGTH,
}: InputMultiLine1000Props) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const value = externalValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    // 여기서 return을 안 하니까 복붙해도 그대로 다 들어갑니다.
    setInternalValue(next);
    onChange?.(next);
  };

  const isError = value.length > maxLength || !!error;

  return (
    <div className={clsx("flex flex-col gap-1.5 w-148", className)}>
      <div
        className={getWrapperClass(
          focused,
          disabled,
          isError,
          "border-line-neutral-strong",
          "pl-5 pr-4 py-4",
        )}
      >
        <textarea
          className={clsx(
            getFieldClass(disabled),
            clsx(
              "resize-none h-[347px] overflow-y-auto bg-fill-quaternary-assistive",
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
        <div className="flex justify-end mt-2">
          <span
            className={clsx(
              "text-cap12-med ",
              isError ? "text-text-fail" : "text-text-neutral-disabled",
            )}
          >
            {value.length}/{maxLength}
          </span>
        </div>
      </div>

      {/* {error && (
        <span className="text-cap12-med text-text-fail text-right">
          {error}
        </span>
      )} */}
    </div>
  );
}
