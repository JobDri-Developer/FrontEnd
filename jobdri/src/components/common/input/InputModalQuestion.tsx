"use client";

import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import clsx from "clsx";

interface InputModalQuestionProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function InputModalQuestion({
  label = "아이디",
  required = true,
  placeholder = "메시지를 입력하세요",
  value: externalValue,
  onChange,
  disabled = false,
  error,
  className,
  ...inputProps
}: InputModalQuestionProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = externalValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div
      className={clsx("flex w-[316px] flex-col items-start gap-3", className)}
    >
      <div className="flex self-stretch items-center gap-2.5 pl-0.5">
        <span className="text-sub14-reg tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {label}
        </span>
        {required && (
          <span
            aria-hidden="true"
            className="h-[5px] w-[5px] rounded-full border border-fill-system-fail-strong bg-fill-system-fail-strong"
          />
        )}
      </div>

      <div
        className={clsx(
          "flex h-[42px] self-stretch items-start gap-2 rounded-card-result border px-[14px] py-2.5",
          error
            ? "border-line-system-fail-default bg-fill-quaternary-assistive"
            : "border-line-neutral-default bg-fill-quaternary-assistive",
        )}
      >
        <div className="flex w-[286px] min-w-0 items-center gap-2">
          <input
            className={clsx(
              "min-w-0 flex-1 overflow-hidden bg-transparent text-sub14-reg tracking-normal text-text-neutral-title text-ellipsis outline-none placeholder:text-text-neutral-disabled [font-feature-settings:'liga'_off,'clig'_off]",
              disabled && "cursor-not-allowed text-text-neutral-disabled",
            )}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            {...inputProps}
          />
        </div>
      </div>

      {error && (
        <span className="text-cap12-med text-text-system-fail">{error}</span>
      )}
    </div>
  );
}
