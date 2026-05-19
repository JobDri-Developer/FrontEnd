"use client";

import clsx from "clsx";
import { ChipRound } from "@/components/common/chips";
import CheckBox from "@/components/common/icons/CheckBox";

type ChipItem = {
  label: string;
  variant?: "strong" | "normal" | "assistive";
};

const DEFAULT_CHIPS: ChipItem[] = [
  { label: "매칭률 높음", variant: "strong" },
  { label: "데이터 분석", variant: "assistive" },
  { label: "성과 측정", variant: "assistive" },
];

interface ListQProps {
  question: string;
  chips?: ChipItem[];
  selected?: boolean;
  maxReached?: boolean;
  isCustom?: boolean;
  onChange?: (selected: boolean) => void;
}

export function ListQ({
  question,
  chips,
  selected = false,
  maxReached = false,
  isCustom = false,
  onChange,
}: ListQProps) {
  const isDisabled = maxReached && !selected;

  const handleClick = () => {
    if (isDisabled) return;
    onChange?.(!selected);
  };

  const chipList = isCustom
    ? [{ label: "직접 추가", variant: "normal" as const }]
    : (chips ?? DEFAULT_CHIPS);

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "group min-w-[577px] flex items-start justify-between border gap-6 py-4 px-6 rounded-chip-l transition-colors text-left",
        selected
          ? "border-line-primary-default bg-fill-quaternary-default shadow-hover"
          : isDisabled
            ? "border-line-neutral-default bg-fill-quaternary-assistive cursor-not-allowed opacity-40"
            : "border-line-neutral-default bg-fill-quaternary-assistive hover:bg-fill-quaternary-default",
      )}
    >
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex gap-1.5">
          {chipList.map((chip) => (
            <ChipRound
              key={chip.label}
              label={chip.label}
              variant={chip.variant}
            />
          ))}
        </div>
        <span className="text-b16-med">{question}</span>
      </div>
      <div className="self-stretch flex items-center">
        <CheckBox
          type="DEFAULT"
          selected={selected}
          className={
            isDisabled
              ? ""
              : "group-hover:bg-icon-neutral-assistive group-hover:border-transparent"
          }
        />
      </div>
    </button>
  );
}
