"use client";

import React, { useState, useRef, useEffect } from "react";
import { QuestionList } from "../Question/QuestionList";
import { type QuestionItem as ApiQuestionItem } from "@/lib/api/questions";
import { lnbHiddenScrollbarClass } from "@/components/common/lnb/LnbScrollbar";
import DetailAnnotationPanel from "./DetailAnotationPannel";
import { scrollbarClassS } from "@/components/common/scrollbar/scrollbarStyles";

interface ResumeAnalysisDetailProps {
  mockApplyId?: number;
  sequence?: number;
  children?: React.ReactNode;
}

const MOCK_QUESTIONS: ApiQuestionItem[] = [
  {
    id: "1",
    question:
      "디자이너로서 프로젝트에 AI를 활용한 파이프라인을 구축한 경험이 있다면, 해당 과정을 상세히 기술하고 느낀 점을 작성해주세요.",
    answer:
      "잡드리 서비스 기획 및 디자인 과정에서 AI를 활용한 디자인 시스템 구축 파이프라인을 경험했습니다. 기존에는 컴포넌트 정의, 네이밍, 디스크립션 작성을 디자이너가 전부 수동으로 진행했습니다. 이 과정에서 일관성이 떨어지고, 개발팀과의 커뮤니케이션 비용이 높아지는 문제가 반복되었습니다. 이를 해결하기 위해 AI를 활용한 컴포넌트 문서화 파이프라인을 구축했습니다...",
  },
  {
    id: "2",
    question:
      "기존 디자인 작업 방식의 비효율을 발견하고, 이를 개선하기 위해 새로운 도구나 프로세스를 도입했던 경험을 서술해주세요.",
    answer:
      "이전 프로젝트에서 팀원 간의 피그마 컴포넌트 싱크가 맞지 않아 퍼블리싱 단계에서 잦은 수정 작업이 발생했습니다. 이를 해결하고자 디자인 토큰 관리 플러그인을 도입하고 자동화 스크립트를 연결하여...",
  },
  {
    id: "3",
    question:
      "협업 과정에서 반복적으로 발생하는 커뮤니케이션 문제를 발견하고 이를 주도적으로 해결한 경험이 있나요?",
    answer:
      "개발팀과의 정기적인 디자인 리뷰 세션을 제안하여 기획 의도를 명확히 공유했습니다. 소통의 간극을 줄이기 위해 인터랙션 정의서 가이드를 프레임별로 상세화하여 제공한 결과, 커뮤니케이션 오류를 40% 이상 줄일 수 있었습니다.",
  },
];

const MOCK_ANALYSES: Record<string, any[]> = {
  "1": [
    {
      questionAnalysisId: 101,
      status: "proven", // 적절함
      reason: "모호한 표현보다는 구체적으로 기술해주세요.",
      sentence:
        "단순히 AI를 사용했다고 쓰는 대신, 어느 지점에서 디자이너의 판단이 개입했는지를 구체적인 사례로 나열했어요.",
    },
    {
      questionAnalysisId: 102,
      status: "mentioned", // 신뢰성 부족
      reason: "수치 없는 표현은 신뢰를 얻기 어려워요.",
      sentence:
        '"크게 단축"이라는 표현은 주관적 서술이에요. 얼마나 단축됐는지 수치가 없으면 판단하기 어려워요.',
      improvement:
        "친환경차로의 전환기에서 사용자가 겪는 새로운 불편함을 해결하고, 신뢰할 수 있는 HMI를 설계하고자 지원했습니다.",
    },
    {
      questionAnalysisId: 103,
      status: "fabricated", // 신뢰성 부족
      reason: "수치 없는 표현은 신뢰를 얻기 어려워요.",
      sentence:
        '"크게 단축"이라는 표현은 주관적 서술이에요. 얼마나 단축됐는지 수치가 없으면 판단하기 어려워요.',
      improvement:
        "친환경차로의 전환기에서 사용자가 겪는 새로운 불편함을 해결하고, 신뢰할 수 있는 HMI를 설계하고자 지원했습니다.",
    },
  ],
  "2": [
    {
      questionAnalysisId: 201,
      status: "proven",
      reason: "프로세스 개선 목적이 명확하게 드러납니다.",
      sentence:
        "디자인 토큰 관리 플러그인을 도입하고 자동화 스크립트를 연결하여 반복 작업을 덜어냈습니다.",
    },
  ],
  "3": [
    {
      questionAnalysisId: 301,
      status: "fabricated", // 구체성 부족
      reason: "해결 방안의 인과관계 보완이 필요합니다.",
      sentence: "가이드를 상세화하여 제공한 결과 커뮤니케이션 오류를 줄임.",
      improvement:
        "어떤 방식으로 프레임을 상세화했는지, 구체적인 산출물 예시를 덧붙여주시면 훨씬 좋은 문장이 됩니다.",
    },
  ],
};

