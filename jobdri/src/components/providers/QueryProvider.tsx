"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MOCK_APPLY_CHANGED_EVENT } from "@/lib/api/mockApplies";
import { queryKeys } from "@/lib/queries";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 자주 바뀌는 데이터는 쿼리별로 staleTime을 더 짧게 지정한다.
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  // 모의지원 생성·재시도·삭제 시 발생하는 이벤트로 관련 캐시를 갱신한다.
  useEffect(() => {
    const invalidateMockApplyQueries = () => {
      // 목록뿐 아니라 회차 정보(재도전 시 전체 회차 수가 바뀜)도 함께 갱신한다.
      void queryClient.invalidateQueries({
        queryKey: queryKeys.allMockApplies,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.myJobPostings,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.creditBalance,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.creditTransactions,
      });
    };

    window.addEventListener(
      MOCK_APPLY_CHANGED_EVENT,
      invalidateMockApplyQueries,
    );
    return () =>
      window.removeEventListener(
        MOCK_APPLY_CHANGED_EVENT,
        invalidateMockApplyQueries,
      );
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
