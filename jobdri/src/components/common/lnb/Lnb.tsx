"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";
import { ModalNotice } from "@/components/common/modal";
import {
  AUTH_STORAGE_KEYS,
  getStoredAuthEmail,
  requestLogout,
  clearAuthTokens,
} from "@/lib/auth";
import Logo from "@/assets/ic_LOGO_minimum_favi.svg";
import { fetchCreditBalance } from "@/lib/api/credit";
import { TextButton } from "../buttons";

type LnbItemKey = "experience" | "apply";

interface LnbProps {
  initialActiveItem?: LnbItemKey;
  email?: string;
  className?: string;
}

interface LnbNavItem {
  key: LnbItemKey;
  label: string;
  iconType: IconType;
  href?: string;
}

const navItems: LnbNavItem[] = [
  {
    key: "apply",
    label: "모의서류지원",
    iconType: "APPLY",
    href: "/mockApply",
  },
  { key: "experience", label: "경험기록장", iconType: "EX_S" },
];

const navItemBaseClassName =
  "flex h-9 items-center gap-2 rounded-cta-l py-3 px-2 text-sub14-med";

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

export default function Lnb({ initialActiveItem, email, className }: LnbProps) {
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
  const [activeItem, setActiveItem] = useState<LnbItemKey | undefined>(
    initialActiveItem,
  );

  const handleNavItemClick = (item: LnbNavItem) => {
    if (item.href) {
      setActiveItem(item.key);
      router.push(item.href);
      return;
    }

    setShowComingSoonModal(true);
  };

  const closeComingSoonModal = () => setShowComingSoonModal(false);

  useEffect(() => {
    fetchCreditBalance()
      .then(setCreditCount)
      .catch(() => {});
  }, []);

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
          "flex h-screen shrink-0 flex-col justify-between overflow-hidden border-r border-line-neutral-default bg-bg-contents-default px-2 py-5 transition-[width] duration-300 ease-in-out",
          isFold ? "w-[52px]" : "w-60",
          className,
        )}
      >
        <div className="flex w-full flex-col gap-8">
          <div className="flex h-8 w-full items-center px-1">
            {!isFold && <Logo className="flex-1" />}
            <button
              type="button"
              aria-label={isFold ? "LNB 펼치기" : "LNB 접기"}
              className="flex h-5 w-5 shrink-0 items-center justify-center text-icon-neutral-default mx-auto"
              onClick={() => setIsFold((prevIsFold) => !prevIsFold)}
            >
              <Icon type="SIDEBAR" className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex w-full flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = item.key === activeItem;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavItemClick(item)}
                  // 변경된 부분: isFold일 때 gap-0을 적용하여 간격 없애기
                  className={`${navItemBaseClassName} w-full ${
                    isFold ? "pl-2 gap-0" : ""
                  } ${
                    isActive
                      ? "bg-fill-primary-assistive text-text-primary-strong"
                      : "text-text-neutral-description"
                  } ${!isActive ? "hover:bg-fill-hover" : ""}`}
                >
                  <Icon
                    type={item.iconType}
                    className={`shrink-0 ${
                      isActive
                        ? "text-icon-primary-strong"
                        : "text-icon-neutral-default"
                    }`}
                  />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-[opacity,width] duration-150 ${
                      isFold ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex w-full flex-col justify-end gap-1">
          <div
            className={`overflow-hidden transition-[opacity,height] duration-150 w-full ${
              isFold ? "h-0 opacity-0" : "h-auto opacity-100"
            }`}
          >
            <div className="flex w-full items-center justify-between px-2 py-2">
              <button
                type="button"
                onClick={() => router.push("/credit")}
                className="flex items-center gap-[3px] text-label14-med text-icon-neutral-default [font-feature-settings:'liga'_off,'clig'_off] hover:text-text-neutral-title"
              >
                <span>크레딧</span>
                <Icon
                  type="EX_LINK"
                  className="h-4 w-4 text-icon-neutral-assistive"
                />
              </button>
              <div className="flex h-[21px] items-center justify-end gap-1">
                <Icon
                  type="TOKEN"
                  className="h-4 w-4 text-icon-neutral-default"
                />
                <span className="text-cap12-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                  {creditCount}회
                </span>
              </div>
            </div>
            <div className="h-[0.75px] w-full bg-line-neutral-default" />
          </div>

          <div
            className={`flex w-full items-center gap-2 py-1.5 ${isFold ? "justify-center px-0" : "px-2"}`}
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-text-neutral-caption text-[14px] font-medium leading-[140%] text-text-neutral-white">
              {emailInitial}
            </div>
            <span
              className={`truncate text-cap12-med text-text-neutral-caption overflow-hidden whitespace-nowrap transition-[opacity,width] duration-150 ${
                isFold ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              {displayEmail}
            </span>
          </div>
          <div
            className={`flex w-full items-center gap-2 py-1.5 ${isFold ? "justify-center px-0" : "px-2"}`}
          >
            <TextButton
              label="로그아웃"
              styleType="secondary"
              iconPosition="null"
              hover="textOnly"
              onClick={handleLogout}
            />
          </div>
        </div>
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
