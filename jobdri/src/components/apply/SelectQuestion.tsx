"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../common/buttons";
import { ListQ, ListQCart } from "../common/list";
import { scrollbarClass } from "../common/input/inputStyles";
import { Toast } from "../common/toast";
import AddQuestion from "./AddQuestion";
import { fetchQuestions } from "@/lib/api/questions";

const MAX_SELECT = 5;

export interface Question {
  id: string;
  question: string;
  maxLength?: number;
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
  {
    id: "q2",
    question: "사용자의 의견을 반영하여 디자인을 개선한 사례를 설명해 주세요.",
  },
  {
    id: "q3",
    question:
      "프로젝트에서 마주친 기술적 문제를 어떻게 해결했는지 서술해 주세요.",
  },
  {
    id: "q4",
    question:
      "시장 조사를 통해 새로운 기회를 발견한 경험에 대해 이야기해 주세요.",
  },
  {
    id: "q5",
    question: "협업 과정에서 갈등을 해결하고 성과를 낸 경험을 작성해 주세요.",
  },
  {
    id: "q6",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
];

interface SelectQuestionProps {
  applyId: string;
  onSelectionChange?: (count: number) => void;
  onQuestionsChange?: (questions: Question[]) => void;
}

export default function SelectQuestion({
  applyId,
  onSelectionChange,
  onQuestionsChange,
}: SelectQuestionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions(applyId)
      .then(setQuestions)
      .finally(() => setIsLoading(false));
  }, [applyId]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "normal" | "check" | "warning" | "dark"
  >("normal");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customIdCounterRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);

  const showToast = (
    message: string,
    variant: "normal" | "check" | "warning" | "dark" = "normal",
  ) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  const notify = (nextIds: string[], currentQuestions: Question[]) => {
    const selected = currentQuestions.filter((question) =>
      nextIds.includes(question.id),
    );

    onSelectionChange?.(selected.length);
    onQuestionsChange?.(selected);
  };

  const handleChange = (id: string, isSelected: boolean) => {
    if (isSelected) {
      if (selectedIds.length >= MAX_SELECT) return;
      const next = [...selectedIds, id];
      setSelectedIds(next);
      notify(next, questions);
      return;
    }

    const next = selectedIds.filter((questionId) => questionId !== id);
    setSelectedIds(next);
    notify(next, questions);
  };

  const handleRemove = (id: string) => {
    const next = selectedIds.filter((questionId) => questionId !== id);
    setSelectedIds(next);
    notify(next, questions);
    showToast("문항이 삭제되었습니다.", "normal");
  };

  const handleAdd = (question: string, maxLength: number) => {
    const newQuestion = { id: `custom_${Date.now()}`, question, maxLength };
    const nextQuestions = [newQuestion, ...questions];

    setQuestions(nextQuestions);

    if (selectedIds.length < MAX_SELECT) {
      const next = [...selectedIds, newQuestion.id];
      setSelectedIds(next);
      notify(next, nextQuestions);
    }

    showToast("문항이 추가되었습니다.", "check");
  };

  const selectedQuestions = questions.filter((question) =>
    selectedIds.includes(question.id),
  );

  return (
    <>
      <main className="mx-auto w-full max-w-[1116px]">
        {isOpen && (
          <AddQuestion onClose={() => setIsOpen(false)} onAdd={handleAdd} />
        )}
        <h1 className="my-8 text-center text-h24-bold">
          답변할 문항을 5가지 선택해주세요.
        </h1>
        <div className="flex gap-6">
          <section
            aria-label="left-container"
            className="flex-2 flex h-[540px] flex-col rounded-card-l bg-fill-quaternary-default px-8 py-7 shadow-card"
          >
            <div className="mb-8 flex flex-row items-start justify-between">
              <h2 className="text-t20-semibold">질문 목록</h2>
              <Button
                label="직접 추가"
                type="button"
                size="small"
                styleType="secondary"
                iconType="ADD_S"
                onClick={() => setIsOpen(true)}
              />
            </div>
            <div
              className={`-m-8 mt-1 mr-[1.5px] mb-[1.5px] flex min-h-0 flex-1 flex-col gap-2 overflow-visible overflow-y-auto px-8 ${scrollbarClass}`}
            >
              {questions.map((question) => (
                <ListQ
                  key={question.id}
                  question={question.question}
                  selected={selectedIds.includes(question.id)}
                  maxReached={selectedIds.length >= MAX_SELECT}
                  isCustom={question.id.startsWith("custom_")}
                  onChange={(isSelected) =>
                    handleChange(question.id, isSelected)
                  }
                />
              ))}
            </div>
          </section>

          <section
            aria-label="right-container"
            className="flex h-[496px] flex-1 flex-col gap-8 rounded-card-l bg-fill-quaternary-assistive p-7 shadow-card"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-t20-semibold text-text-neutral-description">
                선택 목록
              </h3>
              <span className="text-t20-semibold text-text-neutral-disabled">
                {selectedQuestions.length}/{MAX_SELECT}
              </span>
            </div>
            <div
              className={`flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto ${scrollbarClass}`}
            >
              {selectedQuestions.length > 0 ? (
                selectedQuestions.map((question) => (
                  <ListQCart
                    key={question.id}
                    question={question.question}
                    onChange={() => handleRemove(question.id)}
                  />
                ))
              ) : (
                <p className="mt-20 flex items-center justify-center text-t20-semibold text-text-neutral-disabled">
                  선택한 문항이 없습니다.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      {toastVisible && (
        <div className="fixed right-5 bottom-8 z-50">
          <Toast
            message={toastMessage}
            variant={toastVariant}
            onClose={() => setToastVisible(false)}
            className="w-90"
          />
        </div>
      )}
    </>
  );
}
