import { useState } from "react";
import TabItem from "@/components/common/tabs/TabItem";

interface TabData {
  id: string;
  label: string;
}

interface TabMenuProps {
  tabs: TabData[];
  style?: "NORMAL" | "STRONG";
  size?: "S" | "M";
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export default function TabMenu({
  tabs,
  style = "NORMAL",
  size = "M",
  activeTabId,
  onTabChange,
  className,
}: TabMenuProps) {
  const [internalActiveTabId, setInternalActiveTabId] = useState(tabs[0]?.id);
  const resolvedActiveTabId = activeTabId ?? internalActiveTabId;

  const menuBgColor = {
    NORMAL: "bg-gray-100", // 예: NORMAL일 때 배경색
    STRONG: "bg-fill-quaternary-assistive-pressed", // 예: STRONG일 때 배경색
  };

  const handleTabClick = (tabId: string) => {
    setInternalActiveTabId(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div
      className={`flex w-fit gap-1 p-1 ${menuBgColor[style]} rounded-tap-contents ${className ?? ""}`}
    >
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          label={tab.label}
          style={style}
          size={size}
          isActive={resolvedActiveTabId === tab.id}
          onClick={() => handleTabClick(tab.id)}
        />
      ))}
    </div>
  );
}
