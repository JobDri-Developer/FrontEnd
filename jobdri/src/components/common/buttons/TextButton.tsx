import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";

export type TextButtonSize = "small" | "large";
export type TextButtonStyle = "primary" | "secondary";
export type TextButtonIconPosition = "right" | "left" | "null";
export type HoverType = "textOnly" | "none";

export interface TextButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  size?: TextButtonSize;
  styleType?: TextButtonStyle;
  iconType?: IconType;
  iconPosition?: TextButtonIconPosition;
  leftIconType?: IconType;
  rightIconType?: IconType;
  iconClassName?: string;
  leftIconClassName?: string;
  rightIconClassName?: string;
  labelClassName?: string;
  hover?: HoverType;
}

const sizeStyles: Record<TextButtonSize, string> = {
  small: "text-sub14-med",
  large: "text-b16-med",
};

const iconSizeStyles: Record<TextButtonSize, string> = {
  small: "h-5 w-5",
  large: "h-6 w-6",
};

const labelSizeStyles: Record<TextButtonSize, string> = {
  small: "h-[22px] px-1",
  large: "px-2 py-1",
};

const labelTextSizeStyles: Record<TextButtonSize, string> = {
  small: "text-sub14-med",
  large: "text-b16-med",
};

const styleTypeStyles: Record<TextButtonStyle, string> = {
  primary: "text-text-primary-default",
  secondary: "text-text-neutral-description",
};

const iconColorStyles: Record<TextButtonStyle, string> = {
  primary: "text-icon-primary-default",
  secondary: "text-icon-neutral-default",
};

const disabledStyles =
  "cursor-not-allowed text-text-neutral-disabled hover:bg-transparent active:bg-transparent";

function getDefaultIconType(
  size: TextButtonSize,
  iconPosition: Exclude<TextButtonIconPosition, "null">,
): IconType {
  if (iconPosition === "left") {
    return size === "small" ? "ARROW_LEFT_20" : "ARROW_LEFT_24";
  }

  return size === "small" ? "ARROW_RIGHT_20" : "ARROW_RIGHT_24";
}

export default function TextButton({
  label = "전체보기",
  size = "small",
  styleType = "primary",
  iconType,
  iconPosition = "right",
  leftIconType,
  rightIconType,
  iconClassName,
  leftIconClassName,
  rightIconClassName,
  labelClassName,
  hover = "none",
  className,
  type = "button",
  ...buttonProps
}: TextButtonProps) {
  const hasExplicitIcons = leftIconType !== undefined || rightIconType !== undefined;
  const isDisabled = buttonProps.disabled;
  const resolvedLeftIconType =
    leftIconType ??
    (!hasExplicitIcons && iconPosition === "left"
      ? iconType ?? getDefaultIconType(size, "left")
      : undefined);
  const resolvedRightIconType =
    rightIconType ??
    (!hasExplicitIcons && iconPosition === "right"
      ? iconType ?? getDefaultIconType(size, "right")
      : undefined);
  const renderIcon = (
    resolvedIconType: IconType | undefined,
    resolvedIconClassName?: string,
  ) =>
    resolvedIconType ? (
      <Icon
        type={resolvedIconType}
        className={clsx(
          "block aspect-square shrink-0",
          iconSizeStyles[size],
          isDisabled ? "text-icon-neutral-assistive" : iconColorStyles[styleType],
          iconClassName,
          resolvedIconClassName,
        )}
      />
    ) : null;

  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center rounded-toast-s [font-feature-settings:'liga'_off,'clig'_off]",
        sizeStyles[size],
        isDisabled
          ? disabledStyles
          : clsx(
              "cursor-pointer",
              hover === "textOnly"
                ? "hover:bg-transparent hover:text-fill-tertiary-default-pressed active:bg-transparent"
                : "hover:bg-fill-state-hover-light active:bg-fill-state-hover-light",
              styleTypeStyles[styleType],
            ),
        className,
      )}
      {...buttonProps}
    >
      {renderIcon(resolvedLeftIconType, leftIconClassName)}
      <span
        className={clsx(
          "flex items-center justify-center whitespace-nowrap",
          labelSizeStyles[size],
          labelClassName,
        )}
      >
        <span className={clsx("block", labelTextSizeStyles[size])}>
          {label}
        </span>
      </span>
      {renderIcon(resolvedRightIconType, rightIconClassName)}
    </button>
  );
}
