import React, { useState, useRef, useEffect } from "react";
import { ResultDraftStep } from "./ResultDraftStep";
import { DraftData, MOCK_API_DATA } from "./types";
import Icon from "@/components/common/icons/Icon";
import Avatar from "./Avatar";
import { DropDownMenu } from "@/components/common/dropdown";
import clsx from "clsx";

interface DraftItemProps {
  data: DraftData;
  onClick?: () => void;
  onDelete?: (id: string) => void; // 삭제 핸들러 추가
}

const DraftItem: React.FC<DraftItemProps> = ({ data, onClick, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 드롭다운을 닫는 로직
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

  const handleKababClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (onDelete) {
      onDelete(data.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center justify-between p-4 rounded-card transition-colors",
        "active:bg-fill-quaternary-assistive-pressed",
        "bg-transparent hover:bg-fill-quaternary-assistive-hover",
        onClick && "cursor-pointer",
      )}
    >
      <div className="flex items-center w-[618px] gap-4 flex-1">
        <Avatar name={data.companyName} size="medium" />

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-label14-semibold">
            {data.companyName}
            <Icon type="CHEVRON_R_S" className="text-icon-neutral-strong" />
          </div>
          <span className="text-cap12-med text-text-neutral-description">
            {data.position}
          </span>
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <ResultDraftStep
          currentStep={data.currentStep}
          totalSteps={data.totalSteps}
        />
      </div>

      <div className="flex items-center justify-end gap-4 flex-1">
        <span className="text-cap12-med w-[160px] pl-2 text-text-neutral-caption">
          {data.updatedAt}
        </span>

        <div className="relative" ref={menuRef}>
          <button
            onClick={handleKababClick}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <Icon type="KABAB" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 z-10">
              <DropDownMenu
                items={[
                  {
                    label: "삭제하기",
                    onClick: handleDeleteClick,
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ResultDraftCard() {
  const [drafts, setDrafts] = useState<DraftData[]>(MOCK_API_DATA);

  const handleItemClick = (id: string) => {
    console.log(`${id}번 아이템 클릭됨! 상세 페이지 이동`);
  };

  const handleDelete = (id: string) => {
    console.log(`${id}번 아이템 삭제 요청!`);
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-3xl border border-dashed border-purple-300">
      <div className="flex flex-col gap-2">
        {drafts.map((draft) => (
          <DraftItem
            key={draft.id}
            data={draft}
            onClick={() => handleItemClick(draft.id)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
