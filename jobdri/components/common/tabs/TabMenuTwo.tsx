"use client";

import { useState } from "react";
import clsx from "clsx";

export type TabMenuTwoValue = "overview" | "detail";

interface TabMenuTwoProps {
  activeTab?: TabMenuTwoValue;
  onChange?: (value: TabMenuTwoValue) => void;
  className?: string;
}

const tabs: Array<{ value: TabMenuTwoValue; label: string }> = [
  { value: "overview", label: "개요" },
  { value: "detail", label: "개선안 상세" },
];

export function TabMenuTwo({
  activeTab,
  onChange,
  className,
}: TabMenuTwoProps) {
  const [internalActiveTab, setInternalActiveTab] =
    useState<TabMenuTwoValue>("overview");
  const selectedTab = activeTab ?? internalActiveTab;

  const handleChange = (value: TabMenuTwoValue) => {
    setInternalActiveTab(value);
    onChange?.(value);
  };

  return (
    <div
      className={clsx(
        "inline-flex min-w-[560px] items-center justify-between rounded-tap-hug bg-fill-quaternary-default p-1 shadow-[0_0_24px_0_var(--color-bg-shadow-default)]",
        className,
      )}
      role="tablist"
      aria-label="탭 메뉴"
    >
      {tabs.map((tab) => {
        const isActive = tab.value === selectedTab;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={clsx(
              "flex flex-1 items-center justify-center rounded-tap-contents py-3 text-btn16-semibold text-center [font-feature-settings:'liga'_off,'clig'_off]",
              isActive
                ? "bg-fill-tertiary-default text-text-neutral-white"
                : "text-text-neutral-description",
            )}
            onClick={() => handleChange(tab.value)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
