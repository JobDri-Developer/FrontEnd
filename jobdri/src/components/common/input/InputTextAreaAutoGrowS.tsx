"use client";

import type { ChangeEvent, FocusEvent, UIEvent } from "react";
import { useLayoutEffect, useState } from "react";
import clsx from "clsx";
import {
  lnbHiddenScrollbarClass,
  LnbScrollbar,
  useLnbScrollMetrics,
} from "@/components/common/lnb/LnbScrollbar";
import {
  // DEFAULT_TEXT_AREA_FIXED_MAX_LENGTH,
  getInputTextAreaFixedFieldStateClass,
  InputTextAreaFixedBottom,
  InputTextAreaFixedLabel,
  InputTextAreaFixedMessage,
  InputTextAreaFixedPlaceholder,
  type InputTextAreaFixedSharedProps,
} from "./InputTextAreaFixedShared";

const MIN_TEXTAREA_HEIGHT = 21;
const MAX_TEXTAREA_HEIGHT = 174;

export type InputTextAreaAutoGrowSProps = InputTextAreaFixedSharedProps;

export function InputTextAreaAutoGrowS({
  label = "주제",
  required = true,
  placeholder = "내용을 입력해 주세요",
  value: externalValue,
  defaultValue = "",
  onChange,
  maxLength,
  message,
  hasError = false,
  error,
  leadingContent,
  trailingContent,
  showAddButton = true,
  showBottomLine = true,
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
  ...textareaProps
}: InputTextAreaAutoGrowSProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  const isControlled = externalValue !== undefined;
  const value = externalValue ?? internalValue;
  const count = value.length;
  const hasValue = count > 0;
  const isError = hasError || !!error;
  const isSelected = focused || selected;
  const helperMessage = isError ? (error ?? message) : undefined;
  const {
    scrollAreaRef: textareaRef,
    scrollbarMetrics,
    updateScrollbarMetrics,
  } = useLnbScrollMetrics<HTMLTextAreaElement>(!disabled, value);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = `${MIN_TEXTAREA_HEIGHT}px`;

    const nextHeight = Math.min(
      Math.max(textarea.scrollHeight, MIN_TEXTAREA_HEIGHT),
      MAX_TEXTAREA_HEIGHT,
    );

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
    updateScrollbarMetrics();
  }, [textareaRef, updateScrollbarMetrics, value]);

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
        "flex w-full flex-col items-start gap-1 rounded-card-s p-0",
        className,
      )}
    >
      <InputTextAreaFixedLabel label={label} required={required} />

      <div
        className={clsx(
          "flex self-stretch flex-col items-start gap-3 rounded-card-s border p-4 transition-colors",
          getInputTextAreaFixedFieldStateClass({
            disabled,
            focused: isSelected,
            isError,
          }),
          fieldClassName,
        )}
      >
        <div className="flex self-stretch px-1">
          <div className="relative flex flex-1 items-start">
            {!value && placeholder && (
              <InputTextAreaFixedPlaceholder className="max-h-[174px]">
                {placeholder}
              </InputTextAreaFixedPlaceholder>
            )}
            <textarea
              ref={textareaRef}
              className={clsx(
                "min-h-[21px] max-h-[174px] flex-1 resize-none overflow-y-auto bg-transparent text-justify text-sub14-reg outline-none caret-line-primary-strong [font-feature-settings:'liga'_off,'clig'_off]",
                disabled
                  ? "text-text-neutral-caption"
                  : "text-text-neutral-description",
                "placeholder:text-transparent",
                lnbHiddenScrollbarClass,
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
              style={{
                ...style,
                height: MIN_TEXTAREA_HEIGHT,
                maxHeight: MAX_TEXTAREA_HEIGHT,
              }}
              {...textareaProps}
            />
            <LnbScrollbar metrics={scrollbarMetrics} className="right-[-8px]" />
          </div>
        </div>

        {showBottomLine && (
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
        )}
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
