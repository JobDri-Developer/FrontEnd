import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";

type IconOnlyButtonTone = "light" | "dark";

interface IconOnlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconType?: IconType;
  tone?: IconOnlyButtonTone;
}

const toneStyles: Record<IconOnlyButtonTone, string> = {
  light:
    "text-icon-neutral-assistive hover:bg-fill-hover hover:text-icon-neutral-default",
  dark: "text-icon-neutral-default hover:bg-[rgba(255,255,255,0.05)] hover:text-icon-neutral-assistive",
};

export default function IconOnlyButton({
  iconType = "CLOSE_M",
  tone = "light",
  className,
  type = "button",
  ...buttonProps
}: IconOnlyButtonProps) {
  return (
    <button
      type={type}
      aria-label="아이콘 버튼"
      className={clsx(
        "flex h-[30px] w-[30px] items-center justify-center rounded-[10px] p-[3px]",
        buttonProps.disabled ? "cursor-not-allowed" : "cursor-pointer",
        toneStyles[tone],
        className,
      )}
      {...buttonProps}
    >
      <Icon type={iconType} className="h-6 w-6 shrink-0" />
    </button>
  );
}
