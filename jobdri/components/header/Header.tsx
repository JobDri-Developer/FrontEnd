"use client";

import type { ButtonHTMLAttributes } from "react";
import Icon, { type IconType } from "@/components/icons/Icon";

interface HeaderActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  iconType?: IconType;
  label: string;
}

interface HeaderProps {
  title?: string;
  leftAction?: HeaderActionProps;
  rightAction?: HeaderActionProps;
}

const actionClassName =
  "inline-flex items-center justify-end gap-1 rounded-cta-s bg-fill-quaternary-assistive py-1.5 pr-3 pl-2 text-[14px] font-semibold leading-[140%] tracking-[-0.28px] text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]";

function HeaderAction({
  iconType = "HOME_S",
  label,
  className = "",
  ...buttonProps
}: HeaderActionProps) {
  return (
    <button
      type="button"
      {...buttonProps}
      className={`${actionClassName} ${className}`}
    >
      <Icon
        type={iconType}
        className="h-6 w-6 text-fill-tertiary-assistive"
      />
      <span className="flex h-[22px] items-center justify-center gap-2.5 px-0.5">
        {label}
      </span>
    </button>
  );
}

export default function Header({
  title = "모의 서류 지원",
  leftAction = { label: "돌아가기", iconType: "HOME_S" },
  rightAction = { label: "기업 선택하기", iconType: "HOME_S" },
}: HeaderProps) {
  return (
    <header className="flex h-[60px] items-center justify-center gap-8 self-stretch border-b border-line-neutral-default bg-fill-quaternary-default px-[82px]">
      <div className="grid h-9 w-[1116px] grid-cols-[1fr_auto_1fr] items-center">
        <HeaderAction {...leftAction} className="justify-self-start" />

        <h1 className="text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {title}
        </h1>

        <HeaderAction {...rightAction} className="justify-self-end" />
      </div>
    </header>
  );
}
