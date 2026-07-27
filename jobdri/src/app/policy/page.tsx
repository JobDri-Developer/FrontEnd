"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Lnb from "@/components/common/lnb/Lnb";
import { TERMS_TEXT, PRIVACY_TEXT } from "@/constants/policy";

function PolicyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "privacy" ? "privacy" : "terms"; // 기본값은 terms

  const handleTabClick = (tab: "terms" | "privacy") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="flex-1 w-full max-w-[800px] px-8 pt-16 pb-32 mx-auto">
      <h1 className="text-3xl font-bold text-text-neutral-title mb-10">
        서비스 정책
      </h1>

      <div className="flex gap-6 mb-8 border-b border-gray-200">
        <button
          className={`pb-3 px-2 text-[18px] font-medium border-b-2 transition-colors ${
            activeTab === "terms"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => handleTabClick("terms")}
        >
          이용약관
        </button>
        <button
          className={`pb-3 px-2 text-[18px] font-medium border-b-2 transition-colors ${
            activeTab === "privacy"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => handleTabClick("privacy")}
        >
          개인정보 처리방침
        </button>
      </div>

      <div className="bg-white rounded-card shadow-sm p-8 min-h-[600px]">
        <div
          className="text-gray-700 whitespace-pre-wrap leading-[1.8] text-[15px]"
          dangerouslySetInnerHTML={{
            __html: activeTab === "terms" ? TERMS_TEXT : PRIVACY_TEXT,
          }}
        />
      </div>
    </main>
  );
}

export default function PolicyPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F5F6F9]">
      <Lnb />
      <Suspense
        fallback={
          <div className="flex-1 w-full pt-16 text-center">로딩 중...</div>
        }
      >
        <PolicyContent />
      </Suspense>
    </div>
  );
}
