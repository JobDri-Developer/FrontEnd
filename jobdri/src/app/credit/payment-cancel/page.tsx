"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

function PaymentCancelContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/credit?cancel=true`);
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F5F6F9]">
      <div className="text-h24-bold text-text-neutral-title animate-pulse">
        결제를 취소하고 있습니다...
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#F5F6F9]">
          로딩 중...
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
