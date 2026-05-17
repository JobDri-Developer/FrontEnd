import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";

export type ButtonSize = "large" | "medium" | "small" | "xsmall";
export type ButtonStyle = "primary" | "secondary" | "tertiary" | "quaternary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  styleType?: ButtonStyle;
  size?: ButtonSize;
  iconType?: IconType;
  active?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  large: "inline-flex px-4 py-3 text-btn16-semibold",
  medium: "inline-flex px-3 py-2 text-btn16-semibold",
  small:
    "inline-flex px-2 py-1.5 text-[14px] font-semibold leading-[140%] tracking-[-0.28px] text-justify",
  xsmall:
    "inline-flex px-1.5 py-1 text-[12px] font-bold leading-[140%] tracking-[-0.24px]",
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

const styleTypeStyles: Record<ButtonStyle, string> = {
  primary:
    "bg-fill-primary-default text-text-neutral-white hover:bg-fill-primary-hover-default hover:shadow-cta-primary active:bg-fill-primary-pressed-default active:shadow-cta-primary",
  secondary:
    "bg-fill-tertiary-default text-text-neutral-white hover:bg-[linear-gradient(146deg,var(--color-fill-tertiary-default)_42.48%,var(--color-fill-tertiary-default-pressed)_55.31%)] active:bg-fill-tertiary-default-pressed active:bg-none",
  tertiary:
    "border border-line-neutral-default bg-fill-quaternary-default text-text-neutral-description hover:border-line-neutral-default hover:bg-fill-quaternary-default hover:shadow-cta-secondary active:border-line-neutral-strong active:bg-fill-quaternary-assistive active:shadow-cta-secondary",
  quaternary:
    "bg-fill-quaternary-assistive text-text-neutral-description hover:bg-fill-quaternary-hover-assistive active:bg-fill-quaternary-assistive-pressed",
};

const inactiveStyle =
  "cursor-not-allowed bg-fill-disabled text-text-neutral-disabled hover:bg-fill-disabled";

const iconColorStyles: Record<ButtonStyle, string> = {
  primary: "text-icon-neutral-white",
  secondary: "text-icon-neutral-white",
  tertiary: "text-icon-neutral-default",
  quaternary: "text-icon-neutral-default",
};

export default function Button({
  label,
  styleType = "primary",
  size = "large",
  iconType,
  active = true,
  className,
  type = "button",
  ...buttonProps
}: ButtonProps) {
  const resolvedStyleType = size === "xsmall" ? "tertiary" : styleType;
  const isInactive = !active || buttonProps.disabled;

  return (
    <button
      type={type}
      className={clsx(
        "items-center justify-center text-center [font-feature-settings:'liga'_off,'clig'_off]",
        size === "xsmall" && (resolvedStyleType === "tertiary" || isInactive)
          ? "gap-0"
          : "gap-1",
        sizeStyles[size],
        radiusStyles[size],
        isInactive
          ? inactiveStyle
          : clsx("cursor-pointer", styleTypeStyles[resolvedStyleType]),
        className,
      )}
      aria-disabled={isInactive || undefined}
      {...buttonProps}
    >
      {iconType && (
        <Icon
          type={iconType}
          className={clsx(
            "aspect-square shrink-0",
            iconSizeStyles[size],
            isInactive
              ? "text-icon-neutral-assistive"
              : iconColorStyles[resolvedStyleType],
          )}
        />
      )}
      <span
        className={clsx(
          "flex items-center justify-center gap-2.5 px-0.5 whitespace-nowrap",
          size !== "xsmall" && "h-[22px]",
          size === "xsmall" && "translate-y-px",
        )}
      >
        {label}
      </span>
    </button>
  );
}
