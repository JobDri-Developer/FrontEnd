import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";

interface FooterActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label?: string;
}

interface FooterProps {
  backAction?: FooterActionProps;
  ctaAction?: FooterActionProps;
  className?: string;
  hideBackAction?: boolean;
}

export default function Footer({
  backAction = {},
  ctaAction = {},
  className,
  hideBackAction = false,
}: FooterProps) {
  const {
    label: backLabel = "뒤로가기",
    className: backClassName,
    ...backButtonProps
  } = backAction;
  const {
    label: ctaLabel = "CTA",
    className: ctaClassName,
    ...ctaButtonProps
  } = ctaAction;

  return (
    <footer
      className={clsx(
        "flex w-[1280px] shrink-0 items-center justify-center gap-8 border-t border-line-neutral-default bg-bg-contents-assistive px-[82px] pt-4 pb-8",
        className,
      )}
    >
      <div className="flex max-w-[1440px] flex-1 items-start justify-between">
        {hideBackAction ? (
          <span aria-hidden="true" className="h-[38px] w-[94px]" />
        ) : (
          <Button
            label={backLabel}
            styleType="tertiary"
            size="medium"
            iconType="ARROW_L"
            className={backClassName}
            {...backButtonProps}
          />
        )}
        <Button
          label={ctaLabel}
          styleType="primary"
          size="medium"
          className={ctaClassName}
          {...ctaButtonProps}
        />
      </div>
    </footer>
  );
}
