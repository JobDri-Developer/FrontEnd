"use client";

import { LnbNotificationItem } from "@/lib/api/notification";
import {
  LnbDivider,
  LnbFoldedFooter,
  LnbFoldedHeader,
  LnbFoldedPrimaryNav,
  LnbFoldedSearchMenu,
  type LnbItemKey,
  type LnbNavItem,
} from "./LnbShared";

export interface LnbFoldedProps {
  activeItem?: LnbItemKey;
  emailInitial: string;
  hasNotification: boolean;
  notificationItems: LnbNotificationItem[];
  searchQuery: string;
  onNavItemClick: (item: LnbNavItem) => void;
  onSearchQueryChange: (value: string) => void;
  onToggleFold: () => void;
}

export default function LnbFolded({
  activeItem,
  emailInitial,
  hasNotification,
  notificationItems,
  searchQuery,
  onNavItemClick,
  onSearchQueryChange,
  onToggleFold,
}: LnbFoldedProps) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-center self-stretch">
        <LnbFoldedHeader onToggleFold={onToggleFold} />
        <LnbDivider />

        <div className="flex min-h-0 flex-1 flex-col items-start self-stretch">
          <LnbFoldedPrimaryNav
            activeItem={activeItem}
            onNavItemClick={onNavItemClick}
          />
          <LnbDivider />
          <LnbFoldedSearchMenu
            searchQuery={searchQuery}
            onSearchQueryChange={onSearchQueryChange}
          />
        </div>
      </div>

      <LnbFoldedFooter
        emailInitial={emailInitial}
        hasNotification={hasNotification}
        notificationItems={notificationItems}
      />
    </>
  );
}
