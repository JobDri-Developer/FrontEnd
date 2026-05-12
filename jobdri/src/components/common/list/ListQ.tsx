"use client";

import clsx from "clsx";
import { ChipRound } from "@/components/common/chips";
import CheckBox from "@/components/common/icons/CheckBox";

interface ListQProps {
  question: string;
  selected?: boolean;
  maxReached?: boolean;
  onChange?: (selected: boolean) => void;
}

export function ListQ({
  question,
  selected = false,
  maxReached = false,
  onChange,
}: ListQProps) {
  const isDisabled = maxReached && !selected;

  const handleClick = () => {
    if (isDisabled) return;
    onChange?.(!selected);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "group min-w-[577px] flex items-start justify-between border gap-6 py-4 px-6 rounded-chip-l transition-colors text-left",
        selected
          ? "border-line-primary-default bg-fill-quaternary-default"
          : isDisabled
            ? "border-line-neutral-default bg-fill-quaternary-assistive cursor-not-allowed opacity-40"
            : "border-line-neutral-default bg-fill-quaternary-assistive hover:bg-fill-quaternary-default",
      )}
    >
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex gap-1.5">
          <ChipRound label="매칭률 높음" variant="strong" />
          <ChipRound label="데이터 분석" variant="assistive" />
          <ChipRound label="성과 측정" variant="assistive" />
        </div>
        <span className="text-b16-med">{question}</span>
      </div>
      <div className="self-center">
        <CheckBox
          type="DEFAULT"
          selected={selected}
          className={
            isDisabled
              ? ""
              : "group-hover:bg-icon-assistive group-hover:border-transparent"
          }
        />
      </div>
    </button>
  );
}
