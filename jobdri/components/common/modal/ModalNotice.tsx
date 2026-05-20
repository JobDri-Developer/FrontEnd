"use client";

import type { ButtonHTMLAttributes } from "react";
import { useRef } from "react";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";
import useOutsideClick from "@/hooks/useOutsideClick";

type ModalNoticeVariant = "single" | "double";
type ModalNoticeType = "notice" | "confirmationModal";

interface ModalNoticeActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label?: string;
}

interface ModalNoticeProps {
  type?: ModalNoticeType;
  variant?: ModalNoticeVariant;
  title?: string;
  description?: string;
  primaryAction?: ModalNoticeActionProps;
  secondaryAction?: ModalNoticeActionProps;
  onClose?: () => void;
  className?: string;
}

export default function ModalNotice({
  type = "notice",
  variant = "single",
  title = "공고 링크를 입력해주세요.",
  description = "링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다.",
  primaryAction = {},
  secondaryAction = {},
  onClose,
  className,
}: ModalNoticeProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const resolvedVariant = type === "confirmationModal" ? "double" : variant;
  const {
    label: primaryLabel = resolvedVariant === "single" ? "닫기" : "입력하기",
    className: primaryClassName,
    ...primaryButtonProps
  } = primaryAction;
  const {
    label: secondaryLabel = "닫기",
    className: secondaryClassName,
    ...secondaryButtonProps
  } = secondaryAction;

  useOutsideClick(modalRef, onClose);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={clsx(
        "flex w-[400px] flex-col items-center justify-center gap-0 overflow-hidden rounded-card bg-fill-quaternary-default pt-12 shadow-modal",
        className,
      )}
    >
      <div className="flex self-stretch flex-col items-center justify-center gap-0 px-8">
        <div className="flex self-stretch flex-col items-center justify-center gap-4 pb-8">
          <p
            className="self-stretch text-center text-b16-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]"
          >
            {title}
          </p>
          <p
            className="self-stretch whitespace-pre-line text-center text-sub14-med tracking-normal text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]"
          >
            {description}
          </p>
        </div>
      </div>

      <div className="flex self-stretch flex-col items-start gap-2.5 px-8 pb-8">
        {resolvedVariant === "single" ? (
          <Button
            label={primaryLabel}
            styleType="secondary"
            size="large"
            className={clsx("w-full tracking-normal", primaryClassName)}
            {...primaryButtonProps}
          />
        ) : (
          <div className="flex self-stretch items-start gap-3">
            <Button
              label={secondaryLabel}
              styleType="quaternary"
              size="large"
              className={clsx("flex-1 tracking-normal", secondaryClassName)}
              {...secondaryButtonProps}
            />
            <Button
              label={primaryLabel}
              styleType="secondary"
              size="large"
              className={clsx("flex-1 tracking-normal", primaryClassName)}
              {...primaryButtonProps}
            />
          </div>
        )}
      </div>
    </div>
  );
}
