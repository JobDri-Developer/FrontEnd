"use client";

import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from "react";
import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

export type InputTextFieldState = "default" | "tapped" | "error" | "disabled";

export interface InputTextFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "defaultValue" | "maxLength" | "onChange" | "value"
  > {
  className?: string;
  defaultValue?: string;
  error?: string;
  fieldClassName?: string;
  helperText?: string;
  hasError?: boolean;
  inputClassName?: string;
  label?: string;
  maxLength?: number;
  maxLetterLabel?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showHeadline?: boolean;
  showHelpText?: boolean;
  showIconPassword?: boolean;
  showMaxletter?: boolean;
  showNecessity?: boolean;
  showNessecity?: boolean;
  state?: InputTextFieldState;
  value?: string;
}

export function InputTextField({
  className,
  defaultValue = "",
  disabled = false,
  error,
  fieldClassName,
  helperText = "글자수를 확인해주세요",
  hasError = false,
  inputClassName,
  label = "아이디",
  maxLength = 20,
  maxLetterLabel,
  onChange,
  placeholder = "내용을 입력해주세요.",
  showHeadline = true,
  showHelpText = false,
  showIconPassword = true,
  showMaxletter = true,
  showNecessity,
  showNessecity = true,
  state = "default",
  value: externalValue,
  ...inputProps
}: InputTextFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const isControlled = externalValue !== undefined;
  const value = externalValue ?? internalValue;
  const isError = hasError || !!error || state === "error";
  const resolvedState: InputTextFieldState = disabled
    ? "disabled"
    : isError
      ? "error"
    : focused
      ? "tapped"
      : state;
  const isTapped = resolvedState === "tapped";
  const resolvedHelperText = error ?? helperText;
  const shouldShowHelpText = showHelpText || isError;
  const resolvedShowNecessity = showNecessity ?? showNessecity;
  const resolvedMaxLetterLabel = maxLetterLabel ?? `최대 ${maxLength}자`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    inputProps.onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    inputProps.onBlur?.(event);
  };

  return (
    <div
      data-state={resolvedState}
      className={clsx(
        "flex w-[316px] max-w-full flex-col items-start gap-1",
        className,
      )}
    >
      {showHeadline && (
        <div className="flex self-stretch items-center gap-2.5 py-1 pr-0 pl-0.5">
          <span className="text-sub14-reg text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            {label}
          </span>
          {resolvedShowNecessity && (
            <svg
              aria-hidden="true"
              className="h-[5px] w-[5px] shrink-0"
              viewBox="0 0 5 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="2.5"
                cy="2.5"
                r="2"
                fill="var(--color-fill-system-fail-strong)"
                stroke="#FF4242"
              />
            </svg>
          )}
        </div>
      )}

      <div className="flex h-[42px] self-stretch flex-col items-start gap-2.5">
        <label
          className={clsx(
            "box-border flex h-[42px] shrink-0 items-center gap-2 self-stretch rounded-[8px] border bg-bg-contents-default p-3.5 transition-colors",
            disabled
              ? "border-line-neutral-default bg-fill-quaternary-assistive"
              : isError
                ? "border-line-system-fail-default"
              : isTapped
                ? "border-line-primary-default"
                : "border-line-neutral-default",
            fieldClassName,
          )}
        >
          <span className="flex w-[286px] items-center gap-2">
            {showIconPassword && (
              <span className="flex aspect-square h-6 w-6 shrink-0 items-center justify-center">
                <Icon
                  type="PASSWORD"
                  className="h-6 w-6 text-icon-neutral-weak"
                />
              </span>
            )}
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
              <input
                className={clsx(
                  "min-w-0 flex-1 bg-transparent text-sub14-reg outline-none caret-line-primary-strong [font-feature-settings:'liga'_off,'clig'_off]",
                  disabled
                    ? "text-text-neutral-disabled placeholder:text-gray-300"
                    : "text-text-neutral-description placeholder:text-text-neutral-caption",
                  inputClassName,
                )}
                {...inputProps}
                disabled={disabled}
                maxLength={maxLength}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                value={value}
              />
            </span>
          </span>

          {showMaxletter && (
            <span
              className={clsx(
                "flex shrink-0 items-center justify-center gap-2.5 text-cap12-med [font-feature-settings:'liga'_off,'clig'_off]",
                isError
                  ? "text-text-system-fail"
                  : disabled
                  ? "text-text-neutral-disabled"
                  : "text-text-neutral-caption",
              )}
            >
              {resolvedMaxLetterLabel}
            </span>
          )}
        </label>
      </div>

      {shouldShowHelpText && resolvedHelperText && (
        <div className="flex self-stretch items-center justify-end gap-2.5 pr-0.5">
          <span
            className={clsx(
              "text-cap12-med [font-feature-settings:'liga'_off,'clig'_off]",
              isError ? "text-text-system-fail" : "text-text-neutral-caption",
            )}
          >
            {resolvedHelperText}
          </span>
        </div>
      )}
    </div>
  );
}
