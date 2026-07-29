"use client";

import { useState } from "react";
import { ButtonCtaModal } from "@/components/common/buttons";
import { InputTextAreaAutoGrowS } from "@/components/common/input";
import { ModalOverlay } from "@/components/common/modal/ModalOverlay";
import { redeemCoupon } from "@/lib/api/credit";

interface CouponRegistrationModalProps {
  onClose: () => void;
  onSuccess: (creditAmount: number) => void;
}

export default function CouponRegistrationModal({
  onClose,
  onSuccess,
}: CouponRegistrationModalProps) {
  const [couponNumber, setCouponNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCouponNumberChange = (value: string) => {
    setCouponNumber(value);
    setError("");
  };

  const handleSubmit = async () => {
    const couponCode = couponNumber.trim();

    if (!couponCode || isSubmitting) {
      setError("쿠폰 번호를 확인해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await redeemCoupon(couponCode);
      onSuccess(result.creditAmount);
    } catch {
      setError("쿠폰 번호를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-registration-title"
        aria-describedby="coupon-registration-description"
        className="flex w-[400px] shrink-0 flex-col items-center justify-center gap-0 rounded-card-l bg-bg-contents-default shadow-modal"
      >
        <div className="flex flex-col items-start gap-4 self-stretch px-7 pt-7">
          <div className="flex flex-col items-start gap-3 self-stretch">
            <h2
              id="coupon-registration-title"
              className="self-stretch text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]"
            >
              쿠폰 등록하기
            </h2>
            <p
              id="coupon-registration-description"
              className="self-stretch text-sub14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]"
            >
              &ldquo;-&rdquo;와 띄어쓰기 없이 쿠폰번호를 입력해주세요.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2.5 self-stretch px-7 pt-6">
          <InputTextAreaAutoGrowS
            aria-label="쿠폰 일련 번호"
            autoFocus
            label=""
            required={false}
            placeholder="일련 번호를 입력해주세요."
            value={couponNumber}
            onChange={handleCouponNumberChange}
            error={error}
            disabled={isSubmitting}
            showAddButton={false}
            showBottomLine={false}
            className="gap-1"
          />
        </div>

        <div className="flex items-end justify-end gap-2 self-stretch px-5 pt-8 pb-5">
          <ButtonCtaModal
            stack="stack2_horizontal"
            cancelLabel="닫기"
            label="등록하기"
            cancelStyleType="quaternary"
            submitStyleType="secondary"
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitDisabled={isSubmitting}
            className="w-full !pb-0"
          />
        </div>
      </div>
    </ModalOverlay>
  );
}
