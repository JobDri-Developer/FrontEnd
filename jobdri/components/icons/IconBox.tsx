import clsx from "clsx";
import Icon, { IconType } from "./Icon";

type IconBoxSize = "large" | "mid";
type IconBoxState = "primary" | "secondary";
type IconBoxBackground = "default" | "white";

interface IconBoxProps {
  type: IconType;
  size?: IconBoxSize;
  state?: IconBoxState;
  background?: IconBoxBackground;
  className?: string;
}

// const sizeStyles: Record<IconBoxSize, string> = {
//   large: "w-9 h-9 ",
//   mid: "w-8 h-8",
// };

const bgStyles: Record<IconBoxState, Record<IconBoxBackground, string>> = {
  primary: {
    default: "bg-fill-primary-assistive",
    white: "bg-fill-quaternary-default",
  },
  secondary: {
    default: "bg-fill-neutral-weak",
    white: "bg-fill-neutral-white",
  },
};

const iconColorStyles: Record<
  IconBoxState,
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
  className,
}: IconBoxProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-icon p-2",
        // sizeStyles[size],
        bgStyles[state][background],
        className,
      )}
    >
      <Icon type={type} className={iconColorStyles[state][background]} />
    </div>
  );
}
