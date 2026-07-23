"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { IconButton } from "@/components/common/buttons";
import Icon, { type IconType } from "@/components/common/icons/Icon";
import { SelectListItem } from "@/components/common/select";
import useOutsideClick from "@/hooks/useOutsideClick";
import EmptyNotificationImage from "@/assets/ic_Image.svg";
import {
  lnbHiddenScrollbarClass,
  LnbScrollbar,
  useLnbScrollMetrics,
} from "./LnbScrollbar";
import {
  ApiNotificationItem,
  NotificationResponse,
  LnbNotificationItem,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/notification";
import { formatDate } from "@/utils/date";
import { scrollbarClassS } from "../scrollbar/scrollbarStyles";
import { useScrollGradient } from "@/hooks/useScrollGradient";

// export const defaultNotificationItems: LnbNotificationItem[] = [
//   {
//     id: "resume-analysis-complete",
//     title: "자소서 분석이 완료되었어요",
//     description: "<토스 | UX리서처> 결과 보러가기.",
//     timestamp: "26.07.14",
//     type: "normal",
//   },
//   {
//     id: "analysis-error",
//     title: "분석중 문제가 발생했어요",
//     description: "<토스 | UX리서처> 분석을 다시 시도해주세요.",
//     timestamp: "26.07.14",
//     type: "fail",
//   },
//   {
//     id: "job-posting-imported",
//     title: "공고 입력이 완료되었어요",
//     description: "<토스 | UX리서처> 자소서 쓰러 가기.",
//     timestamp: "26.07.14",
//     type: "complete",
//   },
//   {
//     id: "notification-sample-1",
//     title: "알림 제목 영역입니다. 알림 제목 영역입니다.",
//     description: "알림 내용 최대 25자 알림 내용 최대 25자",
//     timestamp: "26.07.08",
//   },
//   {
//     id: "notification-sample-2",
//     title: "알림 제목 영역입니다. 알림 제목 영역입니다.",
//     description: "알림 내용 최대 25자 알림 내용 최대 25자",
//     timestamp: "YY.MM.DD",
//     read: true,
//   },
//   {
//     id: "notification-sample-3",
//     title: "알림 제목 영역입니다. 알림 제목 영역입니다.",
//     description: "알림 내용 최대 25자 알림 내용 최대 25자",
//     timestamp: "YY.MM.DD",
//     type: "fail",
//     read: true,
//   },
//   {
//     id: "notification-sample-4",
//     title: "알림 제목 영역입니다. 알림 제목 영역입니다.",
//     description: "알림 내용 최대 25자 알림 내용 최대 25자",
//     timestamp: "YY.MM.DD",
//     type: "complete",
//     read: true,
//   },
// ];

const notificationIconStyles: Record<
  NonNullable<LnbNotificationItem["type"]>,
  {
    iconType: IconType;
    frameClassName: string;
    iconClassName: string;
  }
> = {
  normal: {
    iconType: "SPARKLE",
    frameClassName: "bg-fill-primary-assistive",
    iconClassName: "text-icon-primary-strong",
  },
  fail: {
    iconType: "WARN_24",
    frameClassName: "bg-fill-system-fail-hover",
    iconClassName: "text-fill-system-fail-strong",
  },
  complete: {
    iconType: "CIRCLE_CHECK",
    frameClassName: "bg-fill-secondary-assistive",
    iconClassName: "text-fill-secondary-default",
  },
};

function mapNotificationType(apiType?: string): "normal" | "fail" | "complete" {
  if (!apiType) {
    return "normal";
  }

  if (apiType.includes("FAILED") || apiType.includes("ERROR")) {
    return "fail";
  }

  if (apiType === "ANALYSIS_ASYNC_SUCCEEDED" || apiType === "GENERAL") {
    return "normal";
  }

  if (
    apiType === "JOB_POSTING_ASYNC_SUCCEEDED" ||
    apiType.includes("COMPLETE")
  ) {
    return "complete";
  }

  return "normal";
}

export function mapApiToLnbItem(
  item: ApiNotificationItem,
): LnbNotificationItem {
  const mockApplyId =
    item.payload?.mockApplyId !== undefined &&
    item.payload?.mockApplyId !== null
      ? String(item.payload.mockApplyId)
      : undefined;

  return {
    id: item.id ? String(item.id) : crypto.randomUUID(),
    title: item.title,
    description: item.body,
    timestamp: formatDate(item.createdAt),
    type: mapNotificationType(item.type),
    read: item.isRead,
    targetType: item.targetType,
    mockApplyId,
    apiType: item.type,
  };
}

export function LnbNotificationButton({
  hasNotification,
  notificationItems,
  onMarkAllRead,
  onReadItem,
}: {
  hasNotification: boolean;
  notificationItems: LnbNotificationItem[];
  onMarkAllRead?: () => void;
  onReadItem?: (id: string) => void;
}) {
  const notificationMenuRef = useRef<HTMLSpanElement>(null);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  useOutsideClick(
    notificationMenuRef,
    () => setIsNotificationPanelOpen(false),
    isNotificationPanelOpen,
  );

  return (
    <span
      ref={notificationMenuRef}
      className="relative flex h-6 w-6 shrink-0 items-center justify-center z-50"
    >
      <IconButton
        iconType="BELL"
        styleType={isNotificationPanelOpen ? "normal" : "weak"}
        size="s"
        buttonType="transparent"
        aria-label="알림"
        aria-expanded={isNotificationPanelOpen}
        aria-haspopup="dialog"
        onClick={() => {
          setIsNotificationPanelOpen((prev) => !prev);
          // (선택 사항) 패널을 열 때마다 최신 알림을 다시 불러오고 싶다면 여기에 추가
          // if (!isNotificationPanelOpen) { fetchNotifications(); }
        }}
      />

      {/* 안 읽은 알림이 있으면 빨간 점 표시 */}
      {hasNotification && (
        <span className="absolute top-px right-px flex items-center justify-center">
          <span className="h-[5px] w-[5px] rounded-full bg-icon-primary-strong" />
        </span>
      )}

      {isNotificationPanelOpen && (
        <LnbNotificationPanel
          notificationItems={notificationItems}
          onMarkAllRead={onMarkAllRead}
          onReadItem={onReadItem}
          className="absolute bottom-0 left-[38px] z-[80]"
        />
      )}
    </span>
  );
}

export function LnbNotificationPanel({
  notificationItems,
  className,
  onMarkAllRead,
  onReadItem,
}: {
  notificationItems: LnbNotificationItem[];
  className?: string;
  onMarkAllRead?: () => void;
  onReadItem?: (id: string) => void;
}) {
  const hasNotificationItems = notificationItems.length > 0;
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useOutsideClick(menuRef, () => setIsMenuOpen(false), isMenuOpen);

  return (
    <section
      role="dialog"
      aria-label="알림"
      className={clsx(
        "flex h-[360px] w-[460px] flex-col items-start gap-0 rounded-[16px] bg-bg-contents-default shadow-card",
        className,
      )}
    >
      <header className="flex items-center justify-between self-stretch px-4 py-2">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center justify-center gap-2.5">
            <h2 className="text-b16-semibold text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
              알림
            </h2>
          </div>

          <div ref={menuRef} className="relative flex flex-col items-end gap-1">
            <div className="flex h-6 w-6 flex-col items-end gap-1">
              <IconButton
                iconType="DOT_S"
                styleType="normal"
                size="s"
                buttonType="transparent"
                aria-label="알림 메뉴"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                onClick={() =>
                  setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen)
                }
              />
            </div>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute top-[calc(100%+4px)] right-0 z-[90] flex w-[124px] flex-col items-start overflow-hidden rounded-cta-s bg-fill-quaternary-default shadow-card"
              >
                <SelectListItem
                  role="menuitem"
                  itemClassName="w-full"
                  label="모두 읽음 표시"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // 1. 서버에 전체 읽음 API 호출 (백그라운드)
                    markAllNotificationsAsRead().catch(console.error);
                    // 2. 부모에게 알려서 화면 즉시 갱신
                    if (onMarkAllRead) onMarkAllRead();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {hasNotificationItems ? (
        <LnbNotificationList
          notificationItems={notificationItems}
          onReadItem={onReadItem}
        />
      ) : (
        <LnbNotificationEmptyState />
      )}
    </section>
  );
}

