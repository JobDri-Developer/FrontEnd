"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { IconButton } from "@/components/common/buttons";
import Icon, { type IconType } from "@/components/common/icons/Icon";
import { InputTextAreaAutoGrowS } from "./InputTextAreaAutoGrowS";

export type JDInputState = "default" | "tapped";

export interface JDInputProps {
  className?: string;
  defaultValue?: string;
  editPlaceholder?: string;
  fill?: boolean;
  iconType?: IconType;
  label?: string;
  maxLength?: number;
  onAdd?: () => void;
  onChange?: (value: string) => void;
  onEdit?: () => void;
  placeholder?: string;
  rightContent?: ReactNode;
  state?: JDInputState;
  value?: string;
}

export function JDInput({
  className,
  defaultValue = "",
  editPlaceholder = "공고 내용을 입력해주세요.",
  fill = false,
  iconType = "COMPANY",
  label = "회사명",
  maxLength = 4000,
  onAdd,
  onChange,
  onEdit,
  placeholder = "입력된 내용이 없습니다.",
  rightContent,
  state,
  value,
}: JDInputProps) {
  const [internalState, setInternalState] = useState<JDInputState>("default");
  const [draftValue, setDraftValue] = useState(value ?? defaultValue);
  const resolvedState = state ?? internalState;
  const isValueControlled = value !== undefined && onChange !== undefined;
  const resolvedValue = isValueControlled ? value : draftValue;
  const hasValue = resolvedValue.trim().length > 0;
  const isTapped = resolvedState === "tapped";

  const handleEdit = () => {
    if (state === undefined) {
      setInternalState("tapped");
    }

    onEdit?.();
  };

  const handleChange = (nextValue: string) => {
    if (!isValueControlled) {
      setDraftValue(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <div
      data-fill={fill}
      data-state={resolvedState}
      className={clsx(
        "group flex w-[832px] max-w-full items-start gap-6 px-2 py-5",
        className,
      )}
    >
      <div className="flex w-[160px] min-w-[104px] max-w-[160px] shrink-0 items-center gap-[9px]">
        <Icon
          type={iconType}
          className="h-4 w-4 shrink-0 text-icon-neutral-default"
        />
        <div className="flex flex-col items-start">
          <span className="text-label14-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            {label}
          </span>
        </div>
      </div>

      {isTapped ? (
        <InputTextAreaAutoGrowS
          label=""
          required={false}
          placeholder={editPlaceholder}
          value={resolvedValue}
          onChange={handleChange}
          maxLength={maxLength}
          message=""
          selected
          onAdd={onAdd}
          className="!w-full flex-1 gap-1"
        />
      ) : (
        <>
          <div className="flex flex-1 flex-col items-start">
            <span
              className={clsx(
                "self-stretch text-sub14-med [font-feature-settings:'liga'_off,'clig'_off]",
                hasValue
                  ? "text-text-neutral-description"
                  : "text-text-neutral-caption",
              )}
            >
              {hasValue ? resolvedValue : placeholder}
            </span>
          </div>

          <div className="flex h-[21px] w-[72px] shrink-0 items-center justify-end">
            {rightContent ?? (
              <IconButton
                iconType="EDIT"
                styleType="weak"
                size="s"
                buttonType="transparent"
                aria-label={`${label} 수정`}
                className="invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                onClick={handleEdit}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
