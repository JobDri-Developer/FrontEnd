"use client";

import clsx from "clsx";
import { useState } from "react";
import Icon from "@/components/common/icons/Icon";

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
        "group flex w-[364px] items-center gap-6 rounded-card-s border border-line-neutral-default bg-fill-quaternary-default px-5 py-[14px] text-left transition-colors",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3">
        <span
          className={clsx(
            "max-h-[42px] self-stretch overflow-hidden text-sub14-med tracking-normal text-text-neutral-description [display:-webkit-box] [font-feature-settings:'liga'_off,'clig'_off] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]",
            selected && "text-text-neutral-description",
          )}
        >
          {question}
        </span>
      </div>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center gap-2.5 rounded-icon-default bg-icon-neutral-weak p-2.5">
        <Icon type="TRASH" className="h-3 w-3 text-text-neutral-white" />
      </span>
    </button>
  );
}
