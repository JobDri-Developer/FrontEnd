import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Button, type ButtonStyle } from "@/components/common/buttons";
import type { IconType } from "@/components/common/icons/Icon";

export type CtaFooterType = "wizard" | "result";

export interface CtaFooterActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label?: string;
  iconType?: IconType;
}

export interface CtaFooterProps {
  type?: CtaFooterType;
  showBackButton?: boolean;
  backAction?: CtaFooterActionProps;
  nextAction?: CtaFooterActionProps;
  retryAction?: CtaFooterActionProps;
  saveAction?: CtaFooterActionProps;
  centerSlot?: ReactNode;
  className?: string;
}

const ctaButtonLabelClass = "!h-6 !px-2";

const ctaButtonBaseClass = "!h-10 !gap-0.5 !px-3 !py-2";

function CtaButton({
  action = {},
  defaultLabel,
  defaultIconType,
  iconPosition = "left",
  styleType,
  widthClassName,
}: {
  action?: CtaFooterActionProps;
  defaultLabel: string;
  defaultIconType?: IconType;
  iconPosition?: "left" | "right";
  styleType: ButtonStyle;
  widthClassName: string;
}) {
  const {
    label = defaultLabel,
    iconType = defaultIconType,
    className,
    ...buttonProps
  } = action;

  return (
    <Button
      label={label}
      styleType={styleType}
      size="medium"
      iconType={iconType}
      iconPosition={iconPosition}
      labelClassName={ctaButtonLabelClass}
      className={clsx(ctaButtonBaseClass, widthClassName, className)}
      {...buttonProps}
    />
  );
}

export default function CtaFooter({
  type = "wizard",
  showBackButton = true,
  backAction,
  nextAction,
  retryAction,
  saveAction,
  centerSlot,
  className,
}: CtaFooterProps) {
  if (type === "result") {
    return (
      <footer
        className={clsx(
          "flex w-[1440px] items-center justify-end gap-8 bg-bg-white px-6 py-3",
          className,
        )}
      >
        <div className="flex w-[400px] shrink-0 items-center justify-end gap-3">
          <CtaButton
            action={retryAction}
            defaultLabel="재도전하기"
            styleType="tertiary"
            widthClassName="!w-[132px]"
          />
          <CtaButton
            action={saveAction}
            defaultLabel="저장 후 나가기"
            styleType="secondary"
            widthClassName="!w-[132px]"
          />
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={clsx(
        "flex w-[1440px] items-center justify-between bg-bg-white px-6 py-3",
        className,
      )}
    >
      <div className="flex w-[400px] shrink-0 items-center gap-3">
        {showBackButton ? (
          <CtaButton
            action={backAction}
            defaultLabel="이전으로"
            defaultIconType="ARROW_L"
            styleType="tertiary"
            widthClassName="!w-[120px]"
          />
        ) : (
          <div aria-hidden="true" className="h-10 w-[120px] shrink-0" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center">
        {centerSlot}
      </div>

      <div className="flex w-[400px] shrink-0 items-center justify-end gap-3">
        <CtaButton
          action={nextAction}
          defaultLabel="다음으로"
          defaultIconType="ARROW_R"
          iconPosition="right"
          styleType="primary"
          widthClassName="!w-[120px]"
        />
      </div>
    </footer>
  );
}
