"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { getWrapperClass, getFieldClass, scrollbarClass } from "./inputStyles";

interface InputAutoGrowProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  maxLength?: number;
  maxHeight?: number;
  className?: string;
}

export function InputAutoGrow({
  placeholder,
  value: externalValue,
  onChange,
  disabled = false,
  error,
  maxLength,
  maxHeight,
  className,
}: InputAutoGrowProps) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = externalValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    if (maxLength !== undefined && next.length > maxLength) return;
    setInternalValue(next);
    onChange?.(next);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={clsx("flex flex-col gap-1.5 w-148", className)}>
      <div className={getWrapperClass(focused, disabled, !!error)}>
        <textarea
          ref={textareaRef}
          className={clsx(
            "max-h-[168px]",
            getFieldClass(disabled),
            "resize-none overflow-y-auto",
            scrollbarClass,
          )}
          style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          rows={1}
        />
      </div>

      {/* {error && <span className="text-cap12-med text-text-fail">{error}</span>} */}
    </div>
  );
}
