"use client";

import { useState } from "react";
import Icon, { type IconType } from "@/components/icons/Icon";

type LnbItemKey = "home" | "experience" | "apply";

interface LnbProps {
  initialActiveItem?: LnbItemKey;
  email?: string;
  creditCount?: number;
}

interface LnbNavItem {
  key: LnbItemKey;
  label: string;
  iconType: IconType;
}

const navItems: LnbNavItem[] = [
  { key: "home", label: "홈", iconType: "HOME_S" },
  { key: "experience", label: "경험기록장", iconType: "EX_S" },
  { key: "apply", label: "모의서류지원", iconType: "APPLY" },
];

const hiddenNavItemKeys: LnbItemKey[] = ["experience"];

const navItemBaseClassName =
  "flex h-9 items-center gap-2 rounded-cta-l p-3 text-[14px] font-normal leading-[150%] tracking-[-0.28px] [font-feature-settings:'liga'_off,'clig'_off]";

export default function Lnb({
  initialActiveItem,
  email = "jobdri@gmail.com",
  creditCount = 32,
}: LnbProps) {
  const [isFold, setIsFold] = useState(false);
  const [activeItem, setActiveItem] = useState<LnbItemKey | undefined>(
    initialActiveItem,
  );

  return (
    <aside
      className={`flex h-[800px] flex-col justify-between bg-bg-contents-default py-5 ${
        isFold ? "w-[52px] items-center px-2" : "w-[240px] items-start px-2"
      }`}
    >
      <div className="flex w-full flex-col gap-8">
        <div
          className={`flex h-8 w-full items-center ${
            isFold ? "justify-center px-0" : "justify-between px-3"
          }`}
        >
          {!isFold && (
            <strong className="flex h-[22px] w-[50px] items-center justify-center text-[16px] font-bold leading-[140%] text-gray-900">
              JobDri
            </strong>
          )}
          <button
            type="button"
            aria-label={isFold ? "LNB 펼치기" : "LNB 접기"}
            className="flex h-5 w-5 items-center justify-center text-icon-default"
            onClick={() => setIsFold((prevIsFold) => !prevIsFold)}
          >
            <Icon type="SIDEBAR" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex w-full flex-col items-start gap-1.5">
          {navItems
            .filter((item) => !hiddenNavItemKeys.includes(item.key))
            .map((item) => {
            const isActive = item.key === activeItem;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveItem(item.key)}
                className={`${navItemBaseClassName} ${
                  isFold ? "w-[30px] justify-center px-0" : "w-full"
                } ${
                  isActive
                    ? "bg-fill-primary-assistive text-text-primary-strong"
                    : "text-text-neutral-description"
                } ${!isActive ? "hover:bg-fill-hover" : ""}`}
              >
                <Icon
                  type={item.iconType}
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? "text-icon-primary-strong" : "text-icon-default"
                  }`}
                />
                {!isFold && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex w-full flex-col items-start justify-end gap-1">
        {!isFold && (
          <>
            <div className="flex w-full items-center justify-between px-2 py-2">
              <div className="flex items-center gap-[3px] text-label14-med text-gray-500 [font-feature-settings:'liga'_off,'clig'_off]">
                <span>크레딧</span>
                <Icon type="EX_LINK" className="h-4 w-4 text-icon-assistive" />
              </div>

              <div className="flex h-[21px] items-center justify-end gap-1">
                <Icon type="TOKEN" className="h-4 w-4 text-icon-default" />
                <span className="text-cap12-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                  {creditCount}회
                </span>
              </div>
            </div>

            <div className="h-[0.75px] w-full bg-line-neutral-default" />
          </>
        )}

        <div
          className={`flex w-full items-center gap-2 px-2 py-1.5 ${
            isFold ? "justify-center px-0" : ""
          }`}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-400 text-[14px] font-medium leading-[140%] text-text-neutral-white">
            J
          </div>
          {!isFold && (
            <span className="truncate text-cap12-med text-gray-400">
              {email}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
