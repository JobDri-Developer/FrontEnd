import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";

export type ButtonSize = "large" | "medium" | "small" | "xsmall";
export type ButtonStyle =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "error";
export type ButtonIconPosition = "left" | "right";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  styleType?: ButtonStyle;
  size?: ButtonSize;
  iconType?: IconType;
  iconPosition?: ButtonIconPosition;
  leftIconType?: IconType;
  rightIconType?: IconType;
  iconClassName?: string;
  leftIconClassName?: string;
  rightIconClassName?: string;
  labelClassName?: string;
  active?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  large: "inline-flex px-4 py-3 text-btn16-semibold",
  medium: "inline-flex px-3 py-2 text-btn16-semibold",
  small:
    "inline-flex h-9 px-2 py-1.5 text-[14px] font-semibold leading-[140%] tracking-[-0.28px] text-justify",
  xsmall:
    "inline-flex px-1.5 py-1 text-[12px] font-medium leading-[140%] tracking-[-0.24px]",
};

const radiusStyles: Record<ButtonSize, string> = {
  large: "rounded-cta-s",
  medium: "rounded-cta-s",
  small: "rounded-cta-s",
  xsmall: "rounded-toast-s",
};

const iconSizeStyles: Record<ButtonSize, string> = {
  large: "h-6 w-6",
  medium: "h-6 w-6",
  small: "h-5 w-5",
  xsmall: "h-4 w-4",
};

const frameSizeStyles: Record<ButtonSize, string> = {
  large: "h-6",
  medium: "h-6",
  small: "h-6",
  xsmall: "self-stretch",
};

const labelSizeStyles: Record<ButtonSize, string> = {
  large: "h-6 px-2 gap-0",
  medium: "h-6 px-2 gap-0",
  small: "h-6 px-2 gap-0",
  xsmall: "px-2 gap-0",
};

const styleTypeStyles: Record<ButtonStyle, string> = {
  primary:
    "bg-fill-primary-default text-text-neutral-white hover:bg-fill-primary-default-hover hover:shadow-cta-primary active:bg-fill-primary-pressed-default active:shadow-cta-primary",
  secondary:
    "bg-fill-tertiary-default text-text-neutral-white hover:bg-[linear-gradient(146deg,var(--color-fill-tertiary-default)_42.48%,var(--color-fill-tertiary-default-pressed)_55.31%)] active:bg-fill-tertiary-default-pressed active:bg-none",
  tertiary:
    "border border-line-neutral-default bg-fill-quaternary-default text-text-neutral-description hover:border-line-neutral-default hover:bg-fill-quaternary-default hover:shadow-cta-secondary active:border-line-neutral-strong active:bg-fill-quaternary-assistive active:shadow-cta-secondary",
  quaternary:
    "bg-fill-quaternary-assistive text-text-neutral-description hover:bg-fill-quaternary-assistive-hover active:bg-fill-quaternary-assistive-pressed",
  error:
    "bg-fill-system-fail-default text-text-system-fail hover:bg-fill-system-fail-hover active:bg-fill-system-fail-hover",
};

const disabledStyleTypeStyles: Record<ButtonStyle, string> = {
  primary:
    "bg-fill-state-disabled text-text-neutral-disabled shadow-none hover:bg-fill-state-disabled active:bg-fill-state-disabled",
  secondary:
    "bg-fill-state-disabled text-text-neutral-disabled shadow-none hover:bg-fill-state-disabled active:bg-fill-state-disabled",
  tertiary:
    "border border-line-neutral-default bg-fill-state-disabled text-text-neutral-disabled shadow-none hover:bg-fill-state-disabled active:bg-fill-state-disabled",
  quaternary:
    "bg-fill-state-disabled text-text-neutral-disabled shadow-none hover:bg-fill-state-disabled active:bg-fill-state-disabled",
  error:
    "bg-fill-state-disabled text-text-neutral-disabled shadow-none hover:bg-fill-state-disabled active:bg-fill-state-disabled",
};

const iconColorStyles: Record<ButtonStyle, string> = {
  primary: "text-icon-neutral-white",
  secondary: "text-icon-neutral-white",
  tertiary: "text-icon-neutral-default",
  quaternary: "text-icon-neutral-default",
  error: "text-text-system-fail",
};

const disabledIconColorStyles: Record<ButtonStyle, string> = {
  primary: "text-icon-neutral-assistive",
  secondary: "text-icon-neutral-assistive",
  tertiary: "text-icon-neutral-assistive",
  quaternary: "text-icon-neutral-assistive",
  error: "text-icon-neutral-assistive",
};

export default function Button({
  label,
  styleType = "primary",
  size = "large",
  iconType,
  iconPosition = "left",
  leftIconType,
  rightIconType,
  iconClassName,
  leftIconClassName,
  rightIconClassName,
  labelClassName,
  active = true,
  className,
  type = "button",
  ...buttonProps
}: ButtonProps) {
  const resolvedStyleType = size === "xsmall" ? "tertiary" : styleType;
  const isInactive = !active || buttonProps.disabled;
  const resolvedLeftIconType =
    leftIconType ?? (iconPosition === "left" ? iconType : undefined);
  const resolvedRightIconType =
    rightIconType ?? (iconPosition === "right" ? iconType : undefined);
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
          isInactive
            ? disabledIconColorStyles[resolvedStyleType]
            : iconColorStyles[resolvedStyleType],
          iconClassName,
          resolvedIconClassName,
        )}
      />
    ) : null;

  return (
    <button
      type={type}
      className={clsx(
        "items-center justify-center gap-0 text-center [font-feature-settings:'liga'_off,'clig'_off]",
        sizeStyles[size],
        radiusStyles[size],
        isInactive
          ? clsx(
              "cursor-not-allowed",
              disabledStyleTypeStyles[resolvedStyleType],
            )
          : clsx("cursor-pointer", styleTypeStyles[resolvedStyleType]),
        className,
      )}
      aria-disabled={isInactive || undefined}
      {...buttonProps}
    >
      <span className={clsx("flex items-center", frameSizeStyles[size])}>
        {renderIcon(resolvedLeftIconType, leftIconClassName)}
        <span
          className={clsx(
            "flex items-center justify-center whitespace-nowrap",
            labelSizeStyles[size],
            labelClassName,
          )}
        >
          {label}
        </span>
        {renderIcon(resolvedRightIconType, rightIconClassName)}
      </span>
    </button>
  );
}
