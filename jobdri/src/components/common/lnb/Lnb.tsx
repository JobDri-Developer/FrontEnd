"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { IconButton, TextButton } from "@/components/common/buttons";
import Icon, { type IconType } from "@/components/common/icons/Icon";
import { AUTH_STORAGE_KEYS, getStoredAuthEmail } from "@/lib/auth";
import { fetchCreditBalance } from "@/lib/api/credit";
import Logo from "@/assets/ic_LOGO_minimum_favi.svg";

type LnbItemKey = "experience" | "apply";

interface LnbProps {
  initialActiveItem?: LnbItemKey;
  email?: string;
  className?: string;
  recentItems?: LnbRecentItem[];
  defaultRecentOpen?: boolean;
  hasNotification?: boolean;
}

interface LnbNavItem {
  key: LnbItemKey;
  label: string;
  iconType: IconType;
}

interface LnbRecentItem {
  id: string;
  companyName: string;
  jobTitle: string;
  version: number;
}

const navItems: LnbNavItem[] = [
  {
    key: "apply",
    label: "모의 서류 지원",
    iconType: "APPLY",
  },
  {
    key: "experience",
    label: "지원 현황 관리",
    iconType: "EX_S",
  },
];

const defaultRecentItems: LnbRecentItem[] = [
  {
    id: "toss-product-designer",
    companyName: "토스",
    jobTitle: "프로덕트 디자이너",
    version: 1,
  },
  {
    id: "kakao-ux-researcher",
    companyName: "카카오",
    jobTitle: "UX 리서처",
    version: 1,
  },
  {
    id: "naver-ui-designer",
    companyName: "네이버",
    jobTitle: "UI 디자이너",
    version: 1,
  },
  {
    id: "coupang-mobile-designer",
    companyName: "쿠팡",
    jobTitle: "모바일 디자이너",
    version: 6,
  },
  {
    id: "coupang-contract-interview-5",
    companyName: "쿠팡",
    jobTitle: "모바일 디자이너 계약직 인턴십",
    version: 5,
  },
  {
    id: "coupang-contract-interview-4",
    companyName: "쿠팡",
    jobTitle: "모바일 디자이너 계약직 인턴십",
    version: 4,
  },
  {
    id: "coupang-contract-interview-3",
    companyName: "쿠팡",
    jobTitle: "모바일 디자이너 계약직 인턴십",
    version: 3,
  },
  {
    id: "coupang-contract-interview-2",
    companyName: "쿠팡",
    jobTitle: "모바일 디자이너 계약직 인턴십",
    version: 2,
  },
  {
    id: "coupang-contract-interview-1",
    companyName: "쿠팡",
    jobTitle: "모바일 디자이너 계약직 인턴십",
    version: 1,
  },
];

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

function LnbDivider() {
  return (
    <div className="flex items-center gap-2.5 self-stretch">
      <span className="h-px flex-1 bg-line-neutral-default" />
    </div>
  );
}

function LnbHeader({
  isFold,
  onToggleFold,
}: {
  isFold: boolean;
  onToggleFold: () => void;
}) {
  return (
    <div
      className={clsx(
        "flex items-center self-stretch",
        isFold
          ? "h-[70px] justify-center gap-[72px] px-2 py-5"
          : "justify-between py-5 pr-2 pl-1",
      )}
    >
      {!isFold && (
        <span className="flex h-[30px] w-[100px] shrink-0 items-end justify-center">
          <Logo aria-hidden="true" className="h-[30px] w-[100px]" />
        </span>
      )}

      <div className="flex items-center gap-3">
        <IconButton
          iconType="SIDEBAR"
          styleType="weak"
          size="s"
          buttonType="transparent"
          aria-label={isFold ? "LNB 펼치기" : "LNB 접기"}
          onClick={onToggleFold}
        />
      </div>
    </div>
  );
}

