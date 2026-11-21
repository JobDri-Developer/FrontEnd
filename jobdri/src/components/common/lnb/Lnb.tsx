"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ModalNotice from "@/components/common/modal/ModalNotice";
import { ModalOverlay } from "@/components/common/modal/ModalOverlay";
import Toast from "@/components/common/toast/Toast";
import type { ToastVariant } from "@/components/common/toast/Toast";
import {
  AUTH_STORAGE_KEYS,
  clearAuthTokens,
  getStoredAuthEmail,
  requestLogout,
} from "@/lib/auth";
import { getResumePath } from "@/components/home/applicationHomeUtils";
import type {
  ApiNotificationItem,
  LnbNotificationItem,
} from "@/lib/api/notification";
import {
  creditBalanceQueryOptions,
  myMockAppliesQueryOptions,
  notificationsQueryOptions,
  queryKeys,
  type MyMockApplies,
} from "@/lib/queries";
import LnbDefault from "./LnbDefault";
import LnbFolded from "./LnbFolded";
import { mapApiToLnbItem } from "./LnbNotification";
import {
  type LnbItemKey,
  type LnbRecentItem,
  type LnbNavItem,
} from "./LnbShared";

interface LnbProps {
  initialActiveItem?: LnbItemKey | null;
  email?: string;
  className?: string;
  notificationItems?: LnbNotificationItem[];
  defaultRecentOpen?: boolean;
  hasNotification?: boolean;
  disableCreditFetch?: boolean;
}

const EMPTY_RECENT_ITEMS: LnbRecentItem[] = [];
const EMPTY_NOTIFICATION_ITEMS: LnbNotificationItem[] = [];

function selectRecentItems(data: MyMockApplies): LnbRecentItem[] {
  const allItems = [
    ...data.inProgress.map((item) => ({ item, isCompleted: false })),
    ...data.completed.content.map((item) => ({
      item,
      isCompleted: true,
    })),
  ].sort((a, b) => {
    const aTime = new Date(a.item.createdAt).getTime();
    const bTime = new Date(b.item.createdAt).getTime();

    if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
      return b.item.mockApplyId - a.item.mockApplyId;
    }
    return bTime - aTime;
  });

  return allItems.map(({ item, isCompleted }) => ({
    id: String(item.mockApplyId),
    companyName: item.companyName,
    jobTitle: item.jobTitle || item.detailClassificationName || "직무 미지정",
    version: item.sequence ?? 1,
    href: isCompleted
      ? `/mockApply/${item.mockApplyId}/result?jobPostingId=${item.jobPostingId}&sequence=${item.sequence ?? 1}`
      : getResumePath(item),
  }));
}

function selectNotificationItems(
  items: ApiNotificationItem[],
): LnbNotificationItem[] {
  return items.map(mapApiToLnbItem);
}

