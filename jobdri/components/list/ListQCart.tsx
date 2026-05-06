"use client";

import clsx from "clsx";
import { useState } from "react";
import CheckBox from "@/components/icons/CheckBox";
import IconBox from "../icons/IconBox";

interface ListQCartProps {
  question: string;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
}

export function ListQCart({
  question,
  selected: initialSelected = false,
  onChange,
}: ListQCartProps) {
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
        "group min-w-[364px] flex items-center justify-between gap-3 px-3.5 py-3 rounded-card-s bg-fill-quaternary-default border-line-neutral-default transition-colors text-left",
      )}
    >
      <span
        className={clsx(
          "text-b13-reg flex-1 min-w-0",
          selected ? "text-text-primary" : "text-text-title",
        )}
      >
        {question}
      </span>
      <IconBox type="TRASH" />{" "}
    </button>
  );
}
