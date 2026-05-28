"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "@/components/common/icons/Icon";

export function ApplicationKebabButton({
  label,
  onDeleteClick,
  onRetryClick,
}: {
  label: string;
  onDeleteClick: () => void;
  onRetryClick?: () => void;
}) {
  const dropdownId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const menuItems = [
    {
      label: "삭제하기",
      onClick: () => {
        setOpen(false);
        onDeleteClick();
      },
    },
    {
      label: "재도전하기",
      onClick: () => {
        setOpen(false);
        onRetryClick?.();
      },
    },
  ];

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
        <div
          id={dropdownId}
          role="menu"
          className="absolute top-0 right-full z-30 flex w-[104px] flex-col items-start overflow-hidden rounded-cta-s bg-fill-quaternary-default shadow-[0_0_24px_0_rgba(108,106,255,0.15)]"
        >
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="flex w-[104px] flex-col items-start bg-bg-contents-default"
            >
              <button
                type="button"
                role="menuitem"
                className="flex items-center gap-1.5 self-stretch px-4 py-3 text-left text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off] hover:bg-bg-contents-assistive active:bg-bg-default"
                onClick={item.onClick}
              >
                {item.label}
              </button>
              {index < menuItems.length - 1 && (
                <span
                  className="h-px self-stretch bg-line-neutral-default"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
