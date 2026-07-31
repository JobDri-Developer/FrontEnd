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
import ModalNotice from "../modal/ModalNotice";
import { Toast, type ToastVariant } from "@/components/common/toast";
import {
  AUTH_STORAGE_KEYS,
  clearAuthTokens,
  getStoredAuthEmail,
  requestLogout,
} from "@/lib/auth";
import { fetchCreditBalance } from "@/lib/api/credit";
import {
  fetchMyMockApplies,
  MOCK_APPLY_CHANGED_EVENT,
  MOCK_APPLY_DELETED_EVENT,
} from "@/lib/api/mockApplies";
import { getResumePath } from "@/components/mockApply/home/applicationHomeUtils";
import {
  fetchNotifications,
  type LnbNotificationItem,
} from "@/lib/api/notification";
import LnbDefault from "./LnbDefault";
import LnbFolded from "./LnbFolded";
import { mapApiToLnbItem } from "./LnbNotification";
import {
  type LnbItemKey,
  type LnbRecentItem,
  type LnbNavItem,
} from "./LnbShared";
import { useCreditStore } from "@/lib/store/useCreditStore";

// 알림 폴링 주기 (15초)
const NOTIFICATION_POLL_INTERVAL_MS = 15_000;

interface LnbProps {
  initialActiveItem?: LnbItemKey;
  email?: string;
  className?: string;
  notificationItems?: LnbNotificationItem[];
  defaultRecentOpen?: boolean;
  hasNotification?: boolean;
  disableCreditFetch?: boolean;
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

  const storedEmail = useSyncExternalStore(
    subscribeToStoredEmail,
    getStoredEmailSnapshot,
    getServerStoredEmailSnapshot,
  );

  const displayEmail = email ?? storedEmail;
  const emailInitial = getEmailInitial(displayEmail);

  // States
  const { creditCount, setCreditCount } = useCreditStore();
  const [isFold, setIsFold] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [activeItem, setActiveItem] = useState<LnbItemKey | undefined>(
    initialActiveItem,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecentOpen, setIsRecentOpen] = useState(defaultRecentOpen);

  const [recentItems, setRecentItems] = useState<LnbRecentItem[]>([]);
  const [selectedRecentItemId, setSelectedRecentItemId] = useState<string>("");

  const [notificationItems, setNotificationItems] = useState<
    LnbNotificationItem[]
  >([]);
  const [hasNotification, setHasNotification] = useState(false);

  // 🌟 토스트 상태 부활
  const [toastState, setToastState] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);

  // 🌟 중복 알림 원천 차단용 Refs
  const seenAnalysisIdsRef = useRef<Set<string>>(new Set());
  const seenToastIdsRef = useRef<Set<string>>(new Set());
  const isFirstNotificationLoadRef = useRef(true);

  const loadRecentItems = useCallback(async () => {
    try {
      const data = await fetchMyMockApplies({
        redirectOnUnauthorized: false,
      });
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

      const mappedItems: LnbRecentItem[] = allItems.map(
        ({ item, isCompleted }) => ({
          id: String(item.mockApplyId),
          companyName: item.companyName,
          jobTitle:
            item.jobTitle || item.detailClassificationName || "직무 미지정",
          version: item.sequence ?? 1,
          href: isCompleted
            ? `/mockApply/${item.mockApplyId}/result?jobPostingId=${item.jobPostingId}&sequence=${item.sequence ?? 1}`
            : getResumePath(item),
        }),
      );

      setRecentItems(mappedItems);
      setSelectedRecentItemId((current) =>
        mappedItems.some((item) => item.id === current)
          ? current
          : (mappedItems[0]?.id ?? ""),
      );
    } catch (error) {
      console.error("최근 모의지원 목록 로드 실패:", error);
      setRecentItems([]);
      setSelectedRecentItemId("");
    }
  }, []);

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void loadRecentItems();
    }, 0);
    return () => window.clearTimeout(initialLoadTimer);
  }, [loadRecentItems]);

  useEffect(() => {
    const refreshRecentItems = () => {
      void loadRecentItems();
    };
    window.addEventListener(MOCK_APPLY_CHANGED_EVENT, refreshRecentItems);
    window.addEventListener("focus", refreshRecentItems);

    return () => {
      window.removeEventListener(MOCK_APPLY_CHANGED_EVENT, refreshRecentItems);
      window.removeEventListener("focus", refreshRecentItems);
    };
  }, [loadRecentItems]);

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

  const fetchAndUpdateNotifications = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      if (!data.isSuccess || !data.result) return;

      const mappedItems = data.result.map(mapApiToLnbItem);

      if (isFirstNotificationLoadRef.current) {
        mappedItems.forEach((item) => {
          if (item.id) seenToastIdsRef.current.add(String(item.id));
        });
        isFirstNotificationLoadRef.current = false;
      } else {
        const newUnreadItems = mappedItems.filter(
          (item) =>
            item.id &&
            !seenToastIdsRef.current.has(String(item.id)) &&
            !item.read,
        );

        if (newUnreadItems.length > 0) {
          triggerToast(newUnreadItems[0]);
        }

        mappedItems.forEach((item) => {
          if (item.id) seenToastIdsRef.current.add(String(item.id));
        });
      }

      setNotificationItems(mappedItems);
      setHasNotification(mappedItems.some((item) => !item.read));

      // 리스트 갱신 로직 (분석 완료 시)
      const analysisIds = mappedItems
        .filter((item) => item.apiType?.includes("ANALYSIS"))
        .map((item) => String(item.id));

      const hasNewAnalysis = analysisIds.some(
        (id) => !seenAnalysisIdsRef.current.has(id),
      );
      seenAnalysisIdsRef.current = new Set(analysisIds);

      if (hasNewAnalysis) {
        void loadRecentItems();
      }
    } catch (error) {
      console.error("알림 목록 갱신 실패:", error);
    }
  }, [loadRecentItems, triggerToast]);

  useEffect(() => {
    void fetchAndUpdateNotifications();

    const intervalId = window.setInterval(() => {
      void fetchAndUpdateNotifications();
    }, NOTIFICATION_POLL_INTERVAL_MS);

    const handleFocus = () => {
      void fetchAndUpdateNotifications();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchAndUpdateNotifications]);

  // Credit Fetch
  useEffect(() => {
    if (disableCreditFetch) return;
    fetchCreditBalance({ redirectOnUnauthorized: false })
      .then(setCreditCount)
      .catch(() => {});
  }, [disableCreditFetch, setCreditCount]);

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
    router.replace("/login");
  };

  const handleReadItem = (id: string) => {
    setNotificationItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      );
      setHasNotification(updated.some((item) => !item.read));
      return updated;
    });
  };

  const handleMarkAllRead = () => {
    setNotificationItems((prev) =>
      prev.map((item) => ({ ...item, read: true })),
    );
    setHasNotification(false);
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
              setSelectedRecentItemId(item.id);
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-lightbox-default">
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
          </div>,
          document.body,
        )}

      {/* 🌟 렌더링에서 빠져있던 토스트 컴포넌트 부활! */}
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
