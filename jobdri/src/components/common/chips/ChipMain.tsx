import clsx from "clsx";

type ChipMainColor = "primary" | "secondary" | "tertiary" | "quaternary";

interface ChipMainProps {
  label: string;
  color: ChipMainColor;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const styles: Record<ChipMainColor, { default: string; selected: string }> = {
  primary: {
    default:
      "bg-fill-quaternary-default text-text-neutral-caption hover:shadow-chip",
    selected:
      "bg-fill-primary-default text-text-neutral-white hover:bg-fill-primary-default hover:shadow-chip hover:ring-inset hover:ring-1 hover:ring-line-primary-strong",
  },
  secondary: {
    default:
      "bg-fill-quaternary-default text-text-neutral-caption hover:shadow-chip",
    selected:
      "bg-fill-primary-assistive text-text-primary-strong hover:shadow-chip hover:ring-inset hover:ring-1 hover:ring-line-primary-assistive",
  },
  tertiary: {
    default:
      "bg-fill-quaternary-default text-text-neutral-caption hover:shadow-chip",
    selected:
      "bg-fill-quaternary-default text-text-neutral-title hover:shadow-chip",
  },
  quaternary: {
    default:
      "bg-transparent text-text-neutral-disabled hover:text-text-neutral-caption",
    selected:
      "bg-fill-tertiary-default text-text-neutral-white hover:bg-fill-tertiary-hover-default hover:shadow-chip ",
  },
};

export function ChipMain({
  label,
  color,
  selected = false,
  onClick,
  className,
}: ChipMainProps) {
  return (
    <span
      onClick={onClick}
      className={clsx(
        className,
        "inline-flex items-center justify-center px-3 py-1 text-label14-med rounded-chip-m cursor-pointer transition-colors",
        selected ? styles[color].selected : styles[color].default,
      )}
    >
      {label}
    </span>
  );
}
