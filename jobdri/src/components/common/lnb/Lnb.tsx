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
import LnbDefault from "./LnbDefault";
import LnbFolded from "./LnbFolded";
import {
  defaultNotificationItems,
  type LnbNotificationItem,
} from "./LnbNotification";
import {
  defaultRecentItems,
  type LnbItemKey,
  type LnbNavItem,
  type LnbRecentItem,
} from "./LnbShared";

interface LnbProps {
  initialActiveItem?: LnbItemKey;
  email?: string;
  className?: string;
  recentItems?: LnbRecentItem[];
  notificationItems?: LnbNotificationItem[];
  defaultRecentOpen?: boolean;
  hasNotification?: boolean;
  disableCreditFetch?: boolean;
}

const defaultEmail = "jobdri@gmail.com";

function subscribeToStoredEmail(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEYS.userEmail) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
  };
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
  recentItems = defaultRecentItems,
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
  const displayEmail = (email ?? storedEmail) || defaultEmail;
  const emailInitial = getEmailInitial(displayEmail);
  const [creditCount, setCreditCount] = useState<number>(0);
  const [isFold, setIsFold] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [activeItem, setActiveItem] =
    useState<LnbItemKey | undefined>(initialActiveItem);
  const [selectedRecentItemId, setSelectedRecentItemId] = useState<string>(
    recentItems[1]?.id ?? recentItems[0]?.id ?? "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecentOpen, setIsRecentOpen] = useState(defaultRecentOpen);

  const handleToggleFold = () => {
    setIsFold((prevIsFold) => !prevIsFold);
  };

  const handleNavItemClick = (item: LnbNavItem) => {
    if (item.href) {
      setActiveItem(item.key);
      router.push(item.href);
      return;
    }

    setShowComingSoonModal(true);
  };

  const closeComingSoonModal = () => setShowComingSoonModal(false);

  const handleRecentItemClick = (item: LnbRecentItem) => {
    setSelectedRecentItemId(item.id);
  };

  useEffect(() => {
    if (disableCreditFetch) {
      return;
    }

    fetchCreditBalance()
      .then(setCreditCount)
      .catch(() => {});
  }, [disableCreditFetch]);

  const handleLogout = async () => {
    const accessToken = window.localStorage.getItem(
      AUTH_STORAGE_KEYS.accessToken,
    );
    const refreshToken = window.localStorage.getItem(
      AUTH_STORAGE_KEYS.refreshToken,
    );

    if (accessToken && refreshToken) {
      try {
        await requestLogout(accessToken, refreshToken);
      } catch (error) {
        console.error("서버 로그아웃 처리 실패:", error);
      }
    }

    clearAuthTokens();
    router.replace("/login");
  };

  return (
    <>
      <aside
        className={clsx(
          "flex h-screen min-h-[800px] shrink-0 flex-col justify-between border-r border-line-neutral-default bg-bg-contents-default transition-[width] duration-300 ease-in-out",
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
            onRecentItemClick={handleRecentItemClick}
            onSearchQueryChange={setSearchQuery}
            onToggleFold={handleToggleFold}
            onToggleRecentOpen={() =>
              setIsRecentOpen((prevIsRecentOpen) => !prevIsRecentOpen)
            }
          />
        )}
      </aside>

      {showComingSoonModal &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <ModalNotice
              title="아직 준비중인 서비스입니다"
              description={
                "더 나은 서비스를 위해 노력하고 있습니다!\n조금만 기다려 주세요"
              }
              onClose={closeComingSoonModal}
              primaryAction={{
                label: "확인",
                onClick: closeComingSoonModal,
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
