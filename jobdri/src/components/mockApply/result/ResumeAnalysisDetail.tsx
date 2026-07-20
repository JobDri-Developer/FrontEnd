"use client";

import React, { useState, useRef, useEffect } from "react";
import { QuestionList } from "../Question/QuestionList";
import { type QuestionItem as ApiQuestionItem } from "@/lib/api/questions";
import { lnbHiddenScrollbarClass } from "@/components/common/lnb/LnbScrollbar";
import DetailAnnotationPanel from "./DetailAnotationPannel";
import {
  scrollbarClassL,
  scrollbarClassS,
} from "@/components/common/scrollbar/scrollbarStyles";
import { QuestionAnalysis, type AnalysisResult } from "@/lib/api/result";
import { HighlightStatus, HighlightStyles } from "./highlightStyles";
import Icon from "@/components/common/icons/Icon";

interface ResumeAnalysisDetailProps {
  mockApplyId?: number;
  sequence?: number;
  analysisData: AnalysisResult;
  children?: React.ReactNode;
}

interface QuestionViewerProps {
  questionNumber?: number;
  questionText?: string;
  answerText?: string;
  analyses?: QuestionAnalysis[];
  selectedAnalysisId?: number | null;
  hoveredAnalysisId?: number | null;
  onAnalysisClick?: (analysisId: number) => void;
}

function QuestionViewer({
  questionNumber = 1,
  questionText = "문항이 선택되지 않았거나 등록된 내용이 없습니다.",
  answerText = "",
  analyses = [],
  hoveredAnalysisId,
  selectedAnalysisId,
  onAnalysisClick,
}: QuestionViewerProps) {
  const renderHighlightedText = () => {
    if (!answerText) return null;
    if (!analyses || analyses.length === 0) return answerText;

    const sortedAnalyses = [...analyses].sort((a, b) => a.start - b.start);
    const result = [];
    let currentIndex = 0;
    console.log("들어온 분석 데이터:", analyses);

    sortedAnalyses.forEach((analysis, idx) => {
      if (analysis.start > currentIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {answerText.slice(currentIndex, analysis.start)}
          </span>,
        );
      }

      const status = analysis.status as HighlightStatus;
      const isSelected = selectedAnalysisId === analysis.questionAnalysisId;
      const isHovered = hoveredAnalysisId === analysis.questionAnalysisId;

      const stateKey: "selected" | "hover" | "default" = isSelected
        ? "selected"
        : isHovered
          ? "hover"
          : "default";
      const styleClass = HighlightStyles[status]?.[stateKey] || "";

      result.push(
        <span
          key={`highlight-${analysis.questionAnalysisId}`}
          className={`cursor-pointer transition-colors ${styleClass}`}
          onClick={() => onAnalysisClick?.(analysis.questionAnalysisId)}
        >
          {answerText.slice(analysis.start, analysis.end)}
        </span>,
      );

      currentIndex = analysis.end;
    });

    if (currentIndex < answerText.length) {
      result.push(
        <span key="text-last">{answerText.slice(currentIndex)}</span>,
      );
    }

    return result;
  };

  return (
    <div className="flex-1 bg-white border border-gray-100 rounded-card-l pt-4 px-6 pb-7 overflow-y-auto h-full">
      <div className="flex flex-col gap-2 mb-8">
        <span className="inline-block px-3 py-1.5 w-fit bg-fill-quaternary-assistive text-label14-med text-text-neutral-description rounded-toast-l my-1.5">
          {questionNumber}번 문항
        </span>
        <h2 className="text-b16-semibold text-text-neutral-title leading-snug">
          {questionText}
        </h2>
      </div>

      {/* 🌟 렌더링 로직 적용 (whitespace-pre-line으로 줄바꿈 유지) */}
      <div className="text-sub14-reg text-text-neutral-description leading-relaxed whitespace-pre-line">
        {renderHighlightedText()}
      </div>
    </div>
  );
}

