import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export type TextOnlyButtonSize = "small" | "large";
export type TextOnlyButtonStyle = "primary" | "secondary";

interface TextOnlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: TextOnlyButtonSize;
  styleType?: TextOnlyButtonStyle;
}

const typographyStyles: Record<
  TextOnlyButtonSize,
  Record<TextOnlyButtonStyle, string>
> = {
  small: {
    primary: "text-sub14-med",
    secondary: "text-sub14-reg",
  },
  large: {
    primary: "text-b16-med",
    secondary: "text-b16-med",
  },
};

const colorStyles: Record<TextOnlyButtonStyle, string> = {
  primary: "text-text-primary-default hover:text-fill-primary-pressed-default",
  secondary:
    "text-text-neutral-caption hover:text-fill-tertiary-default-pressed",
};

export default function TextOnlyButton({
  label = "전체보기",
  size = "small",
  styleType = "primary",
  className,
  type = "button",
  ...buttonProps
}: TextOnlyButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center rounded-toast-s [font-feature-settings:'liga'_off,'clig'_off] transition-colors",
        buttonProps.disabled ? "cursor-default" : "cursor-pointer",
        typographyStyles[size][styleType],
        colorStyles[styleType],
        className,
      )}
      {...buttonProps}
    >
      {label}
    </button>
  );
}
