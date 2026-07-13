import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";

export type IconButtonDirection = "left" | "right";
export type IconButtonStyle = "normal" | "weak" | "warning";
export type IconButtonType = "transparent" | "fill";
export type IconButtonSize = "xs" | "s" | "m" | "l";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction?: IconButtonDirection;
  iconType?: IconType;
  styleType?: IconButtonStyle;
  buttonType?: IconButtonType;
  size?: IconButtonSize;
  active?: boolean;
}

const directionIconType: Record<IconButtonDirection, "ARROW_L" | "ARROW_R"> = {
  left: "ARROW_L",
  right: "ARROW_R",
};

const sizeStyles: Record<IconButtonSize, string> = {
  xs: "relative inline-grid h-5 w-5 place-items-center p-0.5 rounded-chip-s",
  s: "relative inline-grid h-6 w-6 place-items-center p-0.5 rounded-tap-contents",
  m: "relative grid h-[30px] w-[30px] place-items-center p-[3px] rounded-icon-default",
  l: "relative grid h-10 w-10 place-items-center p-1.5 rounded-icon-default",
};

const iconFrameStyles: Record<IconButtonSize, string> = {
  xs: "h-4 w-4",
  s: "h-5 w-5",
  m: "h-6 w-6",
  l: "h-7 w-7",
};

const closeIconStyles: Record<IconButtonSize, string> = {
  xs: "h-3 w-3",
  s: "h-4 w-4",
  m: "h-5 w-5",
  l: "h-6 w-6",
};

const closeIconTypes = new Set<IconType>(["CLOSE", "CLOSE_S", "CLOSE_M"]);

function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styleColorStyles: Record<IconButtonStyle, string> = {
  normal: "text-icon-neutral-default",
  weak: "text-icon-neutral-assistive",
  warning: "text-fill-system-fail-strong",
};

const styleInteractionStyles: Record<IconButtonStyle, string> = {
  normal: "hover:bg-fill-state-hover-light active:bg-fill-state-hover-light",
  weak: "hover:bg-fill-state-hover-light active:bg-fill-state-hover-light",
  warning: "hover:bg-fill-system-fail-hover active:bg-fill-system-fail-hover",
};

const typeStyles: Record<IconButtonType, string> = {
  transparent: "bg-transparent",
  fill:
    "[background:var(--color-bg-contents-assistive)] text-icon-neutral-assistive shadow-card hover:[background:linear-gradient(0deg,var(--color-fill-state-hover-light)_0%,var(--color-fill-state-hover-light)_100%),var(--color-bg-contents-assistive)] active:[background:linear-gradient(0deg,var(--color-fill-state-hover-light)_0%,var(--color-fill-state-hover-light)_100%),var(--color-bg-contents-assistive)]",
};

export default function IconButton({
  direction,
  iconType,
  styleType,
  buttonType = "transparent",
  size = "l",
  active = false,
  className,
  type = "button",
  ...buttonProps
}: IconButtonProps) {
  const resolvedStyleType = styleType ?? (active ? "normal" : "weak");
  const resolvedIconType =
    iconType ??
    (direction
      ? directionIconType[direction]
      : size === "xs"
        ? "CLOSE"
        : size === "s"
          ? "CLOSE_S"
          : "CLOSE_M");
  const isDisabled = buttonProps.disabled;
  const isCloseIcon = closeIconTypes.has(resolvedIconType);
  const iconGlyphClassName = closeIconTypes.has(resolvedIconType)
    ? closeIconStyles[size]
    : iconFrameStyles[size];

  return (
    <button
      type={type}
      aria-label={
        buttonProps["aria-label"] ??
        (direction ? (direction === "left" ? "이전" : "다음") : "아이콘 버튼")
      }
      className={clsx(
        "box-border transition-colors",
        sizeStyles[size],
        isDisabled
          ? "cursor-not-allowed bg-fill-state-disabled text-icon-neutral-assistive shadow-none"
          : clsx(
              "cursor-pointer",
              buttonType === "transparent" &&
                styleInteractionStyles[resolvedStyleType],
              typeStyles[buttonType],
              buttonType === "transparent" && styleColorStyles[resolvedStyleType],
            ),
        className,
      )}
      {...buttonProps}
    >
      <span
        className={clsx(
          "absolute left-1/2 top-1/2 grid aspect-square shrink-0 -translate-x-1/2 -translate-y-1/2 place-items-center [&_svg]:block",
          iconFrameStyles[size],
        )}
      >
        {isCloseIcon ? (
          <CloseGlyph className={clsx("block shrink-0", iconGlyphClassName)} />
        ) : (
          <Icon
            type={resolvedIconType}
            className={clsx("block shrink-0", iconGlyphClassName)}
          />
        )}
      </span>
    </button>
  );
}
