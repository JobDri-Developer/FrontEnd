"use client";

import { useEffect, useState, useSyncExternalStore, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ModalNotice } from "@/components/common/modal";
import { Toast, type ToastVariant } from "@/components/common/toast";
import {
  AUTH_STORAGE_KEYS,
  clearAuthTokens,
  getStoredAuthEmail,
  requestLogout,
} from "@/lib/auth";
import { fetchCreditBalance } from "@/lib/api/credit";
import { fetchMyMockApplies } from "@/lib/api/mockApplies";
import {
  NotificationResponse,
  fetchNotifications,
  subscribeToNotificationStream,
  LnbNotificationItem,
} from "@/lib/api/notification";
import LnbDefault from "./LnbDefault";
import LnbFolded from "./LnbFolded";
import { mapApiToLnbItem } from "./LnbNotification";
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

  const [toastState, setToastState] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);

  // 중복 구독 방지용 락 Ref 추가
  const hasSubscribedRef = useRef(false);

  useEffect(() => {
    if (hasSubscribedRef.current) return;
    hasSubscribedRef.current = true;

    const fetchAndUpdateNotifications = async () => {
      try {
        const data = await fetchNotifications();
        if (data.isSuccess && data.result) {
          const mappedItems = data.result.map(mapApiToLnbItem);

          setNotificationItems((prevItems) => {
            if (prevItems.length > 0 && mappedItems.length > 0) {
              const latestNewItem = mappedItems[0];
              const prevLatestItem = prevItems[0];

              if (
                latestNewItem.id !== prevLatestItem.id &&
                !latestNewItem.read
              ) {
                triggerToastBasedOnNotification(latestNewItem);
              }
            }
            return mappedItems;
          });

          setHasNotification(mappedItems.some((item) => !item.read));
        }
      } catch (error) {
        console.error("알림 목록 갱신 실패:", error);
      }
    };

    const triggerToastBasedOnNotification = (item: LnbNotificationItem) => {
      let toastMessage = item.title || "새로운 알림이 도착했습니다.";
      let toastVariant: ToastVariant = "check";

      switch (item.apiType) {
        case "JOB_POSTING_ASYNC_SUCCEEDED":
          toastMessage = "공고 분석이 완료되었습니다!";
          toastVariant = "check";
          break;
        case "JOB_POSTING_ASYNC_FAILED":
          toastMessage = "공고 분석에 실패했습니다. 다시 시도해주세요.";
          toastVariant = "warning";
          break;
        case "ANALYSIS_ASYNC_SUCCEEDED":
          toastMessage = "자소서 분석이 완료되었습니다!";
          toastVariant = "check";
          break;
        case "ANALYSIS_ASYNC_FAILED":
          toastMessage = "자소서 분석에 실패했습니다. 다시 시도해주세요.";
          toastVariant = "warning";
          break;
        default:
          if (item.type === "fail") {
            toastVariant = "warning";
          }
          break;
      }

      setToastState({ message: toastMessage, variant: toastVariant });
      setTimeout(() => setToastState(null), 3000);
    };

    fetchAndUpdateNotifications();

    const unsubscribe = subscribeToNotificationStream(
      (newNotification) => {
        // console.log("🔥 [SSE 수신 완료] 서버에서 알림 옴!!!", newNotification);
        setTimeout(() => {
          fetchAndUpdateNotifications();
        }, 500);
      },
      (error) => {
        console.error("실시간 알림 연결 문제 발생:", error);
      },
    );

    return () => {
      unsubscribe();
      hasSubscribedRef.current = false; // 언마운트 시 초기화
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
          "sticky top-0 flex h-screen min-h-[800px] shrink-0 flex-col justify-between border-r border-line-neutral-default bg-bg-contents-default transition-[width] duration-300 ease-in-out z-40",
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
            onNavItemClick={handleNavItemClick}
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
            onRecentItemClick={(item) => setSelectedRecentItemId(item.id)}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <ModalNotice
              title="아직 준비중인 서비스입니다"
              description="더 나은 서비스를 위해 노력하고 있습니다!\n조금만 기다려 주세요"
              onClose={() => setShowComingSoonModal(false)}
              primaryAction={{
                label: "확인",
                onClick: () => setShowComingSoonModal(false),
              }}
            />
          </div>,
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
