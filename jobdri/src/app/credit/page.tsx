"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard } from "@/components/common/cards";
import Useage from "@/components/common/credit/Useage";
import {
  fetchCreditPlans,
  confirmPurchase,
  type CreditPlan,
} from "@/lib/api/credit";
import Lnb from "@/components/common/lnb/Lnb";
import PageHeader from "@/components/common/PageHeader";
import { BusinessFooter } from "@/components/common/footer";

function calcDiscountRate(plan: CreditPlan, basePricePerUnit: number): string {
  const original = basePricePerUnit * plan.creditAmount;
  if (original <= plan.price) return "";
  const rate = Math.round(((original - plan.price) / original) * 100);
  return `${rate}%`;
}

function CreditContent() {
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const [isConfirming, setIsConfirming] = useState(false); // 승인 중 로딩 상태 추가
  const searchParams = useSearchParams();
  const router = useRouter(); // 라우터 훅 추가

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
      const processConfirm = async () => {
        setIsConfirming(true); // 화면 잠금

        try {
          await confirmPurchase(paymentKey, orderId, Number(amount));
          window.history.replaceState(null, "", window.location.pathname);
          setIsConfirming(false);
          setTimeout(() => {
            alert("크레딧 충전이 완료되었습니다!");
            window.location.reload();
          }, 100);
        } catch (error) {
          console.error("결제 승인 실패:", error);
          setIsConfirming(false);
          alert("결제 승인에 실패했습니다. 다시 시도해 주세요.");
          // 실패 시에도 쿼리 파라미터를 날려 중복 요청 방지
          window.history.replaceState(null, "", window.location.pathname);
        }
      };

      processConfirm();
    }
  }, [searchParams]);

  const basePricePerUnit =
    plans.find((p) => p.planCode === "ONE_TIME")?.price ?? 2500;

  return (
    <>
      <PageHeader />

      {/* 결제 승인 중일 때 화면을 덮는 로딩 UI */}
      {isConfirming && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-white text-h24-bold animate-pulse">
            결제를 안전하게 승인하고 있습니다...
          </div>
        </div>
      )}
      <section className="mx-auto mt-8 mb-16 flex w-full flex-row gap-4">
        {plans.map((plan) => (
          <CreditCard
            key={plan.planCode}
            creditCount={plan.creditAmount}
            price={plan.price.toLocaleString()}
            planCode={plan.planCode}
            discountRate={calcDiscountRate(plan, basePricePerUnit)}
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
        <BusinessFooter />
      </div>
    </div>
  );
}
