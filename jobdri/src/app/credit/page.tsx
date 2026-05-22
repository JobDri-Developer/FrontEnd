"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard } from "@/components/common/cards";
import Useage from "@/components/common/credit/Useage";
import {
  fetchCreditPlans,
  confirmPurchase,
  type CreditPlan,
} from "@/lib/api/credit";

function calcDiscountRate(plan: CreditPlan, basePricePerUnit: number): string {
  const original = basePricePerUnit * plan.creditAmount;
  if (original <= plan.price) return "";
  const rate = Math.round(((original - plan.price) / original) * 100);
  return `${rate}%`;
}

export default function CreditPage() {
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
    <div className="flex flex-col">
      <section className="flex flex-row gap-4 w-full mt-8 mb-16">
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
      <Useage />
    </div>
  );
}
