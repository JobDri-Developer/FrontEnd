import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

type IconButtonDirection = "left" | "right";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: IconButtonDirection;
  active?: boolean;

}

const directionIconType: Record<IconButtonDirection, "ARROW_L" | "ARROW_R"> = {
  left: "ARROW_L",
  right: "ARROW_R",
};

export default function IconButton({
  direction,
  active = false,
  className,

  type = "button",
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={direction === "left" ? "이전" : "다음"}
      className={clsx(
        "flex items-center justify-center gap-2.5 rounded-icon-round bg-bg-white p-2.5",
        buttonProps.disabled ? "cursor-not-allowed" : "cursor-pointer",
        active ? "text-icon-neutral-heavy" : "text-icon-neutral-assistive",
        className,

      )}
      {...buttonProps}
    >
      <Icon
        type={directionIconType[direction]}
        className="aspect-square h-6 w-6 shrink-0"
      />
    </button>
  );
}
