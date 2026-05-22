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
  creditLabel = "크레딧",
  price = "2,500",
  currencyLabel = "원",
  discountRate = "21%",
  discountLabel = "할인",
  buttonLabel = "구매하기",
  planCode,
  onPurchase,
  className,
  ...articleProps
}: CreditCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchaseClick = () => {
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
          "flex w-full flex-col items-center h-full rounded-card bg-bg-contents-default px-8 pt-8 pb-7 shadow-card",
          className,
        )}
        {...articleProps}
      >
        <div className="flex flex-1 flex-col justify-between gap-8 w-full">
          <div className="flex flex-col  items-center gap-4">
            <div className="flex items-end justify-center gap-1">
              <span className="text-center text-[32px] font-bold leading-[130%] text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                {creditCount}
              </span>
              <span className="flex items-center justify-center gap-2.5 pb-1 text-center text-b16-bold text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                {creditLabel}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-start">
                <span className="text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  {price}
                </span>
                <span className="text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  {currencyLabel}
                </span>
              </div>

              <div
                className={`flex items-start ${!discountRate ? "invisible" : ""}`}
              >
                <span className="text-center text-b16-med text-text-primary-strong [font-feature-settings:'liga'_off,'clig'_off]">
                  {discountRate}
                </span>
                <span className="text-center text-b16-med text-text-primary-strong [font-feature-settings:'liga'_off,'clig'_off]">
                  {discountLabel}
                </span>
              </div>
            </div>
          </div>

          <Button
            label={buttonLabel}
            size="large"
            styleType="secondary"
            className="mt-auto h-[46px] items-end  w-full px-4"
            onClick={handlePurchaseClick}
          />
        </div>
      </article>
    </>
  );
}
