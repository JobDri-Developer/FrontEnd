"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
import { fetchMyMockApplies } from "@/lib/api/mockApplies";
import LnbDefault from "./LnbDefault";
import LnbFolded from "./LnbFolded";
import {
  defaultNotificationItems,
  type LnbNotificationItem,
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
  notificationItems = defaultNotificationItems,
  defaultRecentOpen = true,
  hasNotification = true,
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

  // API Data States
  const [recentItems, setRecentItems] = useState<LnbRecentItem[]>([]);
  const [selectedRecentItemId, setSelectedRecentItemId] = useState<string>("");

  // Fetch API Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMyMockApplies();
        const allItems = [...data.inProgress, ...data.completed];

        const mappedItems: LnbRecentItem[] = allItems.map((item) => ({
          id: String(item.mockApplyId),
          companyName: item.companyName,
          jobTitle:
            item.jobTitle || item.detailClassificationName || "직무 미지정",
          version: item.version ?? 1,
        }));

        setRecentItems(mappedItems);
        if (mappedItems.length > 0) {
          setSelectedRecentItemId(mappedItems[0].id);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setRecentItems([]);
      }
    };

    loadData();
  }, []);

  // Credit Fetch
  useEffect(() => {
    if (disableCreditFetch) return;
    fetchCreditBalance()
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

  return (
    <>
      <aside
        className={clsx(
          "sticky top-0 flex h-screen min-h-[800px] shrink-0 flex-col justify-between border-r border-line-neutral-default bg-bg-contents-default transition-[width] duration-300 ease-in-out",
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
            isRecentOpen={isRecentOpen}
            notificationItems={notificationItems}
            recentItems={recentItems}
            searchQuery={searchQuery}
            selectedRecentItemId={selectedRecentItemId}
            onLogout={handleLogout}
            onNavItemClick={handleNavItemClick}
            onRecentItemClick={(item) => setSelectedRecentItemId(item.id)}
            onSearchQueryChange={setSearchQuery}
            onToggleFold={handleToggleFold}
            onToggleRecentOpen={() => setIsRecentOpen((prev) => !prev)}
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
    </>
  );
}
