"use client";

import { useEffect, useState } from "react";
import {
  fetchAnalysisByJobPosting,
  type AnalysisResult,
} from "@/lib/api/result";
import Sidebar from "@/components/mockApply/result/Sidebar";
import Trybar from "./Trybar";
import OverviewSection from "./OverviewSection";
import DetailSection from "./DetailSection";

interface ApplyResultProps {
  jobPostingId: number;
  sequence?: number;
  totalCount?: number;
  onAnalysisError?: () => void;
  onMockApplyIdChange?: (mockApplyId: number) => void;
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
  jobPostingId,
  sequence: initialSequence = 1,
  totalCount: initialTotalCount,
  onAnalysisError,
  onMockApplyIdChange,
}: ApplyResultProps) {
  const [selectedSequence, setSelectedSequence] = useState(initialSequence);
  const [questions, setQuestions] = useState<Question[]>(FALLBACK_QUESTIONS);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisErrorMessage, setAnalysisErrorMessage] = useState("");
  const [isOverview, setIsOverview] = useState(true);
  const [activeId, setActiveId] = useState("0");

  useEffect(() => {
    const controller = new AbortController();

    fetchAnalysisByJobPosting(jobPostingId, selectedSequence, controller.signal)
      .then((fetchedAnalysis) => {
        if (controller.signal.aborted) return;
        setAnalysis(fetchedAnalysis);
        setAnalysisErrorMessage("");
        onMockApplyIdChange?.(fetchedAnalysis.mockApplyId);
        // 분석 결과에서 문항 목록 추출
        const fetchedQuestions = fetchedAnalysis.questions.map((q, i) => ({
          id: String(i),
          question: q.questionContent,
        }));
        if (fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          setActiveId("0");
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setAnalysisErrorMessage(
          error instanceof Error
            ? error.message
            : "분석 결과를 불러오지 못했습니다.",
        );
        onAnalysisError?.();
      });

    return () => controller.abort();
  }, [jobPostingId, selectedSequence, onAnalysisError]);

  const handleOverview = () => {
    setIsOverview(true);
    setActiveId("");
  };

  const handleSelect = (id: string) => {
    setIsOverview(false);
    setActiveId(id);
  };

  const currentAnalysis =
    analysis?.sequence === selectedSequence ? analysis : null;
  const activeAnalysisQuestion = currentAnalysis?.questions[Number(activeId)];
  const loadingMessage =
    analysisErrorMessage || "분석 결과를 불러오는 중입니다.";

  return (
    <div className="flex-1 flex flex-row pt-8 h-full overflow-hidden">
      <Trybar
        totalCount={initialTotalCount ?? initialSequence}
        selectedSequence={selectedSequence}
        onSequenceChange={setSelectedSequence}
      />
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
