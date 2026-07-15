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
  xs: "relative inline-flex h-5 w-5 items-center gap-2.5 p-0.5 rounded-chip-s",
  s: "relative inline-flex h-6 w-6 items-center gap-2.5 p-0.5 rounded-tap-contents",
  m: "relative flex h-[30px] w-[30px] items-center gap-2.5 p-[3px] rounded-icon-default",
  l: "relative flex h-10 w-10 items-center gap-2.5 p-1.5 rounded-icon-default",
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

const bellIconTypes = new Set<IconType>(["BELL"]);

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

function BellGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="scale(0.833333)">
        <path
          d="M13.9287 19.5C14.3143 19.5001 14.5709 19.75 14.4424 20.125C14.1852 21.2499 13.1571 22 12 22C10.8429 22 9.8148 21.2499 9.55762 20.125C9.42906 19.75 9.68565 19.5001 10.0713 19.5H13.9287Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C15.6 2 18.4287 4.75 18.4287 8.25V11.085L18.4365 11.3076C18.475 11.8255 18.6482 12.3257 18.9395 12.7588L20.6143 15.25C20.8714 15.5 21 15.875 21 16.25L20.9893 16.4355C20.8936 17.2944 20.1461 18.0221 19.2627 18.1152L19.0713 18.125H4.92871C3.90014 18.25 3 17.375 3 16.375C3 16 3.1286 15.625 3.38574 15.375L5.06055 12.8838C5.39331 12.3889 5.57129 11.8063 5.57129 11.21V8.25C5.57129 4.75 8.4 2 12 2Z"
          fill="currentColor"
        />
      </g>
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
  const isBellIcon = bellIconTypes.has(resolvedIconType);
  const iconGlyphClassName = isCloseIcon
    ? closeIconStyles[size]
    : isBellIcon
      ? "h-5 w-5"
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
        ) : isBellIcon ? (
          <BellGlyph className={clsx("block shrink-0", iconGlyphClassName)} />
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
