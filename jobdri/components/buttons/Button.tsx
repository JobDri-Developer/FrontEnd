import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/icons/Icon";

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
  large: "flex h-12 w-[137px] p-3 text-btn16-semibold",
  medium: "inline-flex h-10 w-[129px] p-2 text-btn16-semibold",
  small:
    "inline-flex h-9 w-[115px] p-2 text-[14px] font-semibold leading-[140%] tracking-[-0.28px] text-justify",
  xsmall: "inline-flex h-[25px] w-24 px-1.5 py-1 text-cap12-med",
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
    "bg-fill-primary-default text-text-neutral-white hover:bg-fill-primary-hover-default",
  secondary:
    "bg-fill-tertiary-default text-text-neutral-white hover:bg-fill-tertiary-hover-default",
  tertiary:
    "border border-line-neutral-default bg-fill-quaternary-default text-text-neutral-description hover:border-line-neutral-strong hover:bg-fill-quaternary-hover-default",
  quaternary:
    "bg-fill-quaternary-assistive text-text-neutral-description hover:bg-fill-quaternary-hover-assistive",
};

const inactiveStyle =
  "bg-fill-disabled text-text-neutral-disabled hover:bg-fill-disabled";

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
        "items-center justify-center gap-0.5 text-center [font-feature-settings:'liga'_off,'clig'_off]",
        sizeStyles[size],
        radiusStyles[size],
        isInactive ? inactiveStyle : styleTypeStyles[resolvedStyleType],
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
          "whitespace-nowrap",
          size === "xsmall"
            ? "flex self-stretch items-center justify-center gap-2.5 px-0.5"
            : "px-px",
        )}
      >
        {label}
      </span>
    </button>
  );
}
