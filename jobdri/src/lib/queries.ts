import { queryOptions } from "@tanstack/react-query";
import { fetchCreditBalance } from "@/lib/api/credit";
import { fetchMyJobPostings } from "@/lib/api/jobPostings";
import { fetchMyMockApplies } from "@/lib/api/mockApplies";
import { fetchNotifications } from "@/lib/api/notification";

// 알림 폴링 주기 (15초)
export const NOTIFICATION_POLL_INTERVAL_MS = 15_000;

/*
 * 여러 화면에서 같은 데이터를 쓰는 쿼리는 키를 공유해야 요청이 한 번으로 합쳐진다.
 * 예: 홈과 LNB가 모두 내 모의지원 목록을 쓰지만, 같은 키라서 요청은 한 번만 나간다.
 */
export const queryKeys = {
  myMockApplies: ["mockApplies", "me"] as const,
  myJobPostings: ["jobPostings", "me"] as const,
  notifications: ["notifications"] as const,
  creditBalance: ["credit", "balance"] as const,
};

export type MyMockApplies = Awaited<ReturnType<typeof fetchMyMockApplies>>;
export type MyJobPostings = Awaited<ReturnType<typeof fetchMyJobPostings>>;

/*
 * 모의지원·공고 목록과 크레딧은 다른 화면에서 바뀔 수 있어 staleTime을 0으로 둔다.
 * 다시 마운트되면 캐시된 목록을 먼저 보여주고, 뒤에서 최신 값으로 갱신한다.
 */
export const myMockAppliesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.myMockApplies,
    queryFn: ({ signal }) =>
      fetchMyMockApplies({ signal, redirectOnUnauthorized: false }),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export const myJobPostingsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.myJobPostings,
    queryFn: () => fetchMyJobPostings({ redirectOnUnauthorized: false }),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export const notificationsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.notifications,
    queryFn: async () => {
      const data = await fetchNotifications();
      if (!data.isSuccess || !data.result) {
        throw new Error(data.message || "알림 목록을 불러오지 못했습니다.");
      }
      return data.result;
    },
    // 폴링 주기 안에서는 페이지를 이동해도 다시 요청하지 않는다.
    staleTime: NOTIFICATION_POLL_INTERVAL_MS,
    refetchInterval: NOTIFICATION_POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });

export const creditBalanceQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.creditBalance,
    queryFn: () => fetchCreditBalance({ redirectOnUnauthorized: false }),
    staleTime: 0,
  });
