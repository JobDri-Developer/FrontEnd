"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import Icon from "@/components/common/icons/Icon";
import { ButtonCtaModal } from "@/components/common/buttons";
import useOutsideClick from "@/hooks/useOutsideClick";
import { preparePurchase, type PlanCode } from "@/lib/api/credit";

interface ModalPurchaseProps {
  creditCount?: number;
  price?: string;
  planCode: PlanCode;
  onClose?: () => void;
  className?: string;
  title?: string;
}

export default function ModalPurchase({
  creditCount = 3,
  price = "2,500",
  planCode,
  onClose,
  className,
  title,
}: ModalPurchaseProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useOutsideClick(modalRef, onClose);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const { clientKey, orderId, orderName, amount, customerEmail } =
        await preparePurchase(planCode);

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: amount },
        orderId,
        orderName,
        customerEmail,
        successUrl: `${window.location.origin}/credit`,
        failUrl: `${window.location.origin}/credit`,
      });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
      <div
        ref={modalRef}
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
        <div className="flex flex-col items-center gap-4 px-8 pb-2 pt-3">
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
            label={isLoading ? "처리 중..." : "구매하기"}
            onCancel={onClose}
            onSubmit={handleConfirm}
            className="w-full"
            // disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
