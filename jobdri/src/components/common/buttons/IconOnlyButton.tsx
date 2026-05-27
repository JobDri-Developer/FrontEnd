import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";

type IconOnlyButtonTone = "light" | "dark";

interface IconOnlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconType?: IconType;
  tone?: IconOnlyButtonTone;
  size?: "default" | "small";
}

const toneStyles: Record<IconOnlyButtonTone, string> = {
  light:
    "text-icon-neutral-assistive hover:bg-fill-hover hover:text-icon-neutral-default",
  dark: "text-icon-neutral-default hover:bg-fill-inverse-hover hover:text-icon-neutral-assistive",
};

export default function IconOnlyButton({
  iconType,
  tone = "light",
  className,
  type = "button",
  size = "default",
  ...buttonProps
}: IconOnlyButtonProps) {
  const resolvedIconType = iconType ?? (size === "small" ? "CLOSE_S" : "CLOSE_M");

  return (
    <button
      type={type}
      aria-label="아이콘 버튼"
      className={clsx(
        "flex h-[30px] w-[30px] items-center justify-center rounded-[10px] p-[3px]",
        buttonProps.disabled ? "cursor-not-allowed" : "cursor-pointer",
        toneStyles[tone],
        className,
        size === "small" ? "h-6 w-6" : "h-10 w-10",
      )}
      {...buttonProps}
    >
      <Icon
        type={resolvedIconType}
        className={clsx("shrink-0", size === "small" ? "h-5 w-5" : "h-6 w-6")}
      />
    </button>
  );
}
