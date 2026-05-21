"use client";

import type { ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";

interface FooterActionProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  label?: string;
  /** 클릭 시 이동할 경로. onClick과 함께 쓸 경우 onClick이 먼저 실행됩니다. */
  href?: string;
}

interface FooterProps {
  backAction?: FooterActionProps;
  ctaAction?: FooterActionProps;
  className?: string;
  ctaLabel?: string;
  hideBackAction?: boolean;
}

export default function Footer({
  backAction = {},
  ctaAction = {},
  className,
  ctaLabel = "",
  hideBackAction = false,
}: FooterProps) {
  const router = useRouter();

  const {
    label: backLabel = "뒤로가기",
    className: backClassName,
    href: backHref,
    onClick: backOnClick,
    ...backButtonProps
  } = backAction;

  const {
    className: ctaClassName,
    href: ctaHref,
    onClick: ctaOnClick,
    ...ctaButtonProps
  } = ctaAction;

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    backOnClick?.(e);
    if (backHref) router.push(backHref);
  };

  const handleCta = (e: React.MouseEvent<HTMLButtonElement>) => {
    ctaOnClick?.(e);
    if (ctaHref && !ctaButtonProps.disabled) router.push(ctaHref);
  };

  return (
    <footer
      className={clsx(
        "relative left-1/2 flex w-screen shrink-0 -translate-x-1/2 items-center justify-center gap-8 border-t border-line-neutral-default bg-bg-contents-assistive pt-4 pb-8",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--width-default)] items-start justify-between">
        {hideBackAction ? (
          <div aria-hidden="true" className="h-[38px] w-[98px] shrink-0" />
        ) : (
          <Button
            label={backLabel}
            styleType="tertiary"
            size="medium"
            iconType="ARROW_L"
            className={clsx("!gap-0.5", backClassName)}
            onClick={handleBack}
            {...backButtonProps}
          />
        )}
        <Button
          label={ctaLabel}
          styleType="primary"
          size="medium"
          className={ctaClassName}
          onClick={handleCta}
          {...ctaButtonProps}
        />
      </div>
    </footer>
  );
}
