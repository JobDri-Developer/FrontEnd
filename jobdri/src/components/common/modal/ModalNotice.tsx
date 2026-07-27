"use client";

import type { ButtonHTMLAttributes } from "react";
import { useRef } from "react";
import clsx from "clsx";
import { Button, type ButtonStyle } from "@/components/common/buttons";
import useOutsideClick from "@/hooks/useOutsideClick";

type ModalNoticeVariant = "single" | "double";
type ModalNoticeLayout = "default" | "centered";

/** develop 호환용 type 값 → variant 매핑 */
const TYPE_TO_VARIANT: Record<string, ModalNoticeVariant> = {
  confirmation: "double",
  confirmationModal: "double",
  alertModal: "single",
};

interface ModalNoticeActionProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  label?: string;
  styleType?: ButtonStyle;
}

interface ModalNoticeProps {
  variant?: ModalNoticeVariant;
  layout?: ModalNoticeLayout;
  /** @deprecated variant를 사용하세요. 하위 호환용 */
  type?: string;
  title?: string;
  description?: string;
  primaryAction?: ModalNoticeActionProps;
  secondaryAction?: ModalNoticeActionProps;
  /** 모달 외부 클릭 등 닫기 콜백 */
  onClose?: () => void;
  className?: string;
}

export default function ModalNotice({
  variant: variantProp,
  layout = "default",
  type,
  onClose,
  title = "공고 링크를 입력해주세요.",
  description = "링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다.",
  primaryAction = {},
  secondaryAction = {},
  className,
}: ModalNoticeProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const variant =
    variantProp ?? (type ? (TYPE_TO_VARIANT[type] ?? "single") : "single");
  const isCentered = layout === "centered";
  const {
    label: primaryLabel = variant === "single" ? "닫기" : "입력하기",
    styleType: primaryStyleType = "secondary",
    className: primaryClassName,
    ...primaryButtonProps
  } = primaryAction;
  const {
    label: secondaryLabel = "닫기",
    styleType: secondaryStyleType = "quaternary",
    className: secondaryClassName,
    ...secondaryButtonProps
  } = secondaryAction;

  useOutsideClick(modalRef, onClose, variant === "single");

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={clsx(
        "flex flex-col items-center justify-center gap-0 overflow-hidden shadow-modal",
        isCentered
          ? "w-[400px] rounded-card-s bg-fill-quaternary-default pt-12"
          : "w-[380px] rounded-card-l bg-bg-contents-default",
        className,
      )}
    >
      <div
        className={clsx(
          "flex self-stretch flex-col",
          isCentered
            ? "items-center justify-center gap-0 px-8"
            : "items-start gap-4 px-7 pt-7",
        )}
      >
        <div
          className={clsx(
            "flex self-stretch flex-col",
            isCentered
              ? "items-center justify-center gap-4 pb-8"
              : "items-start gap-3",
          )}
        >
          <p
            className={clsx(
              "self-stretch text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]",
              isCentered
                ? "text-center text-b16-semibold tracking-normal"
                : "text-left text-t20-semibold",
            )}
          >
            {title}
          </p>
          <p
            className={clsx(
              "self-stretch whitespace-pre-line text-sub14-med tracking-normal [font-feature-settings:'liga'_off,'clig'_off]",
              isCentered
                ? "text-center text-text-neutral-caption"
                : "text-left text-text-neutral-description",
            )}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        className={clsx(
          "flex self-stretch",
          isCentered
            ? "flex-col items-start gap-2.5 px-8 pb-8"
            : "items-end justify-end gap-2 px-5 pt-8 pb-5",
        )}
      >
        {variant === "single" ? (
          <Button
            label={primaryLabel}
            styleType={primaryStyleType}
            size="large"
            className={clsx(
              isCentered ? "w-full" : "flex-1",
              "tracking-normal",
              primaryClassName,
            )}
            {...primaryButtonProps}
          />
        ) : isCentered ? (
          <div className="flex self-stretch items-start gap-3">
            <Button
              label={secondaryLabel}
              styleType={secondaryStyleType}
              size="large"
              className={clsx("flex-1 tracking-normal", secondaryClassName)}
              {...secondaryButtonProps}
            />
            <Button
              label={primaryLabel}
              styleType={primaryStyleType}
              size="large"
              className={clsx("flex-1 tracking-normal", primaryClassName)}
              {...primaryButtonProps}
            />
          </div>
        ) : (
          <>
            <Button
              label={secondaryLabel}
              styleType={secondaryStyleType}
              size="large"
              className={clsx("flex-1 tracking-normal", secondaryClassName)}
              {...secondaryButtonProps}
            />
            <Button
              label={primaryLabel}
              styleType={primaryStyleType}
              size="large"
              className={clsx("flex-1 tracking-normal", primaryClassName)}
              {...primaryButtonProps}
            />
          </>
        )}
      </div>
    </div>
  );
}
