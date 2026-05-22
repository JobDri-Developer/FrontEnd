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

  const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    backOnClick?.(event);
    if (backHref && !event.defaultPrevented) router.push(backHref);
  };

  const handleCta = (event: React.MouseEvent<HTMLButtonElement>) => {
    ctaOnClick?.(event);
    if (ctaHref && !ctaButtonProps.disabled && !event.defaultPrevented) {
      router.push(ctaHref);
    }
  };

  return (
    <footer
      className={clsx(
        "relative left-1/2 flex w-screen shrink-0 -translate-x-1/2 items-center justify-center gap-8 border-t border-line-neutral-default bg-bg-contents-default pt-4 pb-8",
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
