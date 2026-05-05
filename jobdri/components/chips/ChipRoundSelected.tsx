"use client";

import clsx from "clsx";
import { useState } from "react";

interface ChipRoundSelectedProps {
  label: string;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
}

export function ChipRoundSelected({
  label,
  selected: initialSelected = false,
  onChange,
}: ChipRoundSelectedProps) {
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
        "rounded-chip-round px-3.5 py-1.5 text-cap12-semibold",
        selected
          ? "bg-fill-tertiary-default text-text-neutral-white"
          : "bg-fill-quaternary-default text-text-neutral-title border border-line-neutral",
      )}
    >
      {label}
    </button>
  );
}
