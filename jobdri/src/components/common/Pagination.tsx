import React from "react";
import Icon from "./icons/Icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: "standard" | "compact";
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = "standard",
  maxVisiblePages = 7,
}) => {
  const isCompact = variant === "compact";

  const currentGroup = Math.ceil(currentPage / maxVisiblePages);
  const hasPrevGroup = currentGroup > 1;
  const lastPageOfCurrentGroup = currentGroup * maxVisiblePages;
  const hasNextGroup = lastPageOfCurrentGroup < totalPages;

  const handlePrev = () => {
    if (isCompact) {
      if (currentPage > 1) onPageChange(currentPage - 1);
    } else {
      if (hasPrevGroup) {
        const prevGroupStartPage = (currentGroup - 2) * maxVisiblePages + 1;
        onPageChange(prevGroupStartPage);
      }
    }
  };

  const handleNext = () => {
    if (isCompact) {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    } else {
      if (hasNextGroup) {
        const nextGroupStartPage = currentGroup * maxVisiblePages + 1;
        onPageChange(nextGroupStartPage);
      }
    }
  };

  const isPrevDisabled = isCompact ? currentPage === 1 : !hasPrevGroup;
  const isNextDisabled = isCompact ? currentPage === totalPages : !hasNextGroup;

  // 스탠다드 뷰의 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const startPage = (currentGroup - 1) * maxVisiblePages + 1;
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const baseButtonClass =
    "flex items-center justify-center transition-colors duration-200 ";
  const iconButtonClass = `${baseButtonClass} w-8 h-8 text-icon-neutral-default disabled:text-icon-neutral-weak disabled:cursor-not-allowed`;

  const leftIconType = isCompact ? "CHEVRON_L_S" : "CHEVRON_L";
  const rightIconType = isCompact ? "CHEVRON_R_S" : "CHEVRON_R";

  return (
    <div className="flex items-center gap-2 text-gray-700 ">
      {/* 이전 버튼 */}
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={iconButtonClass}
        aria-label="Previous"
      >
        <Icon type={leftIconType} />
      </button>

      {/* Standard Variant: 번호 나열 */}
      {variant === "standard" && (
        <div className="flex text-body16-reg items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${baseButtonClass} w-8 h-8 ${
                currentPage === page
                  ? "bg-fill-quaternary-default text-text-neutral-title rounded-icon-default"
                  : "bg-transparent text-text-neutral-title"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Compact Variant: 분수 표시 */}
      {variant === "compact" && (
        <div className="flex items-center px-2 text-text-neutral-title text-sub14-reg">
          <span>{currentPage}</span>
          <span className="mx-0.5">/</span>
          <span>{totalPages}</span>
        </div>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={iconButtonClass}
        aria-label="Next"
      >
        <Icon type={rightIconType} />
      </button>
    </div>
  );
};
