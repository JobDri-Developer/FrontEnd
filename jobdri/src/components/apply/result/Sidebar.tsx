"use client";

import { useState } from "react";
import SidebarItem from "./SidebarItem";

interface SidebarQuestion {
  id: string;
  question: string;
}

interface SidebarProps {
  questions: SidebarQuestion[];
  activeId: string;
  onSelect: (id: string) => void;
  onOverview: () => void;
  isOverview: boolean;
}

export default function Sidebar({
  questions,
  activeId,
  onSelect,
  onOverview,
  isOverview,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDetailClick = () => {
    if (isOverview) {
      // 개요 상태에서 클릭 → 열고 첫 번째 sub 선택
      setIsOpen(true);
      onSelect(questions[0]?.id ?? "");
    } else {
      // 이미 선택 상태 → 아코디언만 토글, 선택은 유지
      setIsOpen((prev) => !prev);
    }
  };

  const handleOverviewClick = () => {
    setIsOpen(false);
    onOverview();
  };

  return (
    <nav className="flex w-50 shrink-0 flex-col gap-y-1 px-3 pt-10 bg-bg-contents-assistive h-full">
      <SidebarItem
        type="main"
        label="개요"
        selected={isOverview}
        onClick={handleOverviewClick}
      />
      <SidebarItem
        type="main"
        label="개선안 상세"
        selected={!isOverview}
        isOpen={isOpen}
        onClick={handleDetailClick}
      />
      {isOpen && (
        <div className="flex w-full flex-col">
          {questions.map((q) => (
            <SidebarItem
              key={q.id}
              type="sub"
              label={q.question}
              selected={activeId === q.id}
              onClick={() => onSelect(q.id)}
            />
          ))}
        </div>
      )}
    </nav>
  );
}
