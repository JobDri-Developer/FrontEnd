"use client";

import type {
  CSSProperties,
  ChangeEvent,
  FocusEvent,
  ReactNode,
  TextareaHTMLAttributes,
  UIEvent,
} from "react";
import { useState } from "react";
import clsx from "clsx";
import { TextButton } from "@/components/common/buttons";
import {
  lnbHiddenScrollbarClass,
  LnbScrollbar,
  useLnbScrollMetrics,
} from "@/components/common/lnb/LnbScrollbar";

export const DEFAULT_TEXT_AREA_FIXED_MAX_LENGTH = 2000;

export interface InputTextAreaFixedSharedProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "className" | "defaultValue" | "maxLength" | "onChange" | "value"
  > {
  label?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  message?: string;
  hasError?: boolean;
  error?: string;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
  showAddButton?: boolean;
  addButtonLabel?: string;
  addButtonDisabled?: boolean;
  onAdd?: () => void;
  selected?: boolean;
  className?: string;
  fieldClassName?: string;
  textareaClassName?: string;
  messageClassName?: string;
}

interface InputTextAreaFixedBaseProps extends InputTextAreaFixedSharedProps {
  fieldLayoutClassName: string;
  inputFrameClassName: string;
  scrollbarClassName?: string;
  textareaLayoutClassName: string;
  textareaStyle?: CSSProperties;
  topContainerClassName: string;
}

export function getInputTextAreaFixedFieldStateClass({
  disabled,
  focused,
  isError,
}: {
  disabled: boolean;
  focused: boolean;
  isError: boolean;
}) {
  return clsx(
    disabled
      ? "border-line-neutral-default bg-fill-quaternary-assistive"
      : isError
        ? "border-line-system-fail-default"
        : focused
          ? "border-line-primary-default"
          : "border-line-neutral-default",
    !disabled && "bg-bg-contents-default",
  );
}

