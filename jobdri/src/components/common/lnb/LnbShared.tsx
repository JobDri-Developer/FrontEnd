"use client";

import { type PointerEvent, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { IconButton, TextButton } from "@/components/common/buttons";
import Icon, { type IconType } from "@/components/common/icons/Icon";
import { SearchBar } from "@/components/common/searchbar";
import { Tooltip } from "@/components/common/tooltip";
import useOutsideClick from "@/hooks/useOutsideClick";
import Logo from "@/assets/ic_LOGO_minimum_favi.svg";
import {
  LnbNotificationButton,
  type LnbNotificationItem,
} from "./LnbNotification";
import {
  lnbHiddenScrollbarClass,
  LnbScrollbar,
  useLnbScrollMetrics,
} from "./LnbScrollbar";

export type LnbItemKey = "experience" | "apply";

export interface LnbNavItem {
  key: LnbItemKey;
  label: string;
  iconType: IconType;
  href?: string;
}

export interface LnbRecentItem {
  id: string;
  companyName: string;
  jobTitle: string;
  version: number;
}

export const navItems: LnbNavItem[] = [
  {
    key: "apply",
    label: "모의 서류 지원",
    iconType: "APPLY",
    href: "/mockApply",
  },
  {
    key: "experience",
    label: "지원 현황 관리",
    iconType: "EX_S",
  },
];

export const defaultRecentItems: LnbRecentItem[] = [
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
    id: "sandbox-grading-criteria-refinement",
    companyName: "SK하이닉스",
    jobTitle: "채점 평가 요소 고도화 및 결과 리포트 개선",
    version: 2,
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
  {
    id: "line-product-manager",
    companyName: "라인",
    jobTitle: "프로덕트 매니저",
    version: 3,
  },
  {
    id: "baemin-brand-designer",
    companyName: "배달의민족",
    jobTitle: "브랜드 디자이너",
    version: 2,
  },
  {
    id: "danggeun-content-marketer",
    companyName: "당근",
    jobTitle: "콘텐츠 마케터",
    version: 1,
  },
  {
    id: "hyundai-data-analyst",
    companyName: "현대자동차",
    jobTitle: "서비스 데이터 분석가",
    version: 4,
  },
  {
    id: "musinsa-product-designer",
    companyName: "무신사",
    jobTitle: "커머스 프로덕트 디자이너",
    version: 2,
  },
  {
    id: "zigbang-frontend-engineer",
    companyName: "직방",
    jobTitle: "프론트엔드 엔지니어",
    version: 5,
  },
  {
    id: "bucketplace-ux-writer",
    companyName: "오늘의집",
    jobTitle: "UX 라이터",
    version: 1,
  },
  {
    id: "yanolja-growth-manager",
    companyName: "야놀자",
    jobTitle: "그로스 매니저",
    version: 2,
  },
];

export function LnbDivider() {
  return (
    <div className="flex items-center gap-2.5 self-stretch">
      <span className="h-px flex-1 bg-line-neutral-default" />
    </div>
  );
}

export function LnbDefaultHeader({
  onToggleFold,
}: {
  onToggleFold: () => void;
}) {
  return (
    <div className="flex items-center justify-between self-stretch py-5 pr-2 pl-1">
      <span className="flex h-[30px] w-[100px] shrink-0 items-end justify-center">
        <Logo aria-hidden="true" className="h-[30px] w-[100px]" />
      </span>

      <div className="flex items-center gap-3">
        <IconButton
          iconType="SIDEBAR"
          styleType="weak"
          size="s"
          buttonType="transparent"
          aria-label="LNB 접기"
          onClick={onToggleFold}
        />
      </div>
    </div>
  );
}

export function LnbFoldedHeader({
  onToggleFold,
}: {
  onToggleFold: () => void;
}) {
  return (
    <div className="flex h-[70px] items-center justify-center gap-[72px] self-stretch px-2 py-5">
      <div className="flex items-center gap-3">
        <IconButton
          iconType="SIDEBAR"
          styleType="weak"
          size="s"
          buttonType="transparent"
          aria-label="LNB 펼치기"
          onClick={onToggleFold}
        />
      </div>
    </div>
  );
}

function LnbDefaultNavItemButton({
  item,
  isActive,
  onClick,
}: {
  item: LnbNavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex h-9 items-center gap-2 self-stretch rounded-toast-s px-2 text-sub14-med [font-feature-settings:'liga'_off,'clig'_off]",
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
      <span className="truncate">{item.label}</span>
    </button>
  );
}

function LnbFoldedNavItemButton({
  item,
  isActive,
  onClick,
}: {
  item: LnbNavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const navButton = (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex h-9 w-9 items-center justify-center gap-2 rounded-cta-l px-2 text-sub14-med [font-feature-settings:'liga'_off,'clig'_off]",
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
    </button>
  );

  return (
    <div className="group relative flex h-9 w-9 items-center justify-center">
      {navButton}
      <div className="pointer-events-none invisible absolute left-[calc(100%+11px)] top-[-1px] z-50 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <Tooltip
          placement="left_mid"
          message={item.label.replace(/\s+/g, "")}
          showIcon={false}
          className="whitespace-nowrap"
        />
      </div>
    </div>
  );
}

export function LnbDefaultPrimaryNav({
  activeItem,
  onNavItemClick,
}: {
  activeItem?: LnbItemKey;
  onNavItemClick: (item: LnbNavItem) => void;
}) {
  return (
    <nav className="flex flex-col items-start self-stretch gap-1.5 px-2 py-3">
      {navItems.map((item) => (
        <LnbDefaultNavItemButton
          key={item.key}
          item={item}
          isActive={item.key === activeItem}
          onClick={() => onNavItemClick(item)}
        />
      ))}
    </nav>
  );
}

export function LnbFoldedPrimaryNav({
  activeItem,
  onNavItemClick,
}: {
  activeItem?: LnbItemKey;
  onNavItemClick: (item: LnbNavItem) => void;
}) {
  return (
    <nav className="flex flex-col items-start self-stretch gap-1.5 px-2 py-3">
      {navItems.map((item) => (
        <LnbFoldedNavItemButton
          key={item.key}
          item={item}
          isActive={item.key === activeItem}
          onClick={() => onNavItemClick(item)}
        />
      ))}
    </nav>
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
  const titleRef = useRef<HTMLSpanElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const isTitleTruncated = () => {
    const titleElement = titleRef.current;

    return titleElement
      ? titleElement.scrollWidth > titleElement.clientWidth
      : false;
  };
  const updateTooltipPosition = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isTitleTruncated()) {
      setTooltipPosition(null);
      return;
    }

    setTooltipPosition({
      x: event.clientX + 12,
      y: event.clientY + 14,
    });
  };
  const hideTooltip = () => setTooltipPosition(null);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        onPointerEnter={updateTooltipPosition}
        onPointerMove={updateTooltipPosition}
        onPointerLeave={hideTooltip}
        onBlur={hideTooltip}
        className={clsx(
          "flex h-[33px] w-[260px] items-center justify-between rounded-toast-s py-1.5 pr-2 pl-3 hover:bg-fill-state-hover-light",
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
          <span
            ref={titleRef}
            className="h-[21px] min-w-0 flex-1 truncate text-left text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]"
          >
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

      {tooltipPosition && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[100] whitespace-nowrap rounded-[2px] border border-line-neutral-strong bg-bg-contents-default px-2 py-1 text-cap12-med text-text-neutral-description shadow-card [font-feature-settings:'liga'_off,'clig'_off]"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {item.jobTitle}
        </div>
      )}
    </>
  );
}

function RecentSectionToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 shrink-0 items-center justify-center text-icon-neutral-assistive group-hover:text-icon-neutral-default"
    >
      <Icon
        type={isOpen ? "ARROW_UP_20" : "ARROW_DOWN_20"}
        className="h-5 w-5 shrink-0 [&_path]:fill-current"
      />
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
  const { scrollAreaRef, scrollbarMetrics, updateScrollbarMetrics } =
    useLnbScrollMetrics(isOpen, items.length);

  return (
    <section className="flex min-h-0 flex-1 flex-col items-center gap-0 self-stretch">
      <button
        type="button"
        className="group flex items-center gap-1.5 self-stretch rounded-cta-l px-3 py-1.5"
        aria-expanded={isOpen}
        onClick={onToggleOpen}
      >
        <span className="text-label14-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off] group-hover:text-text-neutral-description">
          최근 항목
        </span>
        <RecentSectionToggleIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className="relative flex min-h-0 flex-1 items-stretch self-stretch overflow-visible pr-1">
          <div
            ref={scrollAreaRef}
            onScroll={updateScrollbarMetrics}
            className={clsx(
              "flex min-h-0 min-w-0 flex-1 flex-col items-start overflow-y-auto overflow-x-hidden",
              lnbHiddenScrollbarClass,
            )}
          >
            <div className="flex min-w-0 flex-col items-start">
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

          <LnbScrollbar metrics={scrollbarMetrics} />
        </div>
      )}
    </section>
  );
}

