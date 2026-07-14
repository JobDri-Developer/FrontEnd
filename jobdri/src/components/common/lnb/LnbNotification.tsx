"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { IconButton } from "@/components/common/buttons";
import { DropDownMenu } from "@/components/common/dropdown";
import Icon, { type IconType } from "@/components/common/icons/Icon";
import useOutsideClick from "@/hooks/useOutsideClick";
import EmptyNotificationImage from "@/assets/ic_Image.svg";
import {
  lnbHiddenScrollbarClass,
  LnbScrollbar,
  useLnbScrollMetrics,
} from "./LnbScrollbar";

export interface LnbNotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type?: "normal" | "fail" | "complete";
  read?: boolean;
}

export const defaultNotificationItems: LnbNotificationItem[] = [
  {
    id: "resume-analysis-complete",
    title: "자소서 분석이 완료되었어요",
    description: "<토스 | UX리서처> 결과 보러가기.",
    timestamp: "26.07.14",
    type: "normal",
  },
  {
    id: "analysis-error",
    title: "분석중 문제가 발생했어요",
    description: "<토스 | UX리서처> 분석을 다시 시도해주세요.",
    timestamp: "26.07.14",
    type: "fail",
  },
  {
    id: "job-posting-imported",
    title: "공고 입력이 완료되었어요",
    description: "<토스 | UX리서처> 자소서 쓰러 가기.",
    timestamp: "26.07.14",
    type: "complete",
  },
  {
    id: "notification-sample-1",
    title: "알림 제목 영역입니다. 알림 제목 영역입니다.",
    description: "알림 내용 최대 25자 알림 내용 최대 25자",
    timestamp: "26.07.08",
  },
  {
    id: "notification-sample-2",
    title: "알림 제목 영역입니다. 알림 제목 영역입니다.",
    description: "알림 내용 최대 25자 알림 내용 최대 25자",
    timestamp: "YY.MM.DD",
    read: true,
  },
  {
    id: "notification-sample-3",
    title: "알림 제목 영역입니다. 알림 제목 영역입니다.",
    description: "알림 내용 최대 25자 알림 내용 최대 25자",
    timestamp: "YY.MM.DD",
    type: "fail",
    read: true,
  },
  {
    id: "notification-sample-4",
    title: "알림 제목 영역입니다. 알림 제목 영역입니다.",
    description: "알림 내용 최대 25자 알림 내용 최대 25자",
    timestamp: "YY.MM.DD",
    type: "complete",
    read: true,
  },
];

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

export function LnbNotificationButton({
  hasNotification,
  notificationItems,
}: {
  hasNotification: boolean;
  notificationItems: LnbNotificationItem[];
}) {
  const notificationMenuRef = useRef<HTMLSpanElement>(null);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] =
    useState(false);

  useOutsideClick(
    notificationMenuRef,
    () => setIsNotificationPanelOpen(false),
    isNotificationPanelOpen,
  );

  return (
    <span
      ref={notificationMenuRef}
      className="relative flex h-6 w-6 shrink-0 items-center justify-center"
    >
      <IconButton
        iconType="BELL"
        styleType={isNotificationPanelOpen ? "normal" : "weak"}
        size="s"
        buttonType="transparent"
        aria-label="알림"
        aria-expanded={isNotificationPanelOpen}
        aria-haspopup="dialog"
        onClick={() =>
          setIsNotificationPanelOpen(
            (prevIsNotificationPanelOpen) => !prevIsNotificationPanelOpen,
          )
        }
      />
      {hasNotification && (
        <span className="absolute top-px right-px flex items-center justify-center">
          <span className="h-[5px] w-[5px] rounded-full bg-icon-primary-strong" />
        </span>
      )}

      {isNotificationPanelOpen && (
        <LnbNotificationPanel
          notificationItems={notificationItems}
          className="absolute bottom-0 left-[38px] z-[80]"
        />
      )}
    </span>
  );
}

export function LnbNotificationPanel({
  notificationItems,
  className,
}: {
  notificationItems: LnbNotificationItem[];
  className?: string;
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
                onClick={() => setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen)}
              />
            </div>

            {isMenuOpen && (
              <DropDownMenu
                className="absolute top-[calc(100%+4px)] right-0 z-[90] !w-[136px]"
                items={[
                  {
                    label: "모두 읽음 표시",
                    onClick: () => setIsMenuOpen(false),
                  },
                ]}
              />
            )}
          </div>
        </div>
      </header>

      {hasNotificationItems ? (
        <LnbNotificationList notificationItems={notificationItems} />
      ) : (
        <LnbNotificationEmptyState />
      )}
    </section>
  );
}

function LnbNotificationList({
  notificationItems,
}: {
  notificationItems: LnbNotificationItem[];
}) {
  const { scrollAreaRef, scrollbarMetrics, updateScrollbarMetrics } =
    useLnbScrollMetrics(true, notificationItems.length);

  return (
    <div className="flex h-[318px] w-[460px] shrink-0 flex-col items-start gap-0 pt-2 pr-1.5 pb-4 pl-1.5">
      <div className="relative flex min-h-0 flex-1 flex-col items-start self-stretch px-1">
        <div
          ref={scrollAreaRef}
          onScroll={updateScrollbarMetrics}
          className={clsx(
            "flex min-h-0 min-w-0 flex-1 flex-col items-start self-stretch overflow-y-auto overflow-x-hidden",
            lnbHiddenScrollbarClass,
          )}
        >
          <div className="flex min-w-0 flex-col items-start self-stretch">
            {notificationItems.map((notificationItem) => (
              <LnbNotificationListItem
                key={notificationItem.id}
                notificationItem={notificationItem}
              />
            ))}
          </div>
        </div>

        <LnbScrollbar metrics={scrollbarMetrics} className="z-20" />

        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0)_90.87%,var(--color-bg-contents-default)_100%)]" />
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

function LnbNotificationListItem({
  notificationItem,
}: {
  notificationItem: LnbNotificationItem;
}) {
  const notificationType = notificationItem.type ?? "normal";
  const iconStyle = notificationIconStyles[notificationType];

  return (
    <article
      className={clsx(
        "flex shrink-0 items-center gap-2 self-stretch rounded-card-s px-3 py-2",
        notificationItem.read && "mix-blend-luminosity",
      )}
    >
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center rounded-icon-default p-2.5",
          iconStyle.frameClassName,
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
