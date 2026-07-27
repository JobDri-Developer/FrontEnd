"use client";

import { useState, useEffect } from "react";
import type { HTMLAttributes } from "react";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";
import { ModalCard } from "../modal/ModalCard";
import { ModalOverlay } from "../modal/ModalOverlay";
import type { PlanCode } from "@/lib/api/credit";
import { preparePurchase } from "@/lib/api/credit";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { Toast } from "../toast";

interface CreditCardProps extends HTMLAttributes<HTMLElement> {
  creditCount?: number;
  creditLabel?: string;
  price?: string;
  currencyLabel?: string;
  discountRate?: string;
  discountLabel?: string;
  buttonLabel?: string;
  planCode: PlanCode;
  onPurchase?: () => void;
}

export default function CreditCard({
  creditCount = 3,
  price = "2,500",
  discountRate = "21",
  buttonLabel = "구매하기",
  planCode,
  onPurchase,
  className,

  ...articleProps
}: CreditCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePurchaseClick = () => {
    onPurchase?.();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isLoading) setIsModalOpen(false);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleConfirmPurchase = async () => {
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
        failUrl: `${window.location.origin}/credit/fail`,
        card: {
          easyPay: "TOSSPAY",
          flowMode: "DIRECT",
        },
      });
    } catch (error: unknown) {
      const tossError = error as { code?: string; message?: string };

      if (tossError.code === "USER_CANCEL") {
        setToastMessage("결제를 취소하였습니다.");
      } else {
        console.error("결제 창 호출 중 오류:", tossError.message || error);
        setToastMessage("결제 진행 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-10 left-1/2 z-[9999] -translate-x-1/2">
          <Toast message={toastMessage} position="top" />
        </div>
      )}

      {isModalOpen && (
        <ModalOverlay onClose={handleCloseModal}>
          <ModalCard
            onSecondaryClick={handleCloseModal}
            onPrimaryClick={handleConfirmPurchase}
            title="크레딧을 충전할까요?"
            description={`${creditCount} 크레딧을 충전합니다.`}
            secondaryBtn="닫기"
            primaryBtn={isLoading ? "처리 중..." : "충전하기"}
          />
        </ModalOverlay>
      )}

      {/* 크레딧 카드 UI */}
      <main
        className={clsx(
          "flex w-full flex-col items-center h-fit rounded-card bg-bg-contents-default px-8 pt-8 pb-7 shadow-card",
          className,
        )}
        {...articleProps}
      >
        <div className="flex flex-1 flex-col justify-between gap-8 w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-end justify-center gap-1">
              <span className="text-center text-[32px] font-bold leading-[130%] text-text-neutral-title ">
                {creditCount}
              </span>
              <span className="flex items-center justify-center gap-2.5 pb-1 text-center text-b16-med text-text-neutral-caption">
                크레딧
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-start">
                <span className="text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  {price}원
                </span>
              </div>

              <div
                className={clsx(
                  "flex items-start",
                  !discountRate ? "invisible" : "",
                )}
              >
                <span className="text-center text-b16-med text-text-primary-strong ">
                  {discountRate} 할인
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-2 w-full">
            <Button
              label={buttonLabel}
              size="large"
              styleType="secondary"
              onClick={handlePurchaseClick}
            />
            <p className="text-cap12-med text-text-neutral-caption items-center justify-center flex">
              * 구매한 이용권은 구매일로부터 6개월간 유효합니다
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
