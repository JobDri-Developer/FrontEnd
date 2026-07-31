"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { IconButton } from "@/components/common/buttons";
import type { IconType } from "@/components/common/icons/Icon";
import { normalizeJdLineBreaks } from "@/utils/jdCriteria";
import { InputTextAreaAutoGrowS } from "./InputTextAreaAutoGrowS";

export type JDInputState = "default" | "tapped";
export type JDInputType =
  | "company"
  | "role"
  | "task"
  | "qualification"
  | "prefer";

const jdInputTypeConfig: Record<
  JDInputType,
  {
    iconType: IconType;
    label: string;
    description: string;
  }
> = {
  company: {
    iconType: "COMPANY",
    label: "회사명",
    description: "공고에서 찾는 회사예요.",
  },
  role: {
    iconType: "PROFILE_16",
    label: "직무",
    description: "공고에서 찾는 직무예요.",
  },
  task: {
    iconType: "APPLY_16",
    label: "주요 업무",
    description: "공고에서 찾는 주요 업무예요.",
  },
  qualification: {
    iconType: "CIRCLE_CHECK_16",
    label: "자격 요건",
    description: "공고에서 찾는 자격 요건이에요.",
  },
  prefer: {
    iconType: "GOOD_16",
    label: "우대 사항",
    description: "공고에서 찾는 우대 사항이에요.",
  },
};

function getJDInputListItems(value: string) {
  return normalizeJdLineBreaks(value)
    .split("\n")
    .map((item) =>
      item
        .trim()
        .replace(/^[-–—*•●◦▪▫■□◆◇▶▷▸▹‣⁃·ㆍ]\s*/, ""),
    )
    .filter(Boolean);
}

function JDInputDisplayValue({
  alwaysShowAsList,
  hasValue,
  placeholder,
  value,
}: {
  alwaysShowAsList: boolean;
  hasValue: boolean;
  placeholder: string;
  value: string;
}) {
  const listItems = hasValue ? getJDInputListItems(value) : [];

  if (hasValue && (alwaysShowAsList || listItems.length > 1)) {
    return (
      <div className="flex flex-1 flex-col items-start gap-2.5 self-stretch py-2">
        {listItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex w-full items-start gap-2.5"
          >
            <span className="flex h-[21px] w-[5px] shrink-0 flex-col items-start justify-center">
              <span className="h-[5px] w-[5px] shrink-0 rounded-badge-round bg-fill-primary-default" />
            </span>
            <span className="flex-1 text-sub14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
              {item}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-start self-stretch py-2">
      <span
        className={clsx(
          "self-stretch whitespace-pre-line text-sub14-med [font-feature-settings:'liga'_off,'clig'_off]",
          hasValue ? "text-text-neutral-description" : "text-text-neutral-caption",
        )}
      >
        {hasValue ? value : placeholder}
      </span>
    </div>
  );
}

export interface JDInputProps {
  className?: string;
  defaultValue?: string;
  description?: string;
  editPlaceholder?: string;
  fill?: boolean;
  iconType?: IconType;
  label?: string;
  maxLength?: number;
  onAdd?: () => void;
  onChange?: (value: string) => void;
  onEdit?: () => void;
  placeholder?: string;
  required?: boolean;
  rightContent?: ReactNode;
  state?: JDInputState;
  type?: JDInputType;
  value?: string;
}

export function JDInput({
  className,
  defaultValue = "",
  description,
  editPlaceholder = "공고 내용을 입력해주세요.",
  fill = false,
  label,
  maxLength = 4000,
  onAdd,
  onChange,
  onEdit,
  placeholder = "입력된 내용이 없습니다.",
  required = true,
  rightContent,
  state,
  type = "company",
  value,
}: JDInputProps) {
  const typeConfig = jdInputTypeConfig[type];
  const resolvedLabel = label ?? typeConfig.label;
  const resolvedDescription = description ?? typeConfig.description;
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

  const handleAdd = () => {
    if (state === undefined) {
      setInternalState("default");
    }

    onAdd?.();
  };

  return (
    <div
      data-fill={fill}
      data-state={resolvedState}
      className={clsx(
        "group flex w-[872px] max-w-full items-start gap-8 px-2 py-5",
        className,
      )}
    >
      <div className="flex w-[200px] shrink-0 flex-col items-start justify-center gap-1">
        <div className="flex items-center gap-1.5 self-stretch">
          <span className="text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            {resolvedLabel}
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

        {resolvedDescription && (
          <div className="flex items-center gap-[9px] self-stretch">
            <span className="text-cap12-med text-text-neutral-disabled [font-feature-settings:'liga'_off,'clig'_off]">
              {resolvedDescription}
            </span>
          </div>
        )}
      </div>

      {isTapped ? (
        <div className="flex flex-1 items-start gap-5 self-stretch">
          <div className="flex flex-1 flex-col items-start self-stretch py-2">
            <InputTextAreaAutoGrowS
              label=""
              required={false}
              placeholder={editPlaceholder}
              value={resolvedValue}
              onChange={handleChange}
              maxLength={maxLength}
              message=""
              selected
              addButtonLabel="수정하기"
              onAdd={handleAdd}
              className="!w-full min-w-0 flex-1 gap-1"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-start gap-5 self-stretch">
          <JDInputDisplayValue
            alwaysShowAsList={
              type === "qualification" || type === "prefer"
            }
            hasValue={hasValue}
            placeholder={placeholder}
            value={resolvedValue}
          />

          <div className="flex w-[72px] shrink-0 items-start justify-end self-stretch py-2">
            {rightContent ?? (
              <IconButton
                iconType="EDIT"
                styleType="weak"
                size="s"
                buttonType="transparent"
                aria-label={`${resolvedLabel} 수정`}
                className="invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                onClick={handleEdit}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
