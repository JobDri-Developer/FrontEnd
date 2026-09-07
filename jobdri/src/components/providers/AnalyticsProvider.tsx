"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { initAnalytics, syncAnalyticsUser } from "@/lib/analytics/client";
import { track } from "@/lib/analytics/track";

/**
 * Amplitude 초기화와 화면 조회 추적을 담당한다.
 *
 * useSearchParams가 아니라 usePathname만 쓴다. 루트 레이아웃의 클라이언트
 * 컴포넌트에서 useSearchParams를 호출하면 Next.js가 하위 트리 전체를
 * 클라이언트 렌더링으로 떨어뜨린다(Suspense 경계 요구). 페이지 경로만
 * 필요하므로 그 대가를 치를 이유가 없다.
 */
export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    // App Router의 클라이언트 내비게이션은 페이지를 새로 로드하지 않는다.
    // pathname 변화를 직접 구독해야 화면 전환이 집계된다.
    syncAnalyticsUser();
    track("page_viewed");
  }, [pathname]);

  return <>{children}</>;
}
