import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";

type ModalNoticeVariant = "single" | "double";

/** develop 호환용 type 값 → variant 매핑 */
const TYPE_TO_VARIANT: Record<string, ModalNoticeVariant> = {
  confirmationModal: "double",
  alertModal: "single",
};

interface ModalNoticeActionProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  label?: string;
}

interface ModalNoticeProps {
  variant?: ModalNoticeVariant;
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
  type,
  onClose: _onClose,
  title = "공고 링크를 입력해주세요.",
  description = "링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다.",
  primaryAction = {},
  secondaryAction = {},
  className,
}: ModalNoticeProps) {
  const variant = variantProp ?? (type ? (TYPE_TO_VARIANT[type] ?? "single") : "single");
  const {
    label: primaryLabel = variant === "single" ? "닫기" : "입력하기",
    className: primaryClassName,
    ...primaryButtonProps
  } = primaryAction;
  const {
    label: secondaryLabel = "닫기",
    className: secondaryClassName,
    ...secondaryButtonProps
  } = secondaryAction;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={clsx(
        "flex w-[400px] flex-col items-center justify-center gap-0 overflow-hidden rounded-card-s bg-fill-quaternary-default pt-12 shadow-modal",
        className,
      )}
    >
      <div className="flex self-stretch flex-col items-center justify-center gap-0 px-8">
        <div className="flex self-stretch flex-col items-center justify-center gap-4 pb-8">
          <p className="self-stretch text-center text-b16-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            {title}
          </p>
          <p className="self-stretch text-center text-sub14-med tracking-normal text-text-neutral-caption whitespace-pre-line [font-feature-settings:'liga'_off,'clig'_off]">
            {description}
          </p>
        </div>
      </div>

      <div className="flex self-stretch flex-col items-start gap-2.5 px-8 pb-8">
        {variant === "single" ? (
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
