"use client";

import { useState } from "react";
import clsx from "clsx";
import { type AnalysisQuestion, type QuestionAnalysis } from "@/lib/api/result";
import DetailAnnotationPanel from "./DetailAnotationPannel";
import { highlightStyles, type HighlightStatus } from "./highlightStyles";

interface DetailSectionProps {
  question: AnalysisQuestion | undefined;
}

function buildSegments(answer: string, analyses: QuestionAnalysis[]) {
  const sorted = [...analyses].sort((a, b) => a.start - b.start);
  const segments: {
    text: string;
    status: HighlightStatus | null;
    analysisId: number | null;
  }[] = [];
  let cursor = 0;

  for (const { start, end, status, questionAnalysisId } of sorted) {
    if (start > cursor) {
      segments.push({
        text: answer.slice(cursor, start),
        status: null,
        analysisId: null,
      });
    }
    segments.push({
      text: answer.slice(start, end),
      status: status as HighlightStatus,
      analysisId: questionAnalysisId,
    });
    cursor = end;
  }

  if (cursor < answer.length) {
    segments.push({
      text: answer.slice(cursor),
      status: null,
      analysisId: null,
    });
  }

  return segments;
}

export default function DetailSection({ question }: DetailSectionProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!question) return null;

  const segments = buildSegments(question.answer, question.analyses);

  const visibleAnalyses =
    selectedId !== null
      ? question.analyses.filter((a) => a.questionAnalysisId === selectedId)
      : question.analyses;

  const handleSpanClick = (analysisId: number) => {
    setSelectedId((prev) => (prev === analysisId ? null : analysisId));
  };

  return (
    <div className="flex h-full flex-1">
      {/* 왼쪽: 문항 + 답변 */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-10">
        <h2 className="text-b16-semibold text-text-neutral-title">
          {question.questionContent}
        </h2>
        <hr className="border-line-neutral-default" />
        <p className="text-label14-med text-text-neutral-default leading-relaxed whitespace-pre-wrap ">
          {segments.map((seg, i) =>
            seg.status && seg.analysisId !== null ? (
              <span
                key={i}
                onClick={() => handleSpanClick(seg.analysisId!)}
                className={clsx(
                  selectedId === seg.analysisId
                    ? highlightStyles[seg.status].selected
                    : highlightStyles[seg.status].default,
                )}
              >
                {seg.text}
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>
      </div>
      {/* 오른쪽: 개선안 목록 */}
      <DetailAnnotationPanel analyses={visibleAnalyses} />
    </div>
  );
}
