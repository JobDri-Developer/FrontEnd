"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderNo =
      searchParams.get("orderNo") ||
      searchParams.get("paymentId") ||
      searchParams.get("orderId");

    if (orderNo) {
      router.replace(`/credit?orderId=${orderNo}`);
    } else {
      router.replace(`/credit?cancel=true`);
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F5F6F9]">
      <div className="text-h24-bold text-text-neutral-title animate-pulse">
        결제 결과를 처리하고 있습니다...
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#F5F6F9]">
          로딩 중...
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
