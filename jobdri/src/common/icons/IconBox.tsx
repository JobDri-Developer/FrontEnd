import clsx from "clsx";
import Icon, { IconType } from "./Icon";

type IconBoxSize = "large" | "mid";
type IconBoxState = "primary" | "secondary" | "danger";
type IconBoxBackground = "default" | "white";

interface IconBoxProps {
  type: IconType;
  size?: IconBoxSize;
  state?: IconBoxState;
  background?: IconBoxBackground;
  selected?: boolean;
  className?: string;
}

// const sizeStyles: Record<IconBoxSize, string> = {
//   large: "w-9 h-9 ",
//   mid: "w-8 h-8",
// };

const bgStyles: Record<
  "primary" | "secondary",
  Record<IconBoxBackground, string>
> = {
  primary: {
    default: "bg-fill-primary-assistive",
    white: "bg-fill-quaternary-default",
  },
  secondary: {
    default: "bg-icon-neutral-weak",
    white: "bg-fill-quaternary-default",
  },
};

const iconColorStyles: Record<
  "primary" | "secondary",
  Record<IconBoxBackground, string>
> = {
  primary: {
    default: "text-icon-primary-default",
    white: "text-icon-primary-default",
  },
  secondary: {
    default: "text-icon-neutral-default",
    white: "text-icon-neutral-assistive",
  },
};

export default function IconBox({
  type,
  size = "large",
  state = "primary",
  background = "default",
  selected = false,
  className,
}: IconBoxProps) {
  if (type === "TRASH") {
    return (
      <div
        className={clsx(
          "flex items-center justify-center rounded-icon p-2 transition-colors",
          selected
            ? "bg-fill-system-fail-strong"
            : "bg-icon-neutral-weak hover:bg-fill-system-fail-hover",
          className,
        )}
      >
        <Icon type={type} className="text-text-neutral-white" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-icon p-2",
        // sizeStyles[size],
        bgStyles[state as "primary" | "secondary"][background],
        className,
      )}
    >
      <Icon type={type} className={iconColorStyles[state as "primary" | "secondary"][background]} />
    </div>
  );
}
