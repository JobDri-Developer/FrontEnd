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
        "flex w-26 flex-col items-start overflow-hidden rounded-cta-s bg-bg-contents-default shadow-hover",
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
          className="flex w-full items-center self-stretch border-b border-line-neutral-default bg-bg-contents-default px-4 py-3 text-left text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off] last:border-b-0 hover:bg-fill-quaternary-assistive-hover active:bg-fill-quaternary-default-pressed disabled:cursor-not-allowed disabled:text-text-neutral-disabled"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
