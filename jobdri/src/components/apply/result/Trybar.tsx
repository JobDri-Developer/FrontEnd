"use client";

import { useEffect, useState } from "react";
import { fetchSequence } from "@/lib/api/result";
import SidebarItem from "./SidebarItem";

interface TrybarProps {
  applyId: number;
}

export default function Trybar({ applyId }: TrybarProps) {
  const [totalCount, setTotalCount] = useState(5);
  const [sequence, setSequence] = useState(1);

  useEffect(() => {
    fetchSequence(applyId)
      .then(({ totalCount, sequence }) => {
        setTotalCount(totalCount);
        setSequence(sequence);
      })
      .catch(() => {});
  }, [applyId]);

  return (
    <nav className="flex flex-col gap-1 pt-4 pr-3 pl-5">
      {Array.from({ length: totalCount }, (_, i) => i + 1).map((n) => (
        <SidebarItem
          key={n}
          type="main"
          label={`${n}차`}
          selected={n === sequence}
        />
      ))}
    </nav>
  );
}
