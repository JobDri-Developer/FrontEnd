"use client";

import { LnbNotificationItem } from "@/lib/api/notification";
import {
  LnbDefaultFooter,
  LnbDefaultHeader,
  LnbDefaultPrimaryNav,
  LnbDefaultSearchMenu,
  LnbDivider,
  type LnbItemKey,
  type LnbNavItem,
  type LnbRecentItem,
} from "./LnbShared";

export interface LnbDefaultProps {
  activeItem?: LnbItemKey;
  creditCount: number;
  email: string;
  emailInitial: string;
  hasNotification: boolean;
  isRecentOpen: boolean;
  notificationItems: LnbNotificationItem[];
  recentItems: LnbRecentItem[];
  searchQuery: string;
  selectedRecentItemId?: string;
  onLogout: () => void;
  onNavItemClick: (item: LnbNavItem) => void;
  onRecentItemClick: (item: LnbRecentItem) => void;
  onSearchQueryChange: (value: string) => void;
  onToggleFold: () => void;
  onToggleRecentOpen: () => void;
  onMarkAllRead?: () => void;
  onReadItem?: (id: string) => void;
}

export default function LnbDefault({
  activeItem,
  creditCount,
  email,
  emailInitial,
  hasNotification,
  isRecentOpen,
  notificationItems,
  recentItems,
  searchQuery,
  selectedRecentItemId,
  onLogout,
  onNavItemClick,
  onRecentItemClick,
  onSearchQueryChange,
  onToggleFold,
  onToggleRecentOpen,
  onMarkAllRead,
  onReadItem,
}: LnbDefaultProps) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-start self-stretch">
        <LnbDefaultHeader onToggleFold={onToggleFold} />
        <LnbDivider />

        <div className="flex min-h-0 flex-1 flex-col items-start self-stretch">
          <LnbDefaultPrimaryNav
            activeItem={activeItem}
            onNavItemClick={onNavItemClick}
          />
          <LnbDivider />
          <LnbDefaultSearchMenu
            searchQuery={searchQuery}
            recentItems={recentItems}
            isRecentOpen={isRecentOpen}
            selectedRecentItemId={selectedRecentItemId}
            onSearchQueryChange={onSearchQueryChange}
            onToggleRecentOpen={onToggleRecentOpen}
            onRecentItemClick={onRecentItemClick}
          />
        </div>
      </div>

      <LnbDefaultFooter
        creditCount={creditCount}
        email={email}
        emailInitial={emailInitial}
        hasNotification={hasNotification}
        notificationItems={notificationItems}
        onLogout={onLogout}
        onMarkAllRead={onMarkAllRead}
        onReadItem={onReadItem}
      />
    </>
  );
}
