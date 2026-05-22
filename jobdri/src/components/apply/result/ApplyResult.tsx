"use client";

import { useEffect, useState } from "react";
import { fetchSelectedQuestions } from "@/lib/api/questions";
import Sidebar from "@/components/apply/result/Sidebar";

interface ApplyResultProps {
  applyId: number;
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

export default function ApplyResult({ applyId }: ApplyResultProps) {
  const [questions, setQuestions] = useState<Question[]>(FALLBACK_QUESTIONS);
  const [isOverview, setIsOverview] = useState(false);
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
  }, [applyId]);

  const handleOverview = () => {
    setIsOverview(true);
    setActiveId("");
  };

  const handleSelect = (id: string) => {
    setIsOverview(false);
    setActiveId(id);
  };

  const activeQuestion = questions.find((q) => q.id === activeId);

  return (
    <div className="flex gap-6 py-8">
      <Sidebar
        questions={questions}
        activeId={activeId}
        onSelect={handleSelect}
        onOverview={handleOverview}
        isOverview={isOverview}
      />

      <section className="flex-1">
        {isOverview ? (
          <div>
            <h2 className="text-h24-bold">개요</h2>
            {/* 개요 콘텐츠 */}
          </div>
        ) : (
          <div>
            <h2 className="text-t20-semibold">{activeQuestion?.question}</h2>
            {/* 개선안 상세 콘텐츠 */}
          </div>
        )}
      </section>
    </div>
  );
}
