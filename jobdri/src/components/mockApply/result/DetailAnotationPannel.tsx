"use client";

import { useEffect, useRef } from "react";
import { type QuestionAnalysis } from "@/lib/api/result";
import ChipTag from "@/components/common/chips/ChipTag";
import { type highlightStatus } from "./highlightStyles";
import Icon from "@/components/common/icons/Icon";

const statusLabel: Record<HighlightStatus, string> = {
  proven: "적절함",
  fabricated: "구체성 부족",
  mentioned: "신뢰성 부족",
};

export interface DetailAnnotationPanelProps {
  analyses: QuestionAnalysis[];
  // 🌟 부모로부터 상태와 핸들러를 받음
  selectedAnalysisId: number | null;
  hoveredAnalysisId: number | null;
  onAnalysisClick: (id: number) => void;
  onAnalysisHover: (id: number | null) => void;
}

export default function DetailAnnotationPanel({
  analyses,
  selectedAnalysisId,
  hoveredAnalysisId,
  onAnalysisClick,
  onAnalysisHover,
}: DetailAnnotationPanelProps) {
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedAnalysisId && cardRefs.current[selectedAnalysisId]) {
      cardRefs.current[selectedAnalysisId]?.scrollIntoView({
        behavior: "smooth",
        block: "start", // 최상단으로 올리되, 공간이 부족한 마지막 카드는 알아서 바닥에 맞춤
      });
    }
  }, [selectedAnalysisId]);

  return (
    <div className="flex w-80 shrink-0 flex-col gap-8 py-2">
      {analyses.map((analysis) => {
        const isSelected = selectedAnalysisId === analysis.questionAnalysisId;
        const isHovered = hoveredAnalysisId === analysis.questionAnalysisId;

        return (
          <div
            key={analysis.questionAnalysisId}
            // 🌟 렌더링 시점에 자기 자신(DOM)을 ref에 저장
            ref={(el) => {
              cardRefs.current[analysis.questionAnalysisId] = el;
            }}
            // 🌟 이벤트 연결 (클릭 및 호버)
            onClick={() => onAnalysisClick(analysis.questionAnalysisId)}
            onMouseEnter={() => onAnalysisHover(analysis.questionAnalysisId)}
            onMouseLeave={() => onAnalysisHover(null)}
            className={`flex flex-col gap-4 p-1 rounded-card cursor-pointer border transition-colors ${
              isSelected
                ? "border-line-primary-default bg-fill-quaternary-default-hover shadow-hover"
                : isHovered
                  ? "border-transparent bg-fill-quaternary-default-hover"
                  : "border-transparent hover:bg-fill-quaternary-default-hover"
            }`}
          >
            <div className="flex flex-col gap-2 px-4 py-3">
              <ChipTag
                label={
                  statusLabel[analysis.status as HighlightStatus] ??
                  analysis.status
                }
                state={analysis.status as HighlightStatus}
                className="self-start"
              />
              <h3 className="text-b16-semibold text-text-neutral-title break-keep min-w-0">
                {analysis.reason}
              </h3>
              <p className="text-sub14-reg text-text-neutral-description">
                {analysis.sentence}
              </p>
            </div>

            {analysis.status !== "proven" && (
              <div className="flex flex-col gap-2 p-4 rounded-chip-m bg-blue-100">
                <div className="flex flex-row gap-0.5">
                  <Icon type="SPARKLE" className="text-fill-primary-default" />
                  <span className="text-cap12-semibold text-text-primary-default">
                    개선 예시
                  </span>
                </div>
                <p className="text-cap12-med text-text-primary-default break-keep">
                  {analysis.improvement}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
