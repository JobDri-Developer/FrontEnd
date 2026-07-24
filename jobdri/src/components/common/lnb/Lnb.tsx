"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ModalNotice } from "@/components/common/modal";
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
  subscribeToNotificationStream,
  type LnbNotificationItem,
} from "@/lib/api/notification";
import LnbDefault from "./LnbDefault";
import LnbFolded from "./LnbFolded";
import {
  // defaultNotificationItems,
  mapApiToLnbItem,
} from "./LnbNotification";
import {
  type LnbItemKey,
  type LnbRecentItem,
  type LnbNavItem,
} from "./LnbShared";

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
  defaultRecentOpen = true,
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
  const [creditCount, setCreditCount] = useState<number>(0);
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

  // // Fetch 최근 항목
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const data = await fetchMyMockApplies();
  //       const allItems = [...data.inProgress, ...data.completed];

  //       const mappedItems: LnbRecentItem[] = allItems.map((item) => ({
  //         id: String(item.mockApplyId),
  //         companyName: item.companyName,
  //         jobTitle:
  //           item.jobTitle || item.detailClassificationName || "직무 미지정",
  //         version: item.version ?? 1,
  //       }));

  //       setRecentItems(mappedItems);
  //       if (mappedItems.length > 0) {
  //         setSelectedRecentItemId(mappedItems[0].id);
  //       }
  //     } catch (error) {
  //       console.error("데이터 로드 실패:", error);
  //       setRecentItems([]);
  //     }
  //   };

  //   loadData();
  // }, []);

  // useEffect(() => {
  //   const loadInitialNotifications = async () => {
  //     try {
  //       const res = await fetch("/api/notifications");
  //       const data = await res.json();

  //       if (data.isSuccess && data.result) {
  //         const mappedItems = data.result.map(mapApiToLnbItem);
  //         setNotificationItems(mappedItems);
  //         setHasNotification(
  //           mappedItems.some((item: LnbNotificationItem) => !item.read),
  //         );
  //       }
  //     } catch (error) {
  //       console.error("초기 알림 목록 로드 실패:", error);
  //     }
  //   };

  //   loadInitialNotifications();

  //   const eventSource = new EventSource("/api/notifications/stream");

  //   eventSource.onmessage = (event) => {
  //     try {
  //       const newNotification = JSON.parse(event.data);
  //       const mappedNewItem = mapApiToLnbItem(newNotification);
  //       setNotificationItems((prev) => [mappedNewItem, ...prev]);
  //       setHasNotification(true);
  //     } catch (error) {
  //       console.error("SSE 메시지 파싱 오류:", error, event.data);
  //     }
  //   };

  //   eventSource.onerror = (error) => {
  //     console.error("SSE 스트림 연결 에러:", error);
  //     eventSource.close(); // 필요시 재연결 로직 추가 가능
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  const loadRecentItems = useCallback(async () => {
    try {
      const data = await fetchMyMockApplies({
        redirectOnUnauthorized: false,
      });
      const allItems = [
        ...data.inProgress.map((item) => ({ item, isCompleted: false })),
        ...data.completed.map((item) => ({ item, isCompleted: true })),
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

  useEffect(() => {
    const loadInitialNotifications = async () => {
      try {
        const data = await fetchNotifications();
        if (data.isSuccess && data.result) {
          const mappedItems = data.result.map(mapApiToLnbItem);
          setNotificationItems(mappedItems);
          setHasNotification(mappedItems.some((item) => !item.read));
        }
      } catch (error) {
        console.error("초기 알림 목록 로드 실패:", error);
      }
    };

    void loadInitialNotifications();

    const unsubscribe = subscribeToNotificationStream(
      (newNotification) => {
        const mappedNewItem = mapApiToLnbItem(newNotification);
        setNotificationItems((prev) => [mappedNewItem, ...prev]);
        setHasNotification(true);

        if (newNotification.type.startsWith("ANALYSIS_ASYNC_")) {
          void loadRecentItems();
        }
      },
      // 에러가 났을 때
      (error) => {
        console.error("실시간 알림 연결 문제 발생:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [loadRecentItems]);

  useEffect(() => {
    const handleMockApplyDeleted = (event: Event) => {
      const mockApplyId = (event as CustomEvent<number>).detail;

      setRecentItems((current) =>
        current.filter((item) => item.id !== String(mockApplyId)),
      );
      setSelectedRecentItemId((current) =>
        current === String(mockApplyId) ? "" : current,
      );
    };

    window.addEventListener(
      MOCK_APPLY_DELETED_EVENT,
      handleMockApplyDeleted,
    );

    return () => {
      window.removeEventListener(
        MOCK_APPLY_DELETED_EVENT,
        handleMockApplyDeleted,
      );
    };
  }, []);

  // Credit Fetch
  useEffect(() => {
    if (disableCreditFetch) return;
    fetchCreditBalance({ redirectOnUnauthorized: false })
      .then(setCreditCount)
      .catch(() => {});
  }, [disableCreditFetch]);

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
          "sticky top-0 flex h-dvh max-h-dvh min-h-0 shrink-0 flex-col justify-between border-r border-line-neutral-default bg-bg-contents-default transition-[width] duration-300 ease-in-out",
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
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
            <ModalNotice
              variant="single"
              layout="centered"
              title="아직 준비중인 서비스입니다"
              description={[
                "더 나은 서비스를 위해 노력하고 있습니다!",
                "조금만 기다려 주세요",
              ].join("\n")}
              onClose={() => setShowComingSoonModal(false)}
              primaryAction={{
                label: "확인",
                onClick: () => setShowComingSoonModal(false),
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
