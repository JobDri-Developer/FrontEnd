import clsx from "clsx";

type ChipMainColor = "primary" | "secondary" | "tertiary" | "quaternary";
type ChipMainSize = "mid" | "small";

interface ChipMainProps {
  label: string;
  color: ChipMainColor;
  size?: ChipMainSize;
  active?: boolean;
}

const activeStyles: Record<ChipMainColor, Record<ChipMainSize, string>> = {
  primary: {
    mid: "bg-fill-primary-default text-text-neutral-white",
    small: "bg-fill-primary-default text-text-neutral-white",
  },
  secondary: {
    mid: "bg-fill-primary-assistive text-text-primary-strong",
    small: "bg-fill-primary-assistive text-text-primary-strong",
  },
  tertiary: {
    mid: "bg-fill-tertiary text-text-neutral-white",
    small:
      "bg-fill-quaternary text-text-neutral-caption border border-line-neutral",
  },
  quaternary: {
    mid: "bg-fill-quaternary text-text-neutral-title",
    small: "bg-fill-secondary-assistive text-text-neutral-description",
  },
};

const inactiveStyle = (color: ChipMainColor) =>
  color === "quaternary"
    ? "bg-transparent text-text-neutral-caption"
    : "bg-fill-quaternary-default text-text-neutral-caption";

const sizeStyles: Record<ChipMainSize, string> = {
  mid: "px-3 py-1 text-label14-med rounded-chip-m",
  small: "px-1.5 py-1 text-cap12-med rounded-chip-s",
};

export function ChipMain({
  label,
  color,
  size = "mid",
  active = true,
}: ChipMainProps) {
  return (
    <span
      className={clsx(
        sizeStyles[size],
        active ? activeStyles[color][size] : inactiveStyle(color),
      )}
    >
      {label}
    </span>
  );
}
