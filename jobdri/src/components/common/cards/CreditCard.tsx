"use client";

import { useState } from "react";
import type { HTMLAttributes } from "react";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";
import ModalPurchase from "@/components/common/modal/ModalPurchase";
import type { PlanCode } from "@/lib/api/credit";

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
  discountLabel,
  creditLabel,
  currencyLabel,
  ...articleProps
}: CreditCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchaseClick = () => {
    onPurchase?.();
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <ModalPurchase
          creditCount={creditCount}
          price={price}
          planCode={planCode}
          onClose={() => setIsModalOpen(false)}
          title="크레딧을 충전할까요?"
        />
      )}
      <article
        className={clsx(
          "flex w-full flex-col items-center h-fit rounded-card bg-bg-contents-default px-8 pt-8 pb-7 shadow-card",
          className,
        )}
        {...articleProps}
      >
        <div className="flex flex-1 flex-col justify-between gap-8 w-full">
          <div className="flex flex-col  items-center gap-4">
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
      </article>
    </>
  );
}