export function InputTextAreaFixedLabel({
  label,
  required,
}: {
  label?: string;
  required: boolean;
}) {
  if (!label) {
    return null;
  }

  return (
    <div className="flex self-stretch items-center gap-1.5 py-1 pr-0 pl-0.5">
      <span className="text-sub14-med text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {label}
      </span>
      {required && (
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
  );
}

export function InputTextAreaFixedPlaceholder({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute inset-x-0 top-0 max-h-16 overflow-hidden text-sub14-reg text-text-neutral-caption text-ellipsis [display:-webkit-box] [font-feature-settings:'liga'_off,'clig'_off] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function InputTextAreaFixedBottom({
  addButtonDisabled,
  addButtonLabel,
  count,
  disabled,
  hasValue,
  leadingContent,
  maxLength,
  onAdd,
  showAddButton,
  trailingContent,
}: {
  addButtonDisabled?: boolean;
  addButtonLabel: string;
  count: number;
  disabled: boolean;
  hasValue: boolean;
  leadingContent?: ReactNode;
  maxLength: number;
  onAdd?: () => void;
  showAddButton: boolean;
  trailingContent?: ReactNode;
}) {
  const resolvedAddButtonDisabled =
    disabled || addButtonDisabled === true || !hasValue;

  return (
    <div className="flex self-stretch items-center justify-center gap-6">
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex flex-1 items-center gap-1">
          {leadingContent}
          <div className="flex items-center">
            <div className="flex items-center px-1">
              <span className="text-center text-[12px] leading-[140%] font-medium tracking-[-0.24px] text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                {count}
              </span>
              <span className="text-center text-[12px] leading-[140%] font-medium tracking-[-0.24px] text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                /{maxLength}
              </span>
            </div>
          </div>
        </div>

        {(trailingContent || showAddButton) && (
          <div className="flex items-center gap-1">
            {trailingContent}
            {showAddButton && (
              <TextButton
                label={addButtonLabel}
                size="small"
                styleType="primary"
                iconPosition="null"
                className={
                  hasValue && !resolvedAddButtonDisabled
                    ? "text-text-primary-default"
                    : undefined
                }
                disabled={resolvedAddButtonDisabled}
                onClick={onAdd}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function InputTextAreaFixedMessage({
  className,
  disabled,
  isError,
  message,
}: {
  className?: string;
  disabled: boolean;
  isError: boolean;
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex self-stretch items-center justify-end gap-1 pr-0.5">
      <span
        className={clsx(
          "text-[12px] leading-[140%] font-medium tracking-[-0.24px] [font-feature-settings:'liga'_off,'clig'_off]",
          isError && !disabled
            ? "text-text-system-fail"
            : "text-text-neutral-caption",
          className,
        )}
      >
        {message}
      </span>
    </div>
  );
}

export function InputTextAreaFixedBase({
  label = "주제",
  required = true,
  placeholder = "내용을 입력해 주세요",
  value: externalValue,
  defaultValue = "",
  onChange,
  maxLength = DEFAULT_TEXT_AREA_FIXED_MAX_LENGTH,
  message = "글자수를 확인해주세요",
  hasError = false,
  error,
  leadingContent,
  trailingContent,
  showAddButton = true,
  addButtonLabel = "추가하기",
  addButtonDisabled,
  onAdd,
  selected = false,
  disabled = false,
  className,
  fieldClassName,
  textareaClassName,
  messageClassName,
  onFocus,
  onBlur,
  onScroll,
  style,
  fieldLayoutClassName,
  inputFrameClassName,
  scrollbarClassName = "right-[-8px]",
  textareaLayoutClassName,
  textareaStyle,
  topContainerClassName,
  ...textareaProps
}: InputTextAreaFixedBaseProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  const isControlled = externalValue !== undefined;
  const value = externalValue ?? internalValue;
  const count = value.length;
  const hasValue = count > 0;
  const isError = hasError || !!error;
  const isSelected = focused || selected;
  const helperMessage = error ?? message;
  const {
    scrollAreaRef: textareaRef,
    scrollbarMetrics,
    updateScrollbarMetrics,
  } = useLnbScrollMetrics<HTMLTextAreaElement>(!disabled, value);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    updateScrollbarMetrics();
    onScroll?.(event);
  };

  return (
    <div
      className={clsx(
        "flex w-[799px] max-w-full flex-col items-start gap-1 rounded-card-s p-0",
        className,
      )}
    >
      <InputTextAreaFixedLabel label={label} required={required} />

      <div
        className={clsx(
          "flex self-stretch flex-col items-start gap-3 rounded-card-s border transition-colors",
          getInputTextAreaFixedFieldStateClass({
            disabled,
            focused: isSelected,
            isError,
          }),
          fieldLayoutClassName,
          fieldClassName,
        )}
      >
        <div className={topContainerClassName}>
          <div className={inputFrameClassName}>
            {!value && placeholder && (
              <InputTextAreaFixedPlaceholder>
                {placeholder}
              </InputTextAreaFixedPlaceholder>
            )}
            <textarea
              ref={textareaRef}
              className={clsx(
                "resize-none overflow-y-auto bg-transparent text-justify text-sub14-reg outline-none caret-line-primary-strong [font-feature-settings:'liga'_off,'clig'_off]",
                disabled
                  ? "text-text-neutral-caption"
                  : "text-text-neutral-description",
                "placeholder:text-transparent",
                lnbHiddenScrollbarClass,
                textareaLayoutClassName,
                textareaClassName,
              )}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onScroll={handleScroll}
              maxLength={maxLength}
              disabled={disabled}
              rows={1}
              style={{ ...style, ...textareaStyle }}
              {...textareaProps}
            />
            <LnbScrollbar
              metrics={scrollbarMetrics}
              className={scrollbarClassName}
            />
          </div>
        </div>

        <InputTextAreaFixedBottom
          addButtonDisabled={addButtonDisabled}
          addButtonLabel={addButtonLabel}
          count={count}
          disabled={disabled}
          hasValue={hasValue}
          leadingContent={leadingContent}
          maxLength={maxLength}
          onAdd={onAdd}
          showAddButton={showAddButton}
          trailingContent={trailingContent}
        />
      </div>

      <InputTextAreaFixedMessage
        className={messageClassName}
        disabled={disabled}
        isError={isError}
        message={helperMessage}
      />
    </div>
  );
}
