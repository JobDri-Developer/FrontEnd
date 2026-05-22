"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  custom?: boolean;
}

interface SelectQuestionProps {
  applyId: number;
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
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "normal" | "check" | "warning" | "dark"
  >("normal");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customIdCounterRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);

  const notify = useCallback(
    (nextIds: string[], currentQuestions: Question[]) => {
      const selected = currentQuestions.filter((question) =>
        nextIds.includes(question.id),
      );

      onSelectionChange?.(selected.length);
      onQuestionsChange?.(selected);
    },
    [onQuestionsChange, onSelectionChange],
  );

  useEffect(() => {
    fetchQuestions(applyId)
      .then((fetched) => {
        setErrorMessage("");
        setQuestions(fetched);
        const preSelected = fetched.filter((q) => q.selected).map((q) => q.id);
        if (preSelected.length > 0) {
          setSelectedIds(preSelected);
          notify(preSelected, fetched);
        }
      })
      .catch((error) => {
        setQuestions([]);
        setSelectedIds([]);
        notify([], []);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "문항 목록을 불러오지 못했습니다.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [applyId, notify]);

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
    customIdCounterRef.current += 1;

    const newQuestion = {
      id: `custom_${customIdCounterRef.current}`,
      question,
      maxLength,
      custom: true,
    };
    const nextQuestions = [newQuestion, ...questions];

    const next = [...selectedIds, newQuestion.id];

    setQuestions(nextQuestions);
    setSelectedIds(next);
    notify(next, nextQuestions);
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
                disabled={selectedIds.length >= MAX_SELECT}
                onClick={() => setIsOpen(true)}
              />
            </div>
            <div
              className={`-m-8 mt-1 mr-[1.5px] mb-[1.5px] flex min-h-0 flex-1 flex-col gap-2 overflow-visible overflow-y-auto px-8 ${scrollbarClass}`}
            >
              {isLoading ? (
                <p className="mt-20 flex items-center justify-center text-t20-semibold text-text-neutral-disabled">
                  문항을 불러오는 중입니다.
                </p>
              ) : errorMessage ? (
                <p className="mt-20 flex items-center justify-center text-center text-t20-semibold text-text-neutral-disabled">
                  {errorMessage}
                </p>
              ) : questions.length > 0 ? (
                questions.map((question) => (
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
                ))
              ) : (
                <p className="mt-20 flex items-center justify-center text-t20-semibold text-text-neutral-disabled">
                  불러온 문항이 없습니다.
                </p>
              )}
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
