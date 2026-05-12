"use client";

import clsx from "clsx";
import { ChipRound } from "@/components/common/chips";
import CheckBox from "@/components/common/icons/CheckBox";

interface ListQProps {
  question: string;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
}

export function ListQ({ question, selected = false, onChange }: ListQProps) {
  const handleClick = () => {
    onChange?.(!selected);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "group min-w-[577px] flex items-start justify-between border gap-6 py-4 hover:bg-fill-quaternary-default px-6 rounded-chip-l transition-colors text-left",
        selected
          ? "border border-line-primary-default bg-fill-quaternary-default"
          : "border-line-neutral-default bg-fill-quaternary-assistive ",
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
          className="group-hover:bg-icon-assistive group-hover:border-transparent"
        />
      </div>
    </button>
  );
}
