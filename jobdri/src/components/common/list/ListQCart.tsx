"use client";

import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import IconBox from "../icons/IconBox";

interface ListQCartProps {
  question: string;
  onChange?: () => void;
}

export function ListQCart({ question, onChange }: ListQCartProps) {
  return (
    <button
      onClick={onChange}
      className={clsx(
        "group w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-card-s bg-fill-quaternary-default border border-line-neutral-default transition-colors text-left ",
      )}
    >
      <span className="text-sub14-med flex-1 min-w-0 text-text-neutral-description [-webkit-line-clamp:2] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden">
        {question}
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-icon-default bg-icon-neutral-weak p-2.5">
        <IconBox type="TRASH" className="text-text-neutral-white" />
      </span>
    </button>
  );
}
