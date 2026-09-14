"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { initAnalytics, syncAnalyticsUser } from "@/lib/analytics/client";
import { track } from "@/lib/analytics/track";

/*
 * Amplitude 초기화와 화면 조회 추적을 담당한다.
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
