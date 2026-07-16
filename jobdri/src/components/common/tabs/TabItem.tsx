interface TabItemProps {
  style?: "NORMAL" | "STRONG";
  size?: "S" | "M";
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const TabItemStyle = {
  base: "px-5 py-2 cursor-pointer transition-colors rounded-tap-contents",
  inactive: "text-text-neutral-caption bg-transparent",
  active: {
    NORMAL: "bg-fill-quaternary-assistive-pressed text-text-neutral-title",
    STRONG: "bg-fill-tertiary-default text-text-neutral-white",
  },
  size: {
    S: "text-cap12-semibold",
    M: "text-btn14-semibold",
  },
} as const;

export default function TabItem({
  style = "NORMAL",
  size = "M",
  label,
  isActive,
  onClick,
}: TabItemProps) {
  const tabClasses = [
    TabItemStyle.base,
    TabItemStyle.size[size],

    isActive ? TabItemStyle.active[style] : TabItemStyle.inactive,
  ].join(" ");

  return (
    <button className={tabClasses} onClick={onClick}>
      {label}
    </button>
  );
}