function LnbNotificationList({
  notificationItems,
  onReadItem,
}: {
  notificationItems: LnbNotificationItem[];
  onReadItem?: (id: string) => void;
}) {
  const { scrollAreaRef, scrollbarMetrics, updateScrollbarMetrics } =
    useLnbScrollMetrics(true, notificationItems.length);

  const { scrollRef, showGradient, checkScroll } =
    useScrollGradient<HTMLDivElement>([notificationItems]);

  const sortedItems = [...notificationItems].sort((a, b) => {
    const aRead = a.read ?? false;
    const bRead = b.read ?? false;
    if (!aRead && bRead) return -1;
    if (aRead && !bRead) return 1;
    return 0;
  });

  return (
    <div className="flex h-[318px] w-[460px] shrink-0 flex-col items-start gap-0 pt-2 pr-1.5 pb-4 pl-1.5">
      <div className="relative flex min-h-0 flex-1 flex-col items-start self-stretch px-1">
        <div
          ref={(node) => {
            if (scrollAreaRef) scrollAreaRef.current = node;
            if (scrollRef) scrollRef.current = node;
          }}
          onScroll={() => {
            updateScrollbarMetrics();
            checkScroll();
          }}
          className={clsx(
            "flex min-h-0 min-w-0 flex-1 flex-col items-start self-stretch overflow-y-auto overflow-x-hidden",
            scrollbarClassS,
          )}
        >
          <div className="flex min-w-0 flex-col items-start self-stretch">
            {sortedItems.map((notificationItem) => {
              if (!notificationItem.id || notificationItem.id === "undefined") {
                return null;
              }

              return (
                <LnbNotificationListItem
                  key={notificationItem.id}
                  notificationItem={notificationItem}
                  onReadItem={onReadItem}
                />
              );
            })}
          </div>
        </div>

        {showGradient && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0)_90.87%,var(--color-bg-contents-default)_100%)]" />
        )}
      </div>
    </div>
  );
}

