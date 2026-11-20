import { queryOptions } from "@tanstack/react-query";
import {
  fetchCreditBalance,
  fetchCreditPlans,
  fetchCreditTransactions,
} from "@/lib/api/credit";
import { fetchMyJobPosting, fetchMyJobPostings } from "@/lib/api/jobPostings";
import {
  fetchMockApplyJobPosting,
  fetchMyMockApplies,
} from "@/lib/api/mockApplies";
import { fetchNotifications } from "@/lib/api/notification";
import { fetchSequence } from "@/lib/api/result";

// 알림 폴링 주기 (15초)
export const NOTIFICATION_POLL_INTERVAL_MS = 15_000;

/*
 * 여러 화면에서 같은 데이터를 쓰는 쿼리는 키를 공유해야 요청이 한 번으로 합쳐진다.
 * 예: 홈과 LNB가 모두 내 모의지원 목록을 쓰지만, 같은 키라서 요청은 한 번만 나간다.
 */
export const queryKeys = {
  // 모의지원 관련 쿼리 전체. 생성·재시도·삭제 시 이 키로 한 번에 무효화한다.
  allMockApplies: ["mockApplies"] as const,
  myMockApplies: ["mockApplies", "me"] as const,
  mockApplySequence: (mockApplyId: number) =>
    ["mockApplies", mockApplyId, "sequence"] as const,
  mockApplyJobPosting: (mockApplyId: number) =>
    ["mockApplies", mockApplyId, "jobPosting"] as const,
  myJobPostings: ["jobPostings", "me"] as const,
  jobPostingDetail: (jobPostingId: number) =>
    ["jobPostings", jobPostingId] as const,
  notifications: ["notifications"] as const,
  creditBalance: ["credit", "balance"] as const,
  creditTransactions: ["credit", "transactions"] as const,
  creditPlans: ["credit", "plans"] as const,
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

// 공고 상세. 홈에서 카드를 누를 때 받은 값을 검토 페이지가 그대로 쓴다.
// 검토 페이지에서 저장하면 저장 결과로 캐시를 갱신한다.
export const jobPostingDetailQueryOptions = (jobPostingId: number) =>
  queryOptions({
    queryKey: queryKeys.jobPostingDetail(jobPostingId),
    queryFn: () => fetchMyJobPosting(jobPostingId),
  });

// 몇 번째 지원인지. 템플릿 헤더와 결과 페이지가 함께 쓴다.
export const mockApplySequenceQueryOptions = (mockApplyId: number) =>
  queryOptions({
    queryKey: queryKeys.mockApplySequence(mockApplyId),
    queryFn: () => fetchSequence(mockApplyId),
    enabled: mockApplyId > 0,
  });

// 모의지원에 연결된 공고. 지원 중에는 바뀌지 않아 오래 재사용한다.
export const mockApplyJobPostingQueryOptions = (mockApplyId: number) =>
  queryOptions({
    queryKey: queryKeys.mockApplyJobPosting(mockApplyId),
    queryFn: () => fetchMockApplyJobPosting(mockApplyId),
    enabled: mockApplyId > 0,
    staleTime: 5 * 60 * 1000,
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

// 크레딧 사용·충전·쿠폰 등록으로 바뀌므로 잔액처럼 다시 마운트될 때마다 갱신한다.
export const creditTransactionsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.creditTransactions,
    queryFn: () => fetchCreditTransactions(),
    staleTime: 0,
  });

// 요금제는 거의 바뀌지 않아 한 번 받으면 오래 재사용한다.
export const creditPlansQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.creditPlans,
    queryFn: fetchCreditPlans,
    staleTime: 30 * 60 * 1000,
  });
