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
import { Lnb } from "@/components/common/lnb";
import Header from "@/components/common/header/Header";
import PageHeader from "@/components/common/PageHeader";

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
    <div className="flex min-h-screen w-full bg-[#F5F6F9] overflow-x-hidden ">
      <Lnb />
      <main className="flex-1 w-full max-w-[1320px] min-w-[1060px] px-18 pt-12 pb-60 mx-auto">
        <PageHeader />
        <section className="flex flex-row gap-4 w-full mt-8 mb-16 mx-auto">
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
      </main>
    </div>
  );
}