function SearchEmptyState() {
  return (
    <div className="flex h-[200px] items-center justify-center gap-2.5 self-stretch">
      <div className="flex flex-col items-center justify-center gap-5 p-0">
        <div
          className="h-20 w-20 shrink-0 border border-pink-400 bg-pink-100"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-center text-b16-semibold text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
            검색 결과가 없습니다
          </p>
        </div>
      </div>
    </div>
  );
}

export function LnbDefaultSearchMenu({
  searchQuery,
  recentItems,
  isRecentOpen,
  selectedRecentItemId,
  onSearchQueryChange,
  onToggleRecentOpen,
  onRecentItemClick,
}: {
  searchQuery: string;
  recentItems: LnbRecentItem[];
  isRecentOpen: boolean;
  selectedRecentItemId?: string;
  onSearchQueryChange: (value: string) => void;
  onToggleRecentOpen: () => void;
  onRecentItemClick: (item: LnbRecentItem) => void;
}) {
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
  const shouldShowSearchEmptyState =
    normalizedSearchQuery.length > 0 && filteredRecentItems.length === 0;

  return (
    <div className="flex min-h-0 flex-1 items-start self-stretch gap-1.5 px-2 py-4">
      <div className="flex min-h-0 flex-1 flex-col items-start gap-3 self-stretch">
        <SearchBar value={searchQuery} onChange={onSearchQueryChange} />

        {shouldShowSearchEmptyState && <SearchEmptyState />}

        {!shouldShowSearchEmptyState && (
          <RecentItemsSection
            items={filteredRecentItems}
            isOpen={isRecentOpen}
            selectedItemId={selectedRecentItemId}
            onToggleOpen={onToggleRecentOpen}
            onRecentItemClick={onRecentItemClick}
          />
        )}
      </div>
    </div>
  );
}