function LnbNavItemButton({
  item,
  isActive,
  isFold,
  onClick,
}: {
  item: LnbNavItem;
  isActive: boolean;
  isFold: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex h-9 items-center gap-2 text-sub14-med [font-feature-settings:'liga'_off,'clig'_off]",
        isFold
          ? "w-9 justify-center rounded-cta-l px-2"
          : "self-stretch rounded-toast-s px-2",
        isActive
          ? "text-text-primary-strong"
          : "text-text-neutral-description hover:bg-fill-state-hover-light",
      )}
    >
      <Icon
        type={item.iconType}
        className={clsx(
          "h-5 w-5 shrink-0",
          isActive ? "text-icon-primary-default" : "text-icon-neutral-default",
        )}
      />

      {!isFold && <span className="truncate">{item.label}</span>}
    </button>
  );
}

function LnbPrimaryNav({
  activeItem,
  isFold,
  onNavItemClick,
}: {
  activeItem?: LnbItemKey;
  isFold: boolean;
  onNavItemClick: (item: LnbNavItem) => void;
}) {
  return (
    <nav
      className={clsx(
        "flex flex-col items-start self-stretch gap-1.5 px-2 py-3",
      )}
    >
      {navItems.map((item) => (
        <LnbNavItemButton
          key={item.key}
          item={item}
          isActive={item.key === activeItem}
          isFold={isFold}
          onClick={() => onNavItemClick(item)}
        />
      ))}
    </nav>
  );
}

function FoldSearchIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 shrink-0 items-center justify-center"
    >
      <svg
        className="block h-5 w-5"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="scale(1.24415)">
          <path
            d="M7.66797 2.41699C10.5673 2.41717 12.918 4.76761 12.918 7.66699C12.9179 8.90688 12.4865 10.0451 11.7676 10.9434L13.9131 13.0879C14.1406 13.3157 14.1406 13.6853 13.9131 13.9131C13.6854 14.1408 13.3157 14.1407 13.0879 13.9131L10.9434 11.7676C10.0453 12.4859 8.90726 12.9169 7.66797 12.917C4.76867 12.9169 2.41814 10.5663 2.41797 7.66699C2.41797 4.76756 4.76856 2.4171 7.66797 2.41699ZM7.66797 3.58301C5.4129 3.58311 3.58398 5.41189 3.58398 7.66699C3.58416 9.92194 5.413 11.7499 7.66797 11.75C9.92287 11.7498 11.7508 9.9219 11.751 7.66699C11.751 5.41194 9.92298 3.58318 7.66797 3.58301Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </span>
  );
}

function LnbSearchBar({
  isFold,
  searchQuery,
  onSearchQueryChange,
}: {
  isFold: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}) {
  if (isFold) {
    return (
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-cta-l px-2 text-icon-neutral-default hover:bg-fill-state-hover-light active:bg-fill-state-hover-light"
        aria-label="검색"
      >
        <FoldSearchIcon />
      </button>
    );
  }

  return (
    <label className="flex items-center gap-2 self-stretch rounded-cta-s border border-line-neutral-default bg-bg-contents-default p-1.5">
      <span className="flex min-w-0 flex-1 items-center gap-2 px-0.5 pt-px pb-0.5">
        <Icon type="SEARCH" className="h-4 w-4 shrink-0 text-icon-neutral-default" />
        <input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex min-w-0 flex-1 bg-transparent text-cap12-med text-text-neutral-description outline-none placeholder:text-text-neutral-disabled [font-feature-settings:'liga'_off,'clig'_off]"
        />
      </span>
    </label>
  );
}

