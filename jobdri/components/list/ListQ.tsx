"use client";

import clsx from "clsx";
import { useState } from "react";
import { ChipMain, ChipRound } from "@/components/chips";
import CheckBox from "@/components/icons/CheckBox";

type ChipItem = {
  label: string;
  color: "primary" | "secondary" | "tertiary" | "quaternary";
};

interface ListQProps {
  chips: ChipItem[];
  question: string;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
}

export function ListQ({
  chips,
  question,
  selected: initialSelected = false,
  onChange,
}: ListQProps) {
  const [selected, setSelected] = useState(initialSelected);

  const handleClick = () => {
    const next = !selected;
    setSelected(next);
    onChange?.(next);
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
