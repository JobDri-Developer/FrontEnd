"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import ProgressSidebarItem from "./ProgressSidebarItem";

export interface ProgressSidebarItemData {
  id: string;
  label: string;
}

interface ProgressSidebarProps {
  items?: ProgressSidebarItemData[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
}

const defaultItems: ProgressSidebarItemData[] = [
  { id: "job", label: "직무" },
  { id: "main-task", label: "주요업무" },
  { id: "qualification", label: "자격요건" },
  { id: "preference-1", label: "우대사항" },
  { id: "preference-2", label: "우대사항" },
  { id: "preference-3", label: "우대사항" },
  { id: "preference-4", label: "우대사항" },
  { id: "preference-5", label: "우대사항" },
];

export default function ProgressSidebar({
  items = defaultItems,
  activeId,
  defaultActiveId,
  onActiveChange,
  className,
}: ProgressSidebarProps) {
  const initialActiveId = defaultActiveId ?? items[0]?.id ?? "";
  const [internalActiveId, setInternalActiveId] = useState(initialActiveId);
  const resolvedActiveId = activeId ?? internalActiveId;
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  const setActive = useCallback(
    (nextId: string) => {
      if (!nextId || nextId === resolvedActiveId) return;
      setInternalActiveId(nextId);
      onActiveChange?.(nextId);
    },
    [onActiveChange, resolvedActiveId],
  );

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveFromScroll = () => {
      const activationLine = window.innerHeight * 0.3;
      const sectionPositions = itemIds
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;

          const rect = element.getBoundingClientRect();

          return {
            id,
            top: rect.top,
          };
        })
        .filter((item): item is { id: string; top: number } => Boolean(item));

      if (sectionPositions.length === 0) return;

      const passedSections = sectionPositions.filter(
        (item) => item.top <= activationLine,
      );
      const activeSection =
        passedSections.sort((a, b) => b.top - a.top)[0] ??
        sectionPositions.sort((a, b) => a.top - b.top)[0];

      setActive(activeSection.id);
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveFromScroll);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [itemIds, setActive]);

  const handleItemClick = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav
      aria-label="진행 항목"
      className={clsx(
        "flex h-[400px] w-[270px] flex-col items-start gap-1 rounded-card bg-fill-quaternary-assistive p-3",
        className,
      )}
    >
      {items.map((item) => (
        <ProgressSidebarItem
          key={item.id}
          label={item.label}
          selected={item.id === resolvedActiveId}
          onClick={() => handleItemClick(item.id)}
        />
      ))}
    </nav>
  );
}