function LnbNotificationEmptyState() {
  return (
    <div className="flex h-[318px] w-[460px] flex-col items-center justify-center gap-5 px-4 py-2">
      <div className="flex flex-col items-center justify-center gap-5 p-0">
        <EmptyNotificationImage
          aria-hidden="true"
          className="h-20 w-20 shrink-0"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-center text-b16-semibold text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
            알림이 여기에 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

export function LnbNotificationListItem({
  notificationItem,
  onReadItem,
}: {
  notificationItem: LnbNotificationItem;
  onReadItem?: (id: string) => void;
}) {
  const router = useRouter();
  const notificationType = notificationItem.type ?? "normal";
  const iconStyle = notificationIconStyles[notificationType];

  const handleNotificationClick = () => {
    // 🚨 어떤 녀석을 클릭했는지 원본 데이터를 통째로 찍어봅니다!
    console.log("클릭한 알림 전체 데이터:", notificationItem);

    const { id, targetType, mockApplyId, read, apiType } = notificationItem;

    if (!read) {
      markNotificationAsRead(id).catch(console.error);
      if (onReadItem) onReadItem(id);
    }

    // 만약 여기서 걸린다면 어떤 알림인지 콘솔 창에 찍힙니다.
    if (!mockApplyId) {
      console.warn("⚠️ 이 알림에는 mockApplyId가 없습니다!", notificationItem);
      router.push("/apply"); // ID가 없으면 안전하게 목록으로 이동
      return;
    }

    switch (apiType) {
      case "JOB_POSTING_ASYNC_SUCCEEDED":
        router.push(`/job-posting/${mockApplyId}`);
        break;

      case "JOB_POSTING_ASYNC_FAILED":
        router.push(`/job-posting/${mockApplyId}`);
        break;

      case "ANALYSIS_ASYNC_SUCCEEDED":
        router.push(`/mockApply/${mockApplyId}/result`);
        break;

      case "ANALYSIS_ASYNC_FAILED":
        router.push(
          `/mockApply/${mockApplyId}/result/resume-analysis-loading?error=true`,
        );
        break;

      default:
        router.push(`/mockApply/${mockApplyId}/result`);
        break;
    }
  };
  return (
    <article
      onClick={handleNotificationClick}
      className={clsx(
        "flex shrink-0 items-center gap-2 self-stretch rounded-card-s px-3 py-2",
        "cursor-pointer transition-colors hover:bg-fill-neutral-muted",
      )}
    >
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center rounded-icon-default p-2.5",
          iconStyle.frameClassName,
          notificationItem.read && "grayscale opacity-60 mix-blend-luminosity",
        )}
      >
        <Icon
          type={iconStyle.iconType}
          className={clsx("h-6 w-6 shrink-0", iconStyle.iconClassName)}
        />
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <div className="flex self-stretch">
              <h3 className="min-w-0 flex-1 overflow-hidden text-b16-med text-ellipsis text-text-neutral-title [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] [font-feature-settings:'liga'_off,'clig'_off]">
                {notificationItem.title}
              </h3>
            </div>

            <div className="flex self-stretch">
              <p className="max-w-[298px] min-w-0 flex-1 overflow-hidden text-sub14-reg text-ellipsis text-text-neutral-description [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] [font-feature-settings:'liga'_off,'clig'_off]">
                {notificationItem.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-[60px] shrink-0 items-center justify-center">
          <time className="text-center text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
            {notificationItem.timestamp}
          </time>
        </div>
      </div>
    </article>
  );
}
