"use client";

import React, { useState } from "react";
import { ResultApplicationCard } from "@/components/mockApply/home/ResultApplicationCard";
import { Pagination } from "@/components/common/Pagination";
import type { ApplicationCardData } from "./types";

interface ResultApplicationListProps {
  applications: ApplicationCardData[];
  onDelete: (application: ApplicationCardData) => void;
  onRetry: (application: ApplicationCardData) => void;
  onResume: (application: ApplicationCardData) => void;
}

export default function ResultApplicationList({
  applications,
  onDelete,
  onRetry,
  onResume,
}: ResultApplicationListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9; // 디자인 시안에 맞춰 3x3 (9개) 배치

  const totalPages = Math.max(
    1,
    Math.ceil(applications.length / ITEMS_PER_PAGE),
  );
  const currentApplications = applications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // 데이터가 없으면 렌더링하지 않음
  if (applications.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      {/* 1. 헤더 영역 */}
      <header>
        <h2 className="text-label14-med text-text-neutral-description flex items-center gap-1.5">
          분석 완료
          <span className="text-text-primary-default">
            {applications.length}
          </span>
        </h2>
      </header>

      {/* 2. 3열 카드 그리드 레이아웃 */}
      <div className="grid grid-cols-3 gap-4">
        {currentApplications.map((application) => (
          <ResultApplicationCard
            key={application.id}
            {...application}
            onDeleteClick={() => onDelete(application)}
            onRetryClick={() => onRetry(application)}
            onResumeClick={() => onResume(application)}
          />
        ))}
      </div>

      {/* 3. 하단 Standard 페이지네이션 (9개 초과일 때만 노출) */}
      {applications.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center mt-10">
          <Pagination
            variant="standard"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </section>
  );
}
