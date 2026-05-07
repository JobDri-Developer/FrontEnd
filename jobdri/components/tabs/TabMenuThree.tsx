"use client";

import clsx from "clsx";

export type TabMenuThreeValue = "competency" | "readability" | "trust";

interface TabMenuThreeProps {
  activeTab?: TabMenuThreeValue;
  onChange?: (value: TabMenuThreeValue) => void;
  className?: string;
}

const tabs: Array<{ value: TabMenuThreeValue; label: string; count: number }> = [
  { value: "competency", label: "역량", count: 1 },
  { value: "readability", label: "가독성", count: 1 },
  { value: "trust", label: "신뢰도", count: 1 },
];

export function TabMenuThree({
  activeTab = "competency",
  onChange,
  className,
}: TabMenuThreeProps) {
  return (
    <div
      className={clsx(
        "flex w-[496px] items-center justify-between rounded-tap-hug bg-bg-white p-1 shadow-[0_0_24px_0_var(--color-bg-shadow-default)]",
        className,
      )}
      role="tablist"
      aria-label="분석 탭 메뉴"
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={clsx(
              "flex flex-1 flex-col items-center justify-center gap-[-2px] rounded-tap-contents py-3 text-center [font-feature-settings:'liga'_off,'clig'_off]",
              isActive && "bg-fill-tertiary-default",
            )}
            onClick={() => onChange?.(tab.value)}
          >
            <span
              className={clsx(
                "text-label14-med",
                isActive
                  ? "text-text-neutral-white"
                  : "text-text-neutral-caption",
              )}
            >
              {tab.label}
            </span>
            <span
              className={clsx(
                "flex items-start text-b16-bold",
                isActive
                  ? "text-text-neutral-white"
                  : "text-text-neutral-caption",
              )}
            >
              {tab.count}건
            </span>
          </button>
        );
      })}
    </div>
  );
}
