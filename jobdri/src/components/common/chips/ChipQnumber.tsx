"use client";

import clsx from "clsx";
import { useState } from "react";
import { CompleteBadge } from "../badges";

interface ChipQnumberProps {
  number: number;
  showComplete?: boolean;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
}

export function ChipQnumber({
  number,
  showComplete = false,
  selected: initialSelected = false,
  onChange,
}: ChipQnumberProps) {
  const [selected, setSelected] = useState(initialSelected);

  const handleClick = () => {
    const next = !selected;
    setSelected(next);
    onChange?.(next);
  };

  return (
    <button onClick={handleClick} className="relative flex items-center ">
      {showComplete && (
        <div className=" absolute -top-[1.25px] -left-3">
          <CompleteBadge />
        </div>
      )}
      <div
        className={clsx(
          "flex items-center gap-1 px-3.5 py-1.5 rounded-chip-m text-label14-med ",
          selected
            ? "bg-fill-tertiary-default text-text-neutral-white"
            : "bg-fill-quaternary-default text-text-neutral-title",
        )}
      >
        Q{number}
      </div>
    </button>
  );
}
