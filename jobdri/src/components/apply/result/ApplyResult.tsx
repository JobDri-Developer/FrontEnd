"use client";

import { useEffect, useState } from "react";
import { fetchSelectedQuestions } from "@/lib/api/questions";
import { fetchAnalysis, type AnalysisResult } from "@/lib/api/result";
import Sidebar from "@/components/apply/result/Sidebar";
import Trybar from "./Trybar";
import OverviewSection from "./OverviewSection";
import DetailSection from "./DetailSection";

interface ApplyResultProps {
  applyId: number;
  sequence?: number;
  onAnalysisError?: () => void;
}

interface Question {
  id: string;
  question: string;
}

const FALLBACK_QUESTIONS: Question[] = [
  { id: "f0", question: "지원 동기를 500자 이내로 작성해주세요." },
  {
    id: "f1",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
  {
    id: "f2",
    question: "프로젝트에서 마주친 기술적 어려움과 해결 방법을 설명해주세요.",
  },
  {
    id: "f3",
    question: "프로젝트에서 마주친 기술적 어려움과 해결 방법을 설명해주세요.",
  },
  {
    id: "f4",
    question: "프로젝트에서 마주친 기술적 어려움과 해결 방법을 설명해주세요.",
  },
];

function ResultLoadingState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-b16-semibold text-text-neutral-caption">
      {message}
    </div>
  );
}

export default function ApplyResult({
  applyId,
  sequence = 1,
  onAnalysisError,
}: ApplyResultProps) {
  const [questions, setQuestions] = useState<Question[]>(FALLBACK_QUESTIONS);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<{
    applyId: number;
    message: string;
  } | null>(null);
  const [isOverview, setIsOverview] = useState(true);
  const [activeId, setActiveId] = useState(FALLBACK_QUESTIONS[0].id);

  useEffect(() => {
    fetchSelectedQuestions(applyId)
      .then((fetched) => {
        if (fetched.length > 0) {
          setQuestions(fetched);
          setActiveId(fetched[0].id);
        }
      })
      .catch(() => {});

    fetchAnalysis(applyId, sequence)
      .then((fetchedAnalysis) => {
        setAnalysis(fetchedAnalysis);
        setAnalysisError(null);
      })
      .catch((error) => {
        setAnalysisError({
          applyId,
          message:
            error instanceof Error
              ? error.message
              : "분석 결과를 불러오지 못했습니다.",
        });
        onAnalysisError?.();
      });
  }, [applyId, sequence, onAnalysisError]);

  const handleOverview = () => {
    setIsOverview(true);
    setActiveId("");
  };

  const handleSelect = (id: string) => {
    setIsOverview(false);
    setActiveId(id);
  };

  const currentAnalysis = analysis?.mockApplyId === applyId ? analysis : null;
  const activeAnalysisQuestion = currentAnalysis?.questions[Number(activeId)];
  const analysisErrorMessage =
    analysisError?.applyId === applyId ? analysisError.message : "";
  const loadingMessage =
    analysisErrorMessage || "분석 결과를 불러오는 중입니다.";

  return (
    <div className="flex-1 flex flex-row pt-8 h-full overflow-hidden">
      <Trybar applyId={applyId} />
      <Sidebar
        questions={questions}
        activeId={activeId}
        onSelect={handleSelect}
        onOverview={handleOverview}
        isOverview={isOverview}
      />
      <section className="flex-1">
        {!currentAnalysis ? (
          <ResultLoadingState message={loadingMessage} />
        ) : isOverview ? (
          <OverviewSection analysis={currentAnalysis} />
        ) : (
          <DetailSection question={activeAnalysisQuestion} />
        )}
      </section>
    </div>
  );
}
