"use client";

import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import { ButtonCtaModal } from "@/components/common/buttons";

interface ModalPurchaseProps {
  creditCount?: number;
  price?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  className?: string;
  title?: string;
}

export default function ModalPurchase({
  creditCount = 3,
  price = "2,500",
  onConfirm,
  onClose,
  className,
  title,
}: ModalPurchaseProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
      <div
        className={clsx(
          "flex w-[480px] flex-col overflow-hidden rounded-card bg-fill-quaternary-default shadow-modal",
          className,
        )}
      >
        {/* 헤더 */}
        <div className="flex justify-end px-7 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="text-icon-neutral-assistive transition-colors hover:text-icon-neutral-default"
          >
            <Icon type="CLOSE_M" className="h-5 w-5" />
          </button>
        </div>

        {/* 바디 */}
        <div className="flex flex-col items-center gap-4 px-8 pb-2 pt-3 ">
          {/* 텍스트 */}
          <div className="flex flex-col items-center gap-2 text-center mb-8">
            <span className="text-b16-semibold text-text-neutral-title">
              {title}
            </span>
            <span className="text-sub14-med text-text-neutral-caption">
              {creditCount}크레딧 | {price}원
            </span>
          </div>

          {/* 버튼 */}
          <ButtonCtaModal
            stack="stack2_horizontal"
            cancelLabel="취소하기"
            label="구매하기"
            onCancel={onClose}
            onSubmit={onConfirm}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
