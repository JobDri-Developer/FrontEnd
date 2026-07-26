"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard } from "@/components/common/cards";
import Useage from "@/components/common/credit/Useage";
import {
  fetchCreditPlans,
  confirmPurchase,
  type CreditPlan,
} from "@/lib/api/credit";
import Lnb from "@/components/common/lnb/Lnb";
import PageHeader from "@/components/common/PageHeader";

function calcDiscountRate(plan: CreditPlan, basePricePerUnit: number): string {
  const original = basePricePerUnit * plan.creditAmount;
  if (original <= plan.price) return "";
  const rate = Math.round(((original - plan.price) / original) * 100);
  return `${rate}%`;
}

function CreditContent() {
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCreditPlans()
      .then(setPlans)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (paymentKey && orderId && amount) {
      confirmPurchase(paymentKey, orderId, Number(amount)).catch(() => {});
    }
  }, [searchParams]);

  const basePricePerUnit =
    plans.find((p) => p.planCode === "ONE_TIME")?.price ?? 2500;

  return (
    <>
      <PageHeader />
      <section className="mx-auto mt-8 mb-16 flex w-full flex-row gap-4">
        {plans.map((plan) => (
          <CreditCard
            key={plan.planCode}
            creditCount={plan.creditAmount}
            price={plan.price.toLocaleString()}
            planCode={plan.planCode}
            discountRate={calcDiscountRate(plan, basePricePerUnit)}
            discountLabel={
              calcDiscountRate(plan, basePricePerUnit) ? "할인" : ""
            }
          />
        ))}
      </section>
      <div className="min-w-265">
        <Useage />
      </div>
    </>
  );
}

export default function CreditPage() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F5F6F9]">
      <Lnb className="z-50 shrink-0" />
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <main className="mx-auto w-full max-w-[1320px] min-w-[1060px] px-18 pt-12 pb-60">
          <Suspense fallback={<div>로딩 중...</div>}>
            <CreditContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