interface QuestionViewerProps {
  questionNumber?: number;
  questionText?: string;
  answerText?: string;
}

function QuestionViewer({
  questionNumber = 1,
  questionText = "문항이 선택되지 않았거나 등록된 내용이 없습니다.",
  answerText = "",
}: QuestionViewerProps) {
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
      <div className="text-sub14-reg text-text-neutral-description leading-relaxed ">
        {answerText}
      </div>
    </div>
  );
}

export default function ResumeAnalysisDetail({
  mockApplyId,
  sequence,
  children,
}: ResumeAnalysisDetailProps) {
  const [questions, setQuestions] = useState<ApiQuestionItem[]>(MOCK_QUESTIONS);
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(false);

  // 그라데이션 표시 논리 개선 (소수점 오차 완벽 차단)
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;

      // 2px 정도의 여유 오차를 두어 확실하게 내용이 길 때만 스크롤이 있다고 판단
      const isScrollable = scrollHeight - clientHeight > 2;
      const isNotAtBottom =
        Math.ceil(scrollTop + clientHeight) < scrollHeight - 2;

      setShowGradient(isScrollable && isNotAtBottom);
    }
  };

  // ResizeObserver 도입 (렌더링 속도 차이로 인한 오류 해결)
  useEffect(() => {
    // 탭 클릭 직후 렌더링 지연을 고려해 50ms 후 체크
    const timer = setTimeout(checkScroll, 50);

    // 요소의 크기가 변할 때마다 무조건 다시 체크
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

  const handleAddQuestion = () => {
    if (questions.length >= 5) return;
    const newId = String(Date.now());
    const newQuestion: ApiQuestionItem = {
      id: newId,
      question: "새 문항",
      answer: "",
    };
    setQuestions([...questions, newQuestion]);
    setSelectedId(newId);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) return;
    const filtered = questions.filter((q) => q.id !== id);
    setQuestions(filtered);

    if (selectedId === id) {
      setSelectedId(filtered[0].id);
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 items-stretch bg-fill-quaternary-assistive self-stretch overflow-visible">
      <main
        className={`flex min-h-0 flex-1 items-start justify-center self-stretch overflow-y-auto overflow-x-hidden px-2 pb-0 ${lnbHiddenScrollbarClass}`}
      >
        <div className="flex w-full items-start justify-center self-stretch px-2 pb-0">
          <div className="flex flex-1 flex-col items-center p-0">
            {children}
            <section className="flex items-start justify-center gap-3 self-stretch px-16 pt-8">
              <div className="flex w-full max-w-[1320px] mx-auto gap-6 items-start">
                <div className="w-62 shrink-0">
                  <QuestionList
                    questions={questions}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onAdd={handleAddQuestion}
                    onDelete={handleDeleteQuestion}
                    type="result"
                  />
                </div>

                <QuestionViewer
                  questionNumber={
                    currentQuestionIdx !== -1 ? currentQuestionIdx + 1 : 1
                  }
                  questionText={currentQuestion?.question}
                  answerText={currentQuestion?.answer}
                />

                <div className="relative w-[360px] shrink-0 bg-bg-contents-default rounded-card-l overflow-hidden flex flex-col max-h-[536px]">
                  <div className="flex items-center gap-2 px-8 pt-6 pb-2 shrink-0">
                    <h3 className="text-sm font-semibold text-text-neutral-title">
                      피드백
                    </h3>
                    <span className="flex items-center justify-center text-xs font-bold text-text-primary-default bg-fill-quaternary-assistive px-1.5 py-0.5 rounded-chip-s">
                      {selectedId ? MOCK_ANALYSES[selectedId]?.length || 0 : 0}
                    </span>
                  </div>

                  <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className={`${scrollbarClassS} overflow-y-auto overflow-x-hidden w-full flex-1 min-h-0 px-3 pb-3`}
                  >
                    <DetailAnnotationPanel
                      analyses={
                        selectedId ? (MOCK_ANALYSES[selectedId] ?? []) : []
                      }
                    />
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
