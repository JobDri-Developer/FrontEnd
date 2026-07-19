"use client";

import { useState } from "react"; // 💡 useState 추가
import { type QuestionAnalysis } from "@/lib/api/result";
import ChipTag from "@/components/common/chips/ChipTag";
import { type HighlightStatus } from "./highlightStyles";
import { scrollbarClass } from "@/components/common/scrollbar/scrollbarStyles";
import Icon from "@/components/common/icons/Icon"; // 새로 추가된 Icon 유지

const statusLabel: Record<HighlightStatus, string> = {
  proven: "적절함",
  fabricated: "구체성 부족",
  mentioned: "신뢰성 부족",
};

export interface DetailAnnotationPanelProps {
  analyses: QuestionAnalysis[];
}

export default function DetailAnnotationPanel({
  analyses,
}: DetailAnnotationPanelProps) {
  const [clickedId, setClickedId] = useState<number | null>(null);

  return (
    <div className={`flex w-80 shrink-0 flex-col gap-8 overflow-y-auto py-2`}>
      {analyses.map((analysis) => {
        const isClicked = clickedId === analysis.questionAnalysisId;

        return (
          <div
            key={analysis.questionAnalysisId}
            onClick={() => setClickedId(analysis.questionAnalysisId)}
            className={`flex flex-col gap-4 p-1 rounded-card cursor-pointer border transition-colors ${
              isClicked
                ? "border-line-primary-default bg-fill-quaternary-default-hover hover:shadow-hover"
                : "border-transparent hover:bg-fill-quaternary-default-hover"
            }`}
          >
            <div className="flex flex-col gap-2 px-4 py-3">
              {/* 칩 태그 */}
              <ChipTag
                label={
                  statusLabel[analysis.status as HighlightStatus] ??
                  analysis.status
                }
                state={analysis.status as HighlightStatus}
                className="self-start"
              />
              {/* 타이틀 */}
              <h3 className="text-b16-semibold text-text-neutral-title break-keep min-w-0">
                {analysis.reason}
              </h3>
              {/* 인용 문장 */}
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
