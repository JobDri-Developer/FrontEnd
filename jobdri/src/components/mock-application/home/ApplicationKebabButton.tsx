"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DropDownMenu } from "@/components/common/dropdown";
import Icon from "@/components/common/icons/Icon";

export function ApplicationKebabButton({
  label,
  onDeleteClick,
}: {
  label: string;
  onDeleteClick: () => void;
}) {
  const dropdownId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-6 w-6 shrink-0 items-center justify-center"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? dropdownId : undefined}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-icon-neutral-default"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <Icon type="KABAB" className="h-6 w-6" />
      </button>

      {open && (
        <DropDownMenu
          id={dropdownId}
          className="absolute top-[calc(100%+8px)] right-0 z-30"
          items={[
            {
              label: "삭제하기",
              onClick: () => {
                setOpen(false);
                onDeleteClick();
              },
            },
          ]}
        />
      )}
    </div>
  );
}
