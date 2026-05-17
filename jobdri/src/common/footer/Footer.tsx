import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";

interface FooterActionProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  label?: string;
}

interface FooterProps {
  backAction?: FooterActionProps;
  ctaAction?: FooterActionProps;
  className?: string;
  ctaLabel?: string;
}

export default function Footer({
  backAction = {},
  ctaAction = {},
  className,
  ctaLabel = "",
}: FooterProps) {
  const {
    label: backLabel = "뒤로가기",
    className: backClassName,
    ...backButtonProps
  } = backAction;
  const { className: ctaClassName, ...ctaButtonProps } = ctaAction;

  return (
    <footer
      className={clsx(
        "flex w-full shrink-0 fixed bottom-0 items-center justify-center gap-8 border-t border-line-neutral-default bg-bg-contents-assistive mx-auto pt-4 pb-8",
        className,
      )}
    >
      <div className="flex max-w-[1116px] flex-1 items-start justify-between">
        <Button
          label={backLabel}
          styleType="tertiary"
          size="medium"
          iconType="ARROW_L"
          className={backClassName}
          {...backButtonProps}
        />
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
