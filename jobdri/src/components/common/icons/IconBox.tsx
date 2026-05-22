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
  iconClassName?: string;
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

const sizeStyles: Record<IconBoxSize, string> = {
  large: "h-10 w-10 p-2",
  mid: "h-10 w-10 p-2",
};

export default function IconBox({
  type,
  size = "large",
  state = "primary",
  background = "default",
  selected = false,
  className,
  iconClassName,
}: IconBoxProps) {
  if (type === "TRASH") {
    return (
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center gap-2.5 rounded-icon-default transition-colors",
          sizeStyles[size],
          selected
            ? "bg-[#F01818]"
            : "bg-icon-neutral-weak hover:bg-fill-system-fail-strong",
          className,
        )}
      >
        <Icon
          type={type}
          className={clsx("text-text-neutral-white", iconClassName)}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center gap-2.5 rounded-icon-default",
        sizeStyles[size],
        bgStyles[state as "primary" | "secondary"][background],
        className,
      )}
    >
      <Icon
        type={type}
        className={clsx(
          iconColorStyles[state as "primary" | "secondary"][background],
          iconClassName,
        )}
      />
    </div>
  );
}
