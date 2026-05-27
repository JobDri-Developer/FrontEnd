"use client";

import SidebarItem from "./SidebarItem";

interface TrybarProps {
  totalCount: number;
  selectedSequence: number;
  onSequenceChange: (sequence: number) => void;
}

export default function Trybar({
  totalCount,
  selectedSequence,
  onSequenceChange,
}: TrybarProps) {
  return (
    <nav className="flex flex-col gap-1 pt-4 pr-3 pl-5">
      {Array.from({ length: totalCount }, (_, i) => i + 1).map((n) => (
        <SidebarItem
          key={n}
          type="main"
          label={`${n}차`}
          selected={n === selectedSequence}
          onClick={() => onSequenceChange(n)}
        />
      ))}
    </nav>
  );
}
