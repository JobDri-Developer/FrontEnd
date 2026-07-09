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
}

export default function TabMenu({
  tabs,
  style = "NORMAL",
  size = "M",
}: TabMenuProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);

  const menuBgColor = {
    NORMAL: "bg-gray-100", // 예: NORMAL일 때 배경색
    STRONG: "bg-fill-quaternary-assistive-pressed", // 예: STRONG일 때 배경색
  };

  return (
    <div
      className={`flex w-fit gap-1 p-1 ${menuBgColor[style]} rounded-tap-contents`}
    >
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          label={tab.label}
          style={style}
          size={size}
          isActive={activeTabId === tab.id}
          onClick={() => setActiveTabId(tab.id)}
        />
      ))}
    </div>
  );
}
