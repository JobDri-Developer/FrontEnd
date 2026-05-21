"use client";

import type { FocusEvent, InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import clsx from "clsx";
import { getWrapperClass, getFieldClass } from "./inputStyles";

interface InputSingleLineProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "disabled" | "className"
  > {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  error?: string;
  className?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  focusedBorder?: string;
  paddingClass?: string;
  radiusClass?: string;
}

export const InputSingleLine = forwardRef<HTMLInputElement, InputSingleLineProps>(
  function InputSingleLine(
  {
  placeholder,
  value: externalValue,
  onChange,
    disabled = false,
    hasError = false,
    error,
    className,
    wrapperClassName,
  inputClassName,
  focusedBorder = "border-line-neutral-strong",
  paddingClass,
    radiusClass,
    onFocus,
    onBlur,
    ...inputProps
  },
  ref,
) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);

  const value = externalValue ?? internalValue;
  const isActive = focused || value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <div className={clsx("flex flex-col gap-1.5 w-148", className)}>
      <div
        className={clsx(
          getWrapperClass(
            isActive,
            disabled,
            hasError || !!error,
            focusedBorder,
            paddingClass,
            radiusClass,
          ),
          wrapperClassName,
        )}
      >
        <input
          ref={ref}
          className={clsx(getFieldClass(disabled), inputClassName)}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          {...inputProps}
        />
      </div>

      {error && <span className="text-cap12-med text-text-fail">{error}</span>}
    </div>
  );
},
);
