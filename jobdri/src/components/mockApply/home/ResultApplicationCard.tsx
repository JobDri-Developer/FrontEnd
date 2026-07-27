"use client";

import React, { useState, useRef, useEffect } from "react";
import { handleApplicationCardKeyDown } from "./ApplicationCardShared";
import type { ApplicationCardData } from "./types";
import Avatar from "./Avatar";
import Icon from "@/components/common/icons/Icon";
import { DropDownMenu } from "@/components/common/dropdown";

export function ResultApplicationCard({
  company,
  profileColor,
  position,
  createdAt,
  score,
  version = 1,
  isRetryDisabled = false,
  onDeleteClick,
  onRetryClick,
  onResumeClick,
}: ApplicationCardData & {
  companyVariant?: "default" | "none";
  isRetryDisabled?: boolean;
  onDeleteClick: () => void;
  onRetryClick?: () => void;
  onResumeClick?: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleKebabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDeleteClick(); // 부모로부터 받은 삭제 함수 실행
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRetryDisabled) return;

    setIsMenuOpen(false);
    onRetryClick?.(); // 부모로부터 받은 다시하기 함수 실행
  };

  return (
    <article
      role="button"
      tabIndex={0}
      className="relative flex w-ful p-5 flex-col cursor-pointer items-start justify-between rounded-card bg-fill-quaternary-default min-h-[160px] hover:shadow-card active:bg-fill-quaternary-default-hover"
      onClick={onResumeClick}
      onKeyDown={(event) => handleApplicationCardKeyDown(event, onResumeClick)}
    >
      <div className="flex flex-col self-stretch w-full">
        <div className="flex items-center justify-between self-stretch mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar
              name={company}
              type="company"
              color={profileColor}
              size="small"
            />
            <span className="max-w-full truncate text-b16-semibold text-text-neutral-title">
              {company}
            </span>
          </div>

          {/* 케밥 버튼 및 드롭다운 메뉴 */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleKebabClick}
              className="p-1 rounded-md text-icon-neutral-default hover:bg-fill-quaternary-assistive-hover transition-colors"
              aria-label="모의 서류 결과 메뉴"
            >
              <Icon type="KABAB" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 z-10">
                <DropDownMenu
                  items={[
                    {
                      label: "재도전하기",
                      onClick: handleRetry,
                      disabled: isRetryDisabled,
                    },
                    { label: "삭제하기", onClick: handleDelete },
                  ]}
                />
              </div>
            )}
          </div>
        </div>

        {/* 중단: 직무 이름 */}
        <div className="flex min-w-0 flex-row items-start self-stretch gap-0.5">
          <span className="max-w-full truncate text-sub14-med text-text-neutral-description">
            {position}
          </span>
          <span className="text-text-neutral-caption text-sub14-med">
            v.{version}
          </span>
        </div>
      </div>

      {/* 하단: 점수 및 날짜 */}
      <div className="flex items-end justify-between self-stretch mt-6">
        <p className="text-cap12-med text-text-neutral-caption">{createdAt}</p>
        <div className="flex flex-row justify-center items-end gap-0.5">
          <p className="text-h24-bold">{score}</p>
          <p className="text-label14-semibold">점</p>
          <Icon type="CHEVRON_R" className="text-icon-neutral-default" />
        </div>
      </div>
    </article>
  );
}
