"use client";

import React from "react";
import clsx from "clsx";
import Avatar from "../home/Avatar";
import Icon from "@/components/common/icons/Icon";
import Divider from "@/components/common/Divider";
import { scrollbarClassS } from "@/components/common/scrollbar/scrollbarStyles";

export interface JDSectionItem {
  subtitle: string;
  content: string | string[];
}

export interface JDData {
  companyName: string;
  title: string;
  sections: JDSectionItem[];
}

interface JDSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  data?: JDData;
}

const emptyJdData: JDData = {
  companyName: "",
  title: "공고 정보를 불러오는 중입니다.",
  sections: [],
};

export default function JDSidePanel({
  isOpen,
  onClose,
  onOpen,
  data = emptyJdData,
}: JDSidePanelProps) {
  return (
    <div
      className={clsx(
        "bg-white flex flex-col z-50",

        isOpen
          ? "fixed right-0 top-1/2 -translate-y-1/2 w-90 h-screen border-l border-line-neutral-assistive"
          : "fixed right-0 top-20 w-fit h-fit rounded-l-chip-s border-l border-t border-b border-line-neutral-assistive cursor-pointer  hover:bg-gray-50",

        scrollbarClassS,
      )}
      onClick={!isOpen ? onOpen : undefined}
    >
      {isOpen ? (
        <>
          {/* 닫기 버튼 */}
          <div className="px-4 pt-4 flex justify-start">
            <button
              onClick={(e) => {
                e.stopPropagation(); // 부모 div의 onClick 전파 차단
                onClose();
              }}
              className="hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center w-6 h-6"
              aria-label="닫기"
            >
              <Icon type="ARROW_DOUBLE_R20" />
            </button>
          </div>

          {/* 내부 콘텐츠 스크롤 영역 */}
          <div className="flex-1 flex flex-col px-5 py-4 overflow-y-auto w-full">
            {/* 헤더 (기업 아바타 + 타이틀) */}
            <div className="w-full flex flex-col items-start gap-2 pb-3 px-1">
              <Avatar type="company" name={data.companyName} />
              <h2 className="text-b16-semibold text-text-neutral-title leading-snug break-keep">
                {data.title}
              </h2>
            </div>

            <Divider />

            {/* 본문 루프 */}
            <div className="flex flex-col gap-6 mt-5 px-2">
              {data.sections.map((section, sectionIdx) => {
                const isMultipleLines = Array.isArray(section.content);

                return (
                  <div key={sectionIdx} className="flex flex-col gap-2">
                    <h4 className="text-sub14-med text-text-neutral-title">
                      {section.subtitle}
                    </h4>

                    {isMultipleLines ? (
                      <ul className="flex flex-col gap-1.5">
                        {(section.content as string[]).map((line, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sub14-reg text-text-neutral-description break-keep"
                          >
                            <span className="text-fill-primary-default shrink-0 mt-[6.5px] w-1.5 h-1.5 rounded-full bg-current" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sub14-reg text-text-neutral-description leading-relaxed break-keep">
                        {section.content}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={onOpen}
          className="w-full h-full px-3 py-4 flex flex-col gap-2 items-center justify-center text-text-neutral-title hover:text-fill-primary-default transition-colors cursor-pointer"
          aria-label="공고 패널 열기"
        >
          <Icon
            type="FILE_P"
            className="w-5 h-5 text-icon-primary-default shrink-0"
          />
          <p className="text-cap12-med text-text-primary-default">
            공고 확인하기
          </p>
        </button>
      )}
    </div>
  );
}