export function LnbFoldedSearchMenu({
  searchQuery,
  onSearchQueryChange,
}: {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex items-start gap-1 self-stretch px-2 py-3">
      <div className="flex flex-col items-start gap-0 self-stretch">
        <SearchBar
          collapsed
          value={searchQuery}
          onChange={onSearchQueryChange}
        />
      </div>
    </div>
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

import { useRouter } from "next/navigation";

export function LnbDefaultFooter({
  creditCount,
  email,
  emailInitial,
  hasNotification,
  notificationItems,
  onLogout,
}: {
  creditCount: number;
  email: string;
  emailInitial: string;
  hasNotification: boolean;
  notificationItems: LnbNotificationItem[];
  onLogout: () => void;
}) {
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const router = useRouter();

  useOutsideClick(
    accountMenuRef,
    () => setIsAccountMenuOpen(false),
    isAccountMenuOpen,
  );

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
          onClick={() => router.push("/credit")}
        />
      </div>

      <div className="flex items-center justify-between self-stretch px-2 py-3">
        <div ref={accountMenuRef} className="relative flex items-center gap-2">
          {isAccountMenuOpen && (
            <div className="absolute bottom-[calc(100%+5px)] left-0 z-50 flex w-[200px] flex-col items-start gap-0 rounded-toast-s border border-line-neutral-default bg-bg-lightbox-light p-1 shadow-card backdrop-blur-[2px]">
              <TextButton
                label="로그아웃"
                size="small"
                styleType="secondary"
                leftIconType="LOGOUT"
                className="!flex w-full self-stretch justify-start"
                onClick={onLogout}
              />
            </div>
          )}

          <button
            type="button"
            aria-expanded={isAccountMenuOpen}
            aria-label={`${email} 계정 메뉴`}
            onClick={() =>
              setIsAccountMenuOpen(
                (prevIsAccountMenuOpen) => !prevIsAccountMenuOpen,
              )
            }
            className="inline-flex items-center gap-2 rounded-chip-s p-0.5 hover:bg-fill-state-hover-light"
          >
            <div className="flex w-[126px] items-center justify-between gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-icon-neutral-default px-1.5 text-sub14-med text-text-neutral-white [font-feature-settings:'liga'_off,'clig'_off]">
                {emailInitial}
              </span>
              <span className="min-w-0 flex-1 truncate text-left text-cap12-med text-text-neutral-caption">
                {email}
              </span>
            </div>
          </button>
        </div>

        <LnbNotificationButton
          hasNotification={hasNotification}
          notificationItems={notificationItems}
        />
      </div>
    </div>
  );
}

export function LnbFoldedFooter({
  emailInitial,
  hasNotification,
  notificationItems,
}: {
  emailInitial: string;
  hasNotification: boolean;
  notificationItems: LnbNotificationItem[];
}) {
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
        <LnbNotificationButton
          hasNotification={hasNotification}
          notificationItems={notificationItems}
        />
      </div>

      <div className="flex items-center justify-center self-stretch py-3">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-icon-neutral-default px-1.5 text-sub14-med text-text-neutral-white [font-feature-settings:'liga'_off,'clig'_off]">
          {emailInitial}
        </span>
      </div>
    </div>
  );
}