export default function ResumeAnalysisDetail({
  //   mockApplyId,
  //   sequence,
  analysisData,
  children,
}: ResumeAnalysisDetailProps) {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(
    null,
  );
  const [hoveredAnalysisId, setHoveredAnalysisId] = useState<number | null>(
    null,
  );
  const initialQuestions = analysisData.questions.map((q) => ({
    id: String(q.questionId),
    question: q.questionContent,
    answer: q.answer,
  }));

  const [questions, setQuestions] =
    useState<ApiQuestionItem[]>(initialQuestions);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialQuestions[0]?.id || null,
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      const isScrollable = scrollHeight - clientHeight > 2;
      const isNotAtBottom =
        Math.ceil(scrollTop + clientHeight) < scrollHeight - 2;
      setShowGradient(isScrollable && isNotAtBottom);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 50);
    const observer = new ResizeObserver(() => checkScroll());
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, [selectedId, questions]);

  const currentQuestionIdx = questions.findIndex((q) => q.id === selectedId);
  const currentQuestion = questions[currentQuestionIdx];

  const currentAnalyses =
    analysisData.questions.find((q) => String(q.questionId) === selectedId)
      ?.analyses || [];

  const handleAnalysisClick = (id: number) => {
    setSelectedAnalysisId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="relative flex min-h-0 flex-1 items-stretch bg-fill-quaternary-assistive self-stretch overflow-visible rounded-card-l">
      <main
        className={`flex min-h-0 flex-1 items-start justify-center self-stretch overflow-y-auto overflow-x-hidden px-16 pt-6 pb-0 ${scrollbarClassL} overflow-y-auto [scrollbar-gutter:stable_both-edges] mx-1`}
      >
        <div className="flex w-full items-start justify-center self-stretch px-2 pb-0">
          <div className="flex flex-1 flex-col items-center p-0">
            {children}
            <section className="flex items-start justify-center gap-3 self-stretch px-16 pt-8">
              <div className="flex w-full max-w-[1320px] mx-auto gap-6 items-start">
                {/* 🌟 1. 좌측 QuestionList 컨테이너에 sticky와 top-8 추가 */}
                <div className="w-62 shrink-0 sticky top-8">
                  <QuestionList
                    questions={questions}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    type="result"
                  />
                </div>

                {/* 중앙 QuestionViewer는 그대로 둠! */}
                <QuestionViewer
                  questionNumber={
                    currentQuestionIdx !== -1 ? currentQuestionIdx + 1 : 1
                  }
                  questionText={currentQuestion?.question}
                  answerText={currentQuestion?.answer}
                  analyses={currentAnalyses}
                  selectedAnalysisId={selectedAnalysisId}
                  hoveredAnalysisId={hoveredAnalysisId}
                  onAnalysisClick={handleAnalysisClick}
                />

                <div className="relative w-[360px] shrink-0 bg-bg-contents-default rounded-card-l overflow-hidden flex flex-col max-h-[536px] sticky top-8">
                  <div className="flex items-center gap-2 px-8 pt-6 pb-2 shrink-0">
                    <h3 className="text-sm font-semibold text-text-neutral-title">
                      피드백
                    </h3>
                    <span className="flex items-center justify-center text-xs font-bold text-text-primary-default bg-fill-quaternary-assistive px-1.5 py-0.5 rounded-chip-s">
                      {currentAnalyses.length > 0 && currentAnalyses.length}
                    </span>
                  </div>

                  <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className={`${scrollbarClassS} overflow-y-auto [scrollbar-gutter:stable_both-edges] overflow-x-hidden w-full flex-1 px-2 pb-3`}
                  >
                    {currentAnalyses.length > 0 ? (
                      <DetailAnnotationPanel
                        analyses={currentAnalyses}
                        selectedAnalysisId={selectedAnalysisId}
                        hoveredAnalysisId={hoveredAnalysisId}
                        onAnalysisClick={handleAnalysisClick}
                        onAnalysisHover={setHoveredAnalysisId}
                      />
                    ) : (
                      <div className="flex flex-col justify-center items-center gap-5 pb-6 mt-3">
                        <Icon type="EMPTY" />
                        <div className="flex flex-col justify-center items-center gap-2">
                          <p className="text-b16-bold text-text-neutral-caption">
                            모두 잘 작성되었어요!
                          </p>
                          <p className=" text-label14-med text-text-neutral-caption">
                            다른 문항들보다 완성도가 높아요.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {showGradient && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bg-contents-default to-transparent" />
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
