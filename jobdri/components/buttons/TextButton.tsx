import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon from "@/components/icons/Icon";

export type TextButtonSize = "small" | "large";
export type TextButtonStyle = "primary" | "secondary";
export type TextButtonIconPosition = "right" | "left";

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: TextButtonSize;
  styleType?: TextButtonStyle;
  iconPosition?: TextButtonIconPosition;
}

const sizeStyles: Record<TextButtonSize, string> = {
  small: "h-[21px] w-[76px] pl-2 text-label14-med",
  large: "py-1 pr-0.5 pl-3 text-b16-med",
};

const iconSizeStyles: Record<TextButtonSize, string> = {
  small: "h-5 w-5",
  large: "h-6 w-6",
};

const styleTypeStyles: Record<TextButtonStyle, string> = {
  primary: "text-text-primary-default",
  secondary: "text-text-neutral-caption",
};

const iconColorStyles: Record<TextButtonStyle, string> = {
  primary: "text-icon-primary-default",
  secondary: "text-icon-assistive",
};

export default function TextButton({
  label = "전체보기",
  size = "small",
  styleType = "primary",
  iconPosition = "right",
  className,
  type = "button",
  ...buttonProps
}: TextButtonProps) {
  const isLeftLarge = iconPosition === "left" && size === "large";
  const isRightLarge = iconPosition === "right" && size === "large";
  const iconType = iconPosition === "left" ? "ARROW_L" : size === "small" ? "ARROW_R_N_S" : "ARROW_R_N";
  const icon = (
    <Icon
      type={iconType}
      className={clsx(
        "aspect-square shrink-0",
        iconSizeStyles[size],
        iconColorStyles[styleType],
      )}
    />
  );

  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center rounded-toast-s [font-feature-settings:'liga'_off,'clig'_off] hover:bg-fill-hover",
        isLeftLarge
          ? "h-[38px] w-[107px] gap-2 py-1.5 pr-3 pl-2 text-b16-med"
          : isRightLarge
            ? "h-[34px] w-[93px] py-1 pr-0.5 pl-3 text-b16-med"
          : sizeStyles[size],
        styleTypeStyles[styleType],
        styleType === "secondary" && size === "small" && "font-normal",
        className,
      )}
      {...buttonProps}
    >
      {iconPosition === "left" && icon}
      <span>{label}</span>
      {iconPosition === "right" && icon}
    </button>
  );
}
