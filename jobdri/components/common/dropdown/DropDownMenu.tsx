import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import clsx from "clsx";

export interface DropDownMenuItem {
  label: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled?: boolean;
}

interface DropDownMenuProps extends HTMLAttributes<HTMLDivElement> {
  items?: DropDownMenuItem[];
}

const defaultItems: DropDownMenuItem[] = [{ label: "삭제하기" }];

export default function DropDownMenu({
  items = defaultItems,
  className,
  ...divProps
}: DropDownMenuProps) {
  return (
    <div
      role="menu"
      className={clsx(
        "flex w-[104px] flex-col items-start overflow-hidden rounded-cta-s bg-bg-contents-default shadow-hover",
        className,
      )}
      {...divProps}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          onClick={item.onClick}
          className="flex w-full items-center self-stretch bg-bg-contents-default px-6 py-5 text-left text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off] hover:bg-bg-contents-assistive active:bg-bg-default disabled:cursor-not-allowed disabled:text-text-neutral-disabled"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
