"use client";

import clsx from "clsx";
import { useState } from "react";
import CheckBox from "@/components/icons/CheckBox";

interface ListRoleProps {
  label: string;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
}

export function ListRole({
  label,
  selected: initialSelected = false,
  onChange,
}: ListRoleProps) {
  const [selected, setSelected] = useState(initialSelected);

  const handleClick = () => {
    const next = !selected;
    setSelected(next);
    onChange?.(next);
  };

  return (
    <button
      onClick={handleClick}
      className="group w-full flex items-center justify-between px-4 py-3.5 rounded-chip-l bg-fill-quaternary-assistive transition-colors"
    >
      <span
        className={clsx(
          "text-b16-med",
          selected ? "text-text-primary" : "text-text-title",
        )}
      >
        {label}
      </span>
      <CheckBox type="RADIO_L" selected={selected} className="group-hover:bg-icon-assistive group-hover:border-transparent" />
    </button>
  );
}
