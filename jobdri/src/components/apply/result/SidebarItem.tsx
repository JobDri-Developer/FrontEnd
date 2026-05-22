"use client";

import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

interface SidebarItemProps {
  type: "main" | "sub";
  label: string;
  selected?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

const typeStyle: Record<SidebarItemProps["type"], string> = {
  main: "w-full flex items-center justify-between px-3 py-2 text-label14-med bg-transparent  rounded-chip-m px-4 py-3",
  sub: "w-full flex items-center gap-2 px-2 py-2 text-sub14-med rounded-chip-m",
};

export default function SidebarItem({
  type,
  label,
  selected,
  isOpen,
  onClick,
}: SidebarItemProps) {
  if (type === "main") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={clsx(
          typeStyle.main,
          selected
            ? "text-text-neutral-title bg-fill-quaternary-default shadow-card"
            : "text-text-neutral-caption hover:bg-fill-quaternary-assistive hover:shadow-card",
        )}
      >
        <span>{label}</span>
        {isOpen !== undefined && (
          <Icon
            type={isOpen ? "ARROW_DOWN_M" : "ARROW_UP_M"}
            className="text-icon-neutral-default"
          />
        )}
      </button>
    );
  }

  return (
    <div className="w-full flex flex-row">
      <span
        className={clsx("h-full w-0.5 shrink-0  bg-line-neutral-default mr-1")}
      />
      <div
        onClick={onClick}
        className={clsx(
          typeStyle.sub,
          selected
            ? " bg-icon-neutral-weak text-neutral-description"
            : " text-text-neutral-disabled hover:bg-fill-disabled/70",
        )}
      >
        <span className="truncate max-w-38 px-2">{label}</span>
      </div>
    </div>
  );
}