function subscribeToStoredEmail(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEYS.userEmail) {
      onStoreChange();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function getStoredEmailSnapshot() {
  return getStoredAuthEmail() ?? "";
}

function getServerStoredEmailSnapshot() {
  return "";
}

function getEmailInitial(email: string) {
  return email.trim().charAt(0).toUpperCase() || "J";
}

export default function Lnb({
  initialActiveItem = "apply",
  email,
  className,
  defaultRecentOpen = false,
  disableCreditFetch = false,
}: LnbProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const storedEmail = useSyncExternalStore(
    subscribeToStoredEmail,
    getStoredEmailSnapshot,
    getServerStoredEmailSnapshot,
  );

  const displayEmail = email ?? storedEmail;
  const emailInitial = getEmailInitial(displayEmail);

  // Queries
  // 홈과 같은 쿼리 키를 써서, 홈에서는 모의지원 목록 요청이 한 번만 나간다.
  const { data: recentItems = EMPTY_RECENT_ITEMS } = useQuery({
    ...myMockAppliesQueryOptions(),
    select: selectRecentItems,
  });
  const { data: notificationItems = EMPTY_NOTIFICATION_ITEMS, isSuccess } =
    useQuery({
      ...notificationsQueryOptions(),
      select: selectNotificationItems,
    });
  const { data: creditCount = 0 } = useQuery({
    ...creditBalanceQueryOptions(),
    enabled: !disableCreditFetch,
  });

  // States
  const [isFold, setIsFold] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [activeItem, setActiveItem] = useState<LnbItemKey | undefined>(
    initialActiveItem ?? undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecentOpen, setIsRecentOpen] = useState(defaultRecentOpen);
  const [pickedRecentItemId, setPickedRecentItemId] = useState<string>("");

  // 고른 항목이 목록에서 사라지면 가장 최근 항목을 선택한다.
  const selectedRecentItemId = recentItems.some(
    (item) => item.id === pickedRecentItemId,
  )
    ? pickedRecentItemId
    : (recentItems[0]?.id ?? "");

  const hasNotification = notificationItems.some((item) => !item.read);

  // 🌟 토스트 상태 부활
  const [toastState, setToastState] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);

  // 🌟 중복 알림 원천 차단용 Refs
  const seenAnalysisIdsRef = useRef<Set<string>>(new Set());
  const seenToastIdsRef = useRef<Set<string>>(new Set());
  const isFirstNotificationLoadRef = useRef(true);

  // 🌟 토스트 띄우는 함수 (순수하게 메시지만 세팅함)
  const triggerToast = useCallback((item: LnbNotificationItem) => {
    let toastMessage = item.title || "새로운 알림이 도착했습니다.";
    let toastVariant: ToastVariant = "check";

    const isJobPostingSuccess =
      item.apiType === "JOB_POSTING_ANALYSIS_SUCCESS" ||
      item.title?.includes("공고 분석 완료");
    const isJobPostingFailed =
      item.apiType === "JOB_POSTING_ANALYSIS_FAILED" ||
      item.title?.includes("공고 분석 실패");

    const isResumeAnalysisSuccess =
      item.apiType === "MOCK_APPLY_ANALYSIS_SUCCESS" ||
      item.title?.includes("자소서 분석 완료");
    const isResumeAnalysisFailed =
      item.apiType === "MOCK_APPLY_ANALYSIS_FAILED" ||
      item.title?.includes("자소서 분석 실패");

    if (isJobPostingSuccess) {
      toastMessage = "공고 분석이 완료되었습니다!";
    } else if (isJobPostingFailed) {
      toastMessage = "공고 분석에 실패했습니다. 다시 시도해주세요.";
      toastVariant = "warning";
    } else if (isResumeAnalysisSuccess) {
      toastMessage = "자소서 분석이 완료되었습니다!";
    } else if (isResumeAnalysisFailed) {
      toastMessage = "자소서 분석에 실패했습니다. 다시 시도해주세요.";
      toastVariant = "warning";
    } else if (item.type === "fail") {
      toastVariant = "warning";
    }

    setToastState({ message: toastMessage, variant: toastVariant });
    window.setTimeout(() => setToastState(null), 3000);
  }, []);

  // 새 알림이 오면 토스트를 띄우고, 분석 완료 알림이면 모의지원 목록을 갱신한다.
  useEffect(() => {
    if (!isSuccess) return;

    const analysisIds = notificationItems
      .filter((item) => item.apiType?.includes("ANALYSIS"))
      .map((item) => String(item.id));

    if (isFirstNotificationLoadRef.current) {
      // 처음 받은 알림은 이미 본 것으로 간주한다.
      notificationItems.forEach((item) => {
        if (item.id) seenToastIdsRef.current.add(String(item.id));
      });
      seenAnalysisIdsRef.current = new Set(analysisIds);
      isFirstNotificationLoadRef.current = false;
      return;
    }

    const newUnreadItems = notificationItems.filter(
      (item) =>
        item.id && !seenToastIdsRef.current.has(String(item.id)) && !item.read,
    );

    if (newUnreadItems.length > 0) {
      triggerToast(newUnreadItems[0]);
    }

    notificationItems.forEach((item) => {
      if (item.id) seenToastIdsRef.current.add(String(item.id));
    });

    const hasNewAnalysis = analysisIds.some(
      (id) => !seenAnalysisIdsRef.current.has(id),
    );
    seenAnalysisIdsRef.current = new Set(analysisIds);

    if (hasNewAnalysis) {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.myMockApplies,
      });
    }
  }, [isSuccess, notificationItems, queryClient, triggerToast]);

  // Handlers
  const handleToggleFold = () => setIsFold((prev) => !prev);

  const handleNavItemClick = (item: LnbNavItem) => {
    if (item.href) {
      setActiveItem(item.key);
      router.push(item.href);
    } else {
      setShowComingSoonModal(true);
    }
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
    const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);

    if (accessToken && refreshToken) {
      try {
        await requestLogout(accessToken, refreshToken);
      } catch (error) {
        console.error("로그아웃 처리 실패:", error);
      }
    }
    clearAuthTokens();
    // 다른 계정으로 로그인했을 때 이전 사용자의 데이터가 보이지 않게 한다.
    queryClient.clear();
    router.replace("/login");
  };

  // 읽음 처리를 캐시에 반영해, 다른 페이지로 이동해도 읽음 상태가 유지되게 한다.
  const updateNotificationCache = (
    updater: (item: ApiNotificationItem) => ApiNotificationItem,
  ) => {
    void queryClient.cancelQueries({ queryKey: queryKeys.notifications });
    queryClient.setQueryData<ApiNotificationItem[]>(
      queryKeys.notifications,
      (current) => current?.map(updater),
    );
  };

  const handleReadItem = (id: string) => {
    updateNotificationCache((item) =>
      String(item.id) === id ? { ...item, isRead: true } : item,
    );
  };

  const handleMarkAllRead = () => {
    updateNotificationCache((item) => ({ ...item, isRead: true }));
  };

  return (
    <>
      <aside
        className={clsx(
          "sticky top-0 z-40 flex h-dvh max-h-dvh min-h-0 shrink-0 flex-col justify-between border-r border-line-neutral-default bg-bg-contents-default transition-[width] duration-300 ease-in-out",
          isFold ? "w-[52px] items-center" : "w-[280px]",
          className,
        )}
      >
        {isFold ? (
          <LnbFolded
            activeItem={activeItem}
            emailInitial={emailInitial}
            hasNotification={hasNotification}
            notificationItems={notificationItems}
            searchQuery={searchQuery}
            onActivateSearch={() => setIsFold(false)}
            onCreditClick={() => router.push("/credit")}
            onLogout={handleLogout}
            onNavItemClick={handleNavItemClick}
            onMarkAllRead={handleMarkAllRead}
            onReadItem={handleReadItem}
            onSearchQueryChange={setSearchQuery}
            onToggleFold={handleToggleFold}
          />
        ) : (
          <LnbDefault
            activeItem={activeItem}
            creditCount={creditCount}
            email={displayEmail}
            emailInitial={emailInitial}
            hasNotification={hasNotification}
            notificationItems={notificationItems}
            isRecentOpen={isRecentOpen}
            recentItems={recentItems}
            searchQuery={searchQuery}
            selectedRecentItemId={selectedRecentItemId}
            onLogout={handleLogout}
            onNavItemClick={handleNavItemClick}
            onRecentItemClick={(item) => {
              setPickedRecentItemId(item.id);
              if (item.href) {
                router.push(item.href);
              }
            }}
            onSearchQueryChange={(searchQuerySetter) =>
              setSearchQuery(searchQuerySetter)
            }
            onToggleFold={handleToggleFold}
            onToggleRecentOpen={() => setIsRecentOpen((prev) => !prev)}
            onMarkAllRead={handleMarkAllRead}
            onReadItem={handleReadItem}
          />
        )}
      </aside>

      {showComingSoonModal &&
        createPortal(
          <ModalOverlay>
            <ModalNotice
              type="alertModal"
              title="아직 준비중인 서비스입니다"
              description={
                "더 나은 서비스를 위해 노력하고 있습니다!\n조금만 기다려 주세요"
              }
              onClose={() => setShowComingSoonModal(false)}
              primaryAction={{
                label: "확인",
                onClick: () => setShowComingSoonModal(false),
              }}
            />
          </ModalOverlay>,
          document.body,
        )}

      {toastState && (
        <Toast
          message={toastState.message}
          variant={toastState.variant}
          position="top"
        />
      )}
    </>
  );
}
