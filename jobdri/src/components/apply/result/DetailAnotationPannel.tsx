"use client";

import { type QuestionAnalysis } from "@/lib/api/result";
import ChipTag from "@/components/common/chips/ChipTag";
import { type HighlightStatus } from "./highlightStyles";
import { scrollbarClass } from "@/components/common/input/inputStyles";

const statusLabel: Record<HighlightStatus, string> = {
  proven: "적절함",
  fabricated: "구체성 부족",
  mentioned: "신뢰성 부족",
};

interface DetailAnnotationPanelProps {
  analyses: QuestionAnalysis[];
  answer: string;
}

export default function DetailAnnotationPanel({
  analyses,
  answer,
}: DetailAnnotationPanelProps) {
  return (
    <div
      className={`flex w-100 shrink-0 flex-col gap-8 overflow-y-auto bg-fill-tertiary-default px-8 py-10  ${scrollbarClass}`}
    >
      {analyses.map((analysis) => (
        <div key={analysis.questionAnalysisId} className="flex flex-col gap-4">
          {/* 칩 태그 */}
          <ChipTag
            label={
              statusLabel[analysis.status as HighlightStatus] ?? analysis.status
            }
            state={analysis.status as HighlightStatus}
            className="self-start"
          />
          {/* 타이틀 */}
          <h3 className="text-b16-semibold text-text-neutral-white break-keep min-w-0">
            {analysis.reason}
          </h3>
          {/* 인용 문장 */}
          <p className="text-sub14-reg text-text-neutral-white">
            {analysis.sentence}
          </p>
          {/* 개선 예시 카드 */}
          {analysis.status !== "proven" && (
            <div className="flex flex-col gap-2 px-3 py-4 rounded-chip-m bg-fill-inverse-hover">
              <span className="text-cap12-semibold text-text-neutral-caption">
                개선 예시
              </span>
              <p className="text-cap12-med text-text-neutral-caption break-keep">
                {answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