function RecentItemButton({
  item,
  selected,
  onClick,
}: {
  item: LnbRecentItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-[260px] items-center justify-between rounded-toast-s py-1.5 pr-2 pl-3 hover:bg-fill-state-hover-light",
        selected && "bg-fill-state-hover-light",
      )}
    >
      <span className="flex min-w-0 max-w-[220px] flex-1 items-center gap-1">
        <span className="shrink-0 text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {item.companyName}
        </span>
        <span className="shrink-0 text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          |
        </span>
        <span className="h-[21px] min-w-0 flex-1 truncate text-left text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {item.jobTitle}
        </span>
      </span>

      <span className="flex shrink-0 items-center justify-end gap-0.5 pl-2">
        <span className="text-right text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          v.
        </span>
        <span className="text-right text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          {item.version}
        </span>
      </span>
    </button>
  );
}

function RecentSectionToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 shrink-0 items-center justify-center text-icon-neutral-assistive"
    >
      <svg
        className="block h-5 w-5"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={
            isOpen
              ? "M14.1667 11.6667L10 7.5L5.83333 11.6667"
              : "M5.83333 8.33333L10 12.5L14.1667 8.33333"
          }
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function RecentItemsSection({
  items,
  isOpen,
  selectedItemId,
  onToggleOpen,
  onRecentItemClick,
}: {
  items: LnbRecentItem[];
  isOpen: boolean;
  selectedItemId?: string;
  onToggleOpen: () => void;
  onRecentItemClick: (item: LnbRecentItem) => void;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center gap-0 self-stretch">
      <button
        type="button"
        className="flex items-center gap-1.5 self-stretch px-3 py-1.5"
        aria-expanded={isOpen}
        onClick={onToggleOpen}
      >
        <span className="text-label14-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          최근 항목
        </span>
        <RecentSectionToggleIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className="flex min-h-0 items-start self-stretch pr-1">
          <div className="flex min-w-0 flex-1 flex-col items-start">
            {items.map((item) => (
              <RecentItemButton
                key={item.id}
                item={item}
                selected={item.id === selectedItemId}
                onClick={() => onRecentItemClick(item)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function LnbSearchMenu({
  isFold,
  recentItems,
  defaultRecentOpen,
  selectedRecentItemId,
  onRecentItemClick,
}: {
  isFold: boolean;
  recentItems: LnbRecentItem[];
  defaultRecentOpen: boolean;
  selectedRecentItemId?: string;
  onRecentItemClick: (item: LnbRecentItem) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecentOpen, setIsRecentOpen] = useState(defaultRecentOpen);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredRecentItems = useMemo(() => {
    if (!normalizedSearchQuery) {
      return recentItems;
    }

    return recentItems.filter((item) =>
      `${item.companyName} ${item.jobTitle}`
        .toLowerCase()
        .includes(normalizedSearchQuery),
    );
  }, [normalizedSearchQuery, recentItems]);

  return (
    <div
      className={clsx(
        "flex items-start self-stretch",
        isFold ? "gap-1 px-2 py-3" : "min-h-0 flex-1 gap-1.5 px-2 py-4",
      )}
    >
      <div
        className={clsx(
          "flex flex-col items-start self-stretch",
          isFold ? "gap-0" : "min-h-0 flex-1 gap-3",
        )}
      >
        <LnbSearchBar
          isFold={isFold}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        {!isFold && (
          <RecentItemsSection
            items={filteredRecentItems}
            isOpen={isRecentOpen}
            selectedItemId={selectedRecentItemId}
            onToggleOpen={() => setIsRecentOpen((prevIsOpen) => !prevIsOpen)}
            onRecentItemClick={onRecentItemClick}
          />
        )}
      </div>
    </div>
  );
}

function NotificationButton({
  hasNotification,
}: {
  hasNotification: boolean;
}) {
  return (
    <span className="relative flex items-end gap-2.5">
      <IconButton
        iconType="BELL"
        styleType="weak"
        size="s"
        buttonType="transparent"
        aria-label="알림"
      />
      {hasNotification && (
        <span className="absolute top-px right-px flex items-center justify-center">
          <span className="h-[5px] w-[5px] rounded-full bg-icon-primary-strong" />
        </span>
      )}
    </span>
  );
}

function CreditTokenIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-4 w-4 shrink-0 items-center justify-center text-icon-neutral-default"
    >
      <svg
        className="block h-4 w-4"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="scale(0.8)">
          <path
            d="M15.3125 8.1875C16.7708 7.53472 17.5 6.75 17.5 5.83333C17.5 4.91667 16.7708 4.13194 15.3125 3.47917C13.8542 2.82639 12.0833 2.5 10 2.5C7.91667 2.5 6.14583 2.82639 4.6875 3.47917C3.22917 4.13194 2.5 4.91667 2.5 5.83333C2.5 6.75 3.22917 7.53472 4.6875 8.1875C6.14583 8.84028 7.91667 9.16667 10 9.16667C12.0833 9.16667 13.8542 8.84028 15.3125 8.1875ZM12.1354 11.0729C12.9896 10.9549 13.8125 10.7639 14.6042 10.5C15.3958 10.2361 16.0764 9.89236 16.6458 9.46875C17.2153 9.04514 17.5 8.52778 17.5 7.91667V10C17.5 10.6111 17.2153 11.1285 16.6458 11.5521C16.0764 11.9757 15.3958 12.3194 14.6042 12.5833C13.8125 12.8472 12.9896 13.0382 12.1354 13.1563C11.2812 13.2743 10.5694 13.3333 10 13.3333C9.43056 13.3333 8.71875 13.2743 7.86458 13.1563C7.01042 13.0382 6.1875 12.8472 5.39583 12.5833C4.60417 12.3194 3.92361 11.9757 3.35417 11.5521C2.78472 11.1285 2.5 10.6111 2.5 10V7.91667C2.5 8.52778 2.78472 9.04514 3.35417 9.46875C3.92361 9.89236 4.60417 10.2361 5.39583 10.5C6.1875 10.7639 7.01042 10.9549 7.86458 11.0729C8.71875 11.191 9.43056 11.25 10 11.25C10.5694 11.25 11.2812 11.191 12.1354 11.0729ZM12.1354 15.2396C12.9896 15.1215 13.8125 14.9306 14.6042 14.6667C15.3958 14.4028 16.0764 14.059 16.6458 13.6354C17.2153 13.2118 17.5 12.6944 17.5 12.0833V14.1667C17.5 14.7778 17.2153 15.2951 16.6458 15.7188C16.0764 16.1424 15.3958 16.4861 14.6042 16.75C13.8125 17.0139 12.9896 17.2049 12.1354 17.3229C11.2812 17.441 10.5694 17.5 10 17.5C9.43056 17.5 8.71875 17.441 7.86458 17.3229C7.01042 17.2049 6.1875 17.0139 5.39583 16.75C4.60417 16.4861 3.92361 16.1424 3.35417 15.7188C2.78472 15.2951 2.5 14.7778 2.5 14.1667V12.0833C2.5 12.6944 2.78472 13.2118 3.35417 13.6354C3.92361 14.059 4.60417 14.4028 5.39583 14.6667C6.1875 14.9306 7.01042 15.1215 7.86458 15.2396C8.71875 15.3576 9.43056 15.4167 10 15.4167C10.5694 15.4167 11.2812 15.3576 12.1354 15.2396Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </span>
  );
}

function LnbFooter({
  isFold,
  creditCount,
  email,
  emailInitial,
  hasNotification,
}: {
  isFold: boolean;
  creditCount: number;
  email: string;
  emailInitial: string;
  hasNotification: boolean;
}) {
  if (isFold) {
    return (
      <div className="flex flex-col items-start gap-0 self-stretch px-2 py-3">
        <div className="flex items-center justify-center self-stretch py-2">
          <IconButton
            iconType="TOKEN"
            styleType="weak"
            size="s"
            buttonType="transparent"
            aria-label="크레딧"
          />
        </div>

        <div className="flex items-center justify-center self-stretch py-2">
          <NotificationButton hasNotification={hasNotification} />
        </div>

        <div className="flex items-center justify-center self-stretch py-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-icon-neutral-default px-1.5 text-sub14-med text-text-neutral-white [font-feature-settings:'liga'_off,'clig'_off]">
            {emailInitial}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0 self-stretch px-2 py-3">
      <div className="flex items-center justify-between self-stretch px-2 py-2">
        <div className="flex h-[21px] items-center justify-end gap-1">
          <CreditTokenIcon />
          <span className="text-cap12-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
            {creditCount}회
          </span>
        </div>

        <TextButton
          label="크레딧"
          size="small"
          styleType="secondary"
          rightIconType="EX_LINK"
        />
      </div>

      <div className="flex items-center justify-between self-stretch px-2 py-3">
        <div className="flex items-center gap-2 p-0.5">
          <div className="flex w-[126px] items-center justify-between gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-icon-neutral-default px-1.5 text-sub14-med text-text-neutral-white [font-feature-settings:'liga'_off,'clig'_off]">
              {emailInitial}
            </span>
            <span className="min-w-0 flex-1 truncate text-cap12-med text-text-neutral-caption">
              {email}
            </span>
          </div>
        </div>

        <NotificationButton hasNotification={hasNotification} />
      </div>
    </div>
  );
}

export default function Lnb({
  initialActiveItem = "apply",
  email,
  className,
  recentItems = defaultRecentItems,
  defaultRecentOpen = true,
  hasNotification = true,
}: LnbProps) {
  const storedEmail = useSyncExternalStore(
    subscribeToStoredEmail,
    getStoredEmailSnapshot,
    getServerStoredEmailSnapshot,
  );
  const displayEmail = (email ?? storedEmail) || defaultEmail;
  const emailInitial = getEmailInitial(displayEmail);
  const [creditCount, setCreditCount] = useState<number>(0);
  const [isFold, setIsFold] = useState(false);
  const [activeItem, setActiveItem] =
    useState<LnbItemKey | undefined>(initialActiveItem);
  const [selectedRecentItemId, setSelectedRecentItemId] = useState<string>(
    recentItems[1]?.id ?? recentItems[0]?.id ?? "",
  );

  const handleNavItemClick = (item: LnbNavItem) => {
    setActiveItem(item.key);
  };

  const handleRecentItemClick = (item: LnbRecentItem) => {
    setSelectedRecentItemId(item.id);
  };

  useEffect(() => {
    fetchCreditBalance()
      .then(setCreditCount)
      .catch(() => {});
  }, []);

  return (
    <aside
      className={clsx(
        "flex h-screen min-h-[800px] shrink-0 flex-col justify-between border-r border-line-neutral-default bg-bg-contents-default transition-[width] duration-300 ease-in-out",
        isFold ? "w-[52px] items-center" : "w-[280px]",
        className,
      )}
    >
      <div
        className={clsx(
          "flex min-h-0 flex-1 flex-col self-stretch",
          isFold ? "items-center" : "items-start",
        )}
      >
        <LnbHeader
          isFold={isFold}
          onToggleFold={() => setIsFold((prevIsFold) => !prevIsFold)}
        />
        <LnbDivider />

        <div className="flex min-h-0 flex-1 flex-col items-start self-stretch">
          <LnbPrimaryNav
            activeItem={activeItem}
            isFold={isFold}
            onNavItemClick={handleNavItemClick}
          />
          <LnbDivider />
          <LnbSearchMenu
            isFold={isFold}
            recentItems={recentItems}
            defaultRecentOpen={defaultRecentOpen}
            selectedRecentItemId={selectedRecentItemId}
            onRecentItemClick={handleRecentItemClick}
          />
        </div>
      </div>

      <LnbFooter
        isFold={isFold}
        creditCount={creditCount}
        email={displayEmail}
        emailInitial={emailInitial}
        hasNotification={hasNotification}
      />
    </aside>
  );
}
